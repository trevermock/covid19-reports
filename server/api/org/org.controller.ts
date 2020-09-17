import { Response } from 'express';
import { ApiRequest, OrgParam } from '../index';
import { Org } from './org.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';

class OrgController {

  async getOrg(req: ApiRequest<OrgParam>, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization was not found');
    }

    res.json(org);
  }

  async addOrg(req: ApiRequest<null, AddOrgBody>, res: Response) {
    if (!req.body.name) {
      throw new BadRequestError('An organization name must be supplied when adding an organization.');
    }

    if (!req.body.description) {
      throw new BadRequestError('An organization description must be supplied when adding an organization.');
    }

    const org = new Org();
    org.name = req.body.name;
    org.description = req.body.description;
    const newOrg = await org.save();

    await res.status(201).json(newOrg);
  }

  async deleteOrg(req: ApiRequest<OrgParam>, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization could not be found.');
    }

    const removedOrg = await org.remove();

    res.json(removedOrg);
  }

  async updateOrg(req: ApiRequest<OrgParam, UpdateOrgBody>, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const name = req.body.name;
    const description = req.body.description;

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization could not be found.');
    }

    if (name) {
      org.name = name;
    }

    if (description) {
      org.description = description;
    }

    const updatedOrg = await org.save();

    res.json(updatedOrg);
  }
}

type AddOrgBody = {
  name: string
  description: string
};

type UpdateOrgBody = AddOrgBody;

export default new OrgController();
