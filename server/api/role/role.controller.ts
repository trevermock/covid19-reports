import { Response } from 'express';
import { ApiRequest, OrgParam, OrgRoleParams } from '../index';
import { Role } from './role.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';

class RoleController {

  async getOrgRoles(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const roles = await Role.find({
      where: {
        org: req.appOrg.id,
      },
    });

    res.json(roles);
  }

  async addRole(req: ApiRequest<OrgParam, AddRoleBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a role.');
    }

    if (!req.body.description) {
      throw new BadRequestError('A description must be supplied when adding a role.');
    }

    const role = new Role();
    role.name = req.body.name;
    role.description = req.body.description;
    role.org = req.appOrg;
    setRolePermissionsFromBody(role, req.body);
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

    const removedRole = await role.remove();

    res.json(removedRole);
  }

  async updateRole(req: ApiRequest<OrgRoleParams, UpdateRoleBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }
    const roleId = parseInt(req.params.roleId);
    const name = req.body.name;
    const description = req.body.description;

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    if (name != null) {
      role.name = name;
    }

    if (description != null) {
      role.description = description;
    }

    setRolePermissionsFromBody(role, req.body);
    const updatedRole = await role.save();

    res.json(updatedRole);
  }

}

function setRolePermissionsFromBody(role: Role, body: RolePermissionsBody) {
  if (body.can_manage_users !== undefined) {
    role.can_manage_users = body.can_manage_users;
  }
  if (body.can_manage_roles !== undefined) {
    role.can_manage_roles = body.can_manage_roles;
  }
  if (body.can_manage_roster !== undefined) {
    role.can_manage_roster = body.can_manage_roster;
  }
  if (body.can_view_roster !== undefined) {
    role.can_view_roster = body.can_view_roster;
  }
}

type RolePermissionsBody = {
  can_manage_users?: boolean
  can_manage_roles?: boolean
  can_manage_roster?: boolean
  can_view_roster?: boolean
};

type AddRoleBody = {
  name: string
  description: string
} & RolePermissionsBody;

type UpdateRoleBody = AddRoleBody;

export default new RoleController();
