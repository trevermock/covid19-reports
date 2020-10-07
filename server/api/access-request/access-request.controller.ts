import { Response } from 'express';
import { getConnection } from 'typeorm';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../util/error-types';
import { ApiRequest, OrgParam } from '../index';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { User } from '../user/user.model';
import { AccessRequest, AccessRequestStatus } from './access-request.model';

class AccessRequestController {

  async getAccessRequests(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    const requests = await AccessRequest.find({
      relations: ['user', 'org'],
      where: {
        org: req.appOrg.id,
        status: AccessRequestStatus.Pending,
      },
    });

    res.json(requests);
  }

  async issueAccessRequest(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const orgId = parseInt(req.params.orgId);
    if (Number.isNaN(orgId) || orgId < 0) {
      throw new BadRequestError(`Invalid organization id: ${orgId}`);
    }

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
      relations: ['contact'],
    });

    if (!org) {
      throw new NotFoundError('Organization was not found.');
    }

    let request = await AccessRequest.findOne({
      where: {
        user: req.appUser.edipi,
        org: org.id,
      },
    });

    let newRequest: AccessRequest | null = null;
    await getConnection().transaction(async manager => {
      if (request) {
        if (request.status === AccessRequestStatus.Denied) {
          // Remove the denied request so that we can issue a new one.
          await manager.remove(request);
        } else {
          throw new BadRequestError('The access request has already been issued.');
        }
      }

      request = new AccessRequest();
      request.user = req.appUser;
      request.org = org;
      request.requestDate = new Date();
      newRequest = await manager.save(request);
    });

    res.status(201);
    res.json(newRequest);
  }

  async cancelAccessRequest(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const orgId = parseInt(req.params.orgId);
    if (Number.isNaN(orgId) || orgId < 0) {
      throw new BadRequestError(`Invalid organization id: ${orgId}`);
    }

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization was not found.');
    }

    const request = await AccessRequest.findOne({
      where: {
        user: req.appUser.edipi,
        org: org.id,
      },
    });

    if (!request) {
      throw new NotFoundError('Access request was not found.');
    }

    await request.remove();

    res.status(204).send();
  }

  async approveAccessRequest(req: ApiRequest<OrgParam, ApproveAccessRequestBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    const orgId = req.appOrg.id;

    if (!req.body.requestId) {
      throw new BadRequestError('Missing access request id');
    }

    if (!req.body.roleId) {
      throw new BadRequestError('Missing role for approved access request');
    }

    const accessRequest = await AccessRequest.findOne({
      relations: ['user'],
      where: {
        id: req.body.requestId,
        org: orgId,
      },
    });

    if (!accessRequest) {
      throw new NotFoundError('Access request was not found');
    }

    const role = await Role.findOne({
      where: {
        id: req.body.roleId,
        org: orgId,
      },
    });

    if (!role) {
      throw new NotFoundError('Role was not found');
    }

    if (!req.appRole || !req.appRole.isSupersetOf(role)) {
      throw new UnauthorizedError('Unable to assign a role with greater permissions than your current role.');
    }

    const user = await User.findOne({
      relations: ['roles'],
      where: {
        edipi: accessRequest.user!.edipi,
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          roles: 'user.roles',
          org: 'roles.org',
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User was not found');
    }

    const existingRole = user.roles!.find(userRole => userRole.org!.id === orgId);

    if (existingRole) {
      await accessRequest.remove();
      throw new BadRequestError('User already has a role in the organization');
    }

    user.roles!.push(role);

    await user.save();

    const processedRequest = await accessRequest.remove();

    res.json({
      success: true,
      request: processedRequest,
    });
  }

  async denyAccessRequest(req: ApiRequest<OrgParam, AccessRequestBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    if (!req.body.requestId) {
      throw new BadRequestError('Missing access request id');
    }

    const request = await AccessRequest.findOne({
      where: {
        id: req.body.requestId,
        org: req.appOrg.id,
      },
    });

    if (!request) {
      throw new NotFoundError('Access request was not found.');
    }

    request.status = AccessRequestStatus.Denied;
    const deniedRequest = request.save();

    res.json(deniedRequest);
  }
}

type AccessRequestBody = {
  requestId: number,
};

type ApproveAccessRequestBody = {
  roleId: number,
} & AccessRequestBody;

export default new AccessRequestController();
