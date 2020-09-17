import { Response } from 'express';
import { Role } from './role.model';
import { Org } from '../org/org.model';
import { BadRequestError, NotFoundError } from '../../util/error';

export namespace RoleController {

  export async function getOrgRoles(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const roles = await Role.find({
      where: {
        org: orgId,
      },
    });

    await res.json(roles);
  }

  export async function addRole(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);

    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a role.');
    }

    if (!req.body.description) {
      throw new BadRequestError('A description must be supplied when adding a role.');
    }

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization for role was not found.');
    }

    const role = new Role();
    role.name = req.body.name;
    role.description = req.body.description;
    role.org = org;
    setRolePermissionsFromBody(role, req.body);
    const newRole = await role.save();

    await res.status(201).json(newRole);
  }

  export async function getRole(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: orgId,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    await res.json(role);
  }

  export async function deleteRole(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: orgId,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    const removedRole = await role.remove();

    await res.json(removedRole);
  }

  export async function updateRole(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const roleId = parseInt(req.params.roleId);
    const name = req.body.name as string | undefined;
    const description = req.body.description as string | undefined;

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: orgId,
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

    await res.json(updatedRole);
  }

}

function setRolePermissionsFromBody(body: any, role: Role) {
  if (body.can_manage_users != null) {
    role.can_manage_users = body.can_manage_users;
  }
  if (body.can_manage_roles != null) {
    role.can_manage_roles = body.can_manage_roles;
  }
  if (body.can_manage_roster != null) {
    role.can_manage_roster = body.can_manage_roster;
  }
  if (body.can_view_roster != null) {
    role.can_view_roster = body.can_view_roster;
  }
}
