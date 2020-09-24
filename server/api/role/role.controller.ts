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

    if (!req.body.index_prefix) {
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
  if (body.index_prefix != null) {
    role.index_prefix = body.index_prefix;
  }
  if (body.can_manage_users != null) {
    role.can_manage_users = body.can_manage_users;
  }
  if (body.can_manage_roles != null) {
    role.can_manage_roles = body.can_manage_roles;
  }
  if (body.can_manage_roster != null) {
    role.can_manage_roster = body.can_manage_roster;
  }
  if (body.can_manage_dashboards != null) {
    role.can_manage_dashboards = body.can_manage_dashboards;
  }
  if (body.can_view_roster != null) {
    role.can_view_roster = body.can_view_roster;
  }
  if (body.can_view_muster != null) {
    role.can_view_muster = body.can_view_muster;
  }
  if (body.notify_on_access_request != null) {
    role.notify_on_access_request = body.notify_on_access_request;
  }
}

type RoleBody = {
  name?: string
  description?: string
  index_prefix?: string
  can_manage_users?: boolean
  can_manage_roles?: boolean
  can_manage_roster?: boolean
  can_manage_dashboards?: boolean
  can_view_roster?: boolean
  can_view_muster?: boolean
  notify_on_access_request?: boolean
};

export default new RoleController();
