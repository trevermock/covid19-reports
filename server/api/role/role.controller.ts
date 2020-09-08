import express from 'express';
import {Role} from "./role.model";
import {Org} from "../org/org.model";
import {BadRequestError, NotFoundError} from "../../util/error";

export namespace RoleController {

  export async function getOrgRoles(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const roles = await Role.find({
      where: {
        org: parseInt(orgId)
      }
    });
    res.json(roles);
    res.send();
  }

  export async function addRole(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const role = new Role();
    if (!req.body.hasOwnProperty('name')) {
      throw new BadRequestError('A name must be supplied when adding a role.');
    }
    role.name = req.body.name;

    if (!req.body.hasOwnProperty('description')) {
      throw new BadRequestError('A description must be supplied when adding a role.');
    }
    role.description = req.body.description;

    const org = await Org.findOne({
      where: {
        id: parseInt(orgId)
      }
    });
    if (!org) {
      throw new NotFoundError('Organization for role was not found.');
    }
    role.org = org;

    getRolePermissionsFromBody(role, req.body);

    const newRole = await role.save();
    res.status(201);
    res.json(newRole);
    res.send();
  }

  export async function getRole(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const roleId = req.params['roleId'];
    const role = await Role.findOne({
      where: {
        id: parseInt(roleId),
        org: parseInt(orgId)
      }
    });
    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }
    res.json(role);
    res.send();
  }

  export async function deleteRole(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const roleId = req.params['roleId'];
    const role = await Role.findOne({
      where: {
        id: parseInt(roleId),
        org: parseInt(orgId)
      }
    });
    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }
    const removedRole = await role.remove();
    res.json(removedRole);
    res.send();
  }

  export async function updateRole(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const roleId = req.params['roleId'];
    const role = await Role.findOne({
      where: {
        id: parseInt(roleId),
        org: parseInt(orgId)
      }
    });
    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }
    if (req.body.hasOwnProperty('name')) {
      role.name = req.body.name;
    }
    if (req.body.hasOwnProperty('description')) {
      role.description = req.body.description;
    }
    getRolePermissionsFromBody(role, req.body);
    const updatedRole = await role.save();
    res.json(updatedRole);
    res.send();
  }

  function getRolePermissionsFromBody(body: any, role: Role) {
    if (body.hasOwnProperty('can_manage_users')) {
      role.can_manage_users = body.can_manage_users;
    }
    if (body.hasOwnProperty('can_manage_roles')) {
      role.can_manage_roles = body.can_manage_roles;
    }
    if (body.hasOwnProperty('can_manage_roster')) {
      role.can_manage_roster = body.can_manage_roster;
    }
    if (body.hasOwnProperty('can_view_roster')) {
      role.can_view_roster = body.can_view_roster;
    }
  }
}
