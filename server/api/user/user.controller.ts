import express from 'express';
import {User} from "./user.model";
import {Role} from "../role/role.model";
import {BadRequestError, NotFoundError} from "../../util/error";
import {Org} from "../org/org.model";

export namespace UserController {

  export async function current(req: any, res: express.Response) {
    res.json(req['DDSUser']);
  }

  export async function addUser(req: any, res: express.Response) {
    const orgId = parseInt(req.params['orgId']);

    if (!req.body.hasOwnProperty('role')) {
      throw new BadRequestError('A role id must be supplied when adding a user.');
    }
    if (!req.body.hasOwnProperty('EDIPI')) {
      throw new BadRequestError('An EDIPI must be supplied when adding a user.');
    }

    const role = await Role.findOne({
      where: {
        id: parseInt(req.body.role),
        org: orgId
      }
    });
    if (!role) {
      throw new NotFoundError('The role was not found in the organization.');
    }

    let newUser = false;
    let user = await User.findOne({
      relations: ['roles'],
      where: {
        EDIPI: req.body.EDIPI
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          'roles': 'user.roles',
          'org': 'roles.org'
        }
      }
    });

    if (!user) {
      user = new User();
      user.EDIPI = req.body.EDIPI;
      newUser = true;
    }

    if (!user.roles) {
      user.roles = [];
    }

    const orgRole = user.roles.find((role) => role.org.id == orgId);
    if (orgRole) {
      throw new BadRequestError('The user already has a role in the organization.');
    }

    user.roles.push(role);

    if (req.body.hasOwnProperty('FirstName')) {
      user.FirstName = req.body.FirstName;
    }

    if (req.body.hasOwnProperty('LastName')) {
      user.LastName = req.body.LastName;
    }

    const updatedUser = await user.save();
    res.status(newUser ? 201 : 200);
    res.json(updatedUser);
    res.send();
  }

  export async function getOrgUsers(req: any, res: express.Response) {
    // TODO: This could potentially be optimized with something like this:
    // SELECT "user".*
    //   FROM role
    // INNER JOIN user_roles
    //   ON role.id = user_roles.role
    // INNER JOIN "user"
    //   ON user_roles."user" = "user"."EDIPI"
    // WHERE role.org_id=1
    const orgId = req.params['orgId'];
    const roles = await Role.find({
      where: {
        org: parseInt(orgId)
      }
    });
    const users: User[] = [];
    for (let i = 0; i < roles.length; i++) {
      const roleUsers = await User.createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.id = :id', { id: roles[i].id })
        .getMany();
      roleUsers.forEach((user) => {
        user.roles = [roles[i]];
        users.push(user);
      });
    }
    res.json(users);
    res.send();
  }

  export async function deleteUser(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const userEDIPI = req.params['userEDIPI'];
    const user = await User.findOne({
      where: {
        EDIPI: userEDIPI,
        org: parseInt(orgId)
      }
    });
    if (!user) {
      throw new NotFoundError('User could not be found.');
    }
    const removedUser = await user.remove();
    res.json(removedUser);
    res.send();
  }

  export async function updateUser(req: any, res: express.Response) {
    const org = req.params['orgId'];
    const userEDIPI = req.params['userEDIPI'];
    // TODO: Implement
  }




}
