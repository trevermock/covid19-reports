import { Response } from 'express';
import { ApiRequest, OrgParam, OrgRoleParams } from '../index';
import { Role } from './role.model';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../util/error-types';

class RoleController {

  async getOrgRoles(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const roles = await Role.find({
      where: {
        org: req.appOrg.id,
      },
    });

    res.json(filterVisibleRoles(req.appRole, roles));
  }

  async addRole(req: ApiRequest<OrgParam, RoleBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a role.');
    }

    if (!req.body.description) {
      throw new BadRequestError('A description must be supplied when adding a role.');
    }

    if (!req.body.indexPrefix) {
      throw new BadRequestError('An index prefix must be supplied when adding a role.');
    }

    const role = new Role();
    role.org = req.appOrg;
    setRoleFromBody(role, req.body);

    if (!req.appRole || !req.appRole.isSupersetOf(role)) {
      throw new UnauthorizedError('Unable to create a role with greater permissions than your current role.');
    }

    const newRole = await role.save();

    await res.status(201).json(newRole);
  }

  async getRole(req: ApiRequest<OrgRoleParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    if (!req.appRole || !req.appRole.isSupersetOf(role)) {
      throw new UnauthorizedError('Insufficient privileges to view this role.');
    }

    res.json(role);
  }

  async deleteRole(req: ApiRequest<OrgRoleParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    if (!req.appRole || !req.appRole.isSupersetOf(role)) {
      throw new UnauthorizedError('Insufficient privileges to delete this role.');
    }

    const removedRole = await role.remove();

    res.json(removedRole);
  }

  async updateRole(req: ApiRequest<OrgRoleParams, RoleBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }
    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    setRoleFromBody(role, req.body);

    if (!req.appRole || !req.appRole.isSupersetOf(role)) {
      throw new UnauthorizedError('Unable to update a role with greater permissions than your current role.');
    }

    const updatedRole = await role.save();

    res.json(updatedRole);
  }

}

function filterVisibleRoles(currentRole: Role, roles: Role[]) {
  return roles.filter(role => currentRole.isSupersetOf(role));
}

function setRoleFromBody(role: Role, body: RoleBody) {
  if (body.name != null) {
    role.name = body.name;
  }
  if (body.description != null) {
    role.description = body.description;
  }
  if (body.indexPrefix != null) {
    role.indexPrefix = body.indexPrefix;
  }
  if (body.canManageUsers != null) {
    role.canManageUsers = body.canManageUsers;
  }
  if (body.canManageRoles != null) {
    role.canManageRoles = body.canManageRoles;
  }
  if (body.canManageRoster != null) {
    role.canManageRoster = body.canManageRoster;
  }
  if (body.canManageDashboards != null) {
    role.canManageDashboards = body.canManageDashboards;
  }
  if (body.canViewRoster != null) {
    role.canViewRoster = body.canViewRoster;
  }
  if (body.canViewMuster != null) {
    role.canViewMuster = body.canViewMuster;
  }
  if (body.notifyOnAccessRequest != null) {
    role.notifyOnAccessRequest = body.notifyOnAccessRequest;
  }
}

type RoleBody = {
  name?: string
  description?: string
  indexPrefix?: string
  canManageUsers?: boolean
  canManageRoles?: boolean
  canManageRoster?: boolean
  canManageDashboards?: boolean
  canViewRoster?: boolean
  canViewMuster?: boolean
  notifyOnAccessRequest?: boolean
};

export default new RoleController();
