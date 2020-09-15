import { Response } from 'express';
import { User } from "./user.model";
import { Role } from "../role/role.model";
import { BadRequestError, NotFoundError } from "../../util/error";

export namespace UserController {

  export async function current(req: any, res: Response) {
    await res.json(req.user);
  }

  export async function addUser(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const roleId = (req.body.role != null) ? parseInt(req.body.role) : undefined;
    const edipi = req.body.edipi;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    if (roleId == null) {
      throw new BadRequestError('A role id must be supplied when adding a user.');
    }

    if (edipi == null) {
      throw new BadRequestError('An EDIPI must be supplied when adding a user.');
    }

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: orgId,
      },
    });

    if (!role) {
      throw new NotFoundError('The role was not found in the organization.');
    }

    let newUser = false;
    let user = await User.findOne({
      relations: ['roles'],
      where: {
        edipi: edipi,
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          'roles': 'user.roles',
          'org': 'roles.org',
        },
      },
    });

    if (!user) {
      user = new User();
      user.edipi = edipi;
      newUser = true;
    }

    if (!user.roles) {
      user.roles = [];
    }

    const orgRole = user.roles.find(role => role.org.id === orgId);
    if (orgRole) {
      throw new BadRequestError('The user already has a role in the organization.');
    }

    user.roles.push(role);

    if (firstName) {
      user.first_name = firstName;
    }

    if (lastName) {
      user.last_name = lastName;
    }

    const updatedUser = await user.save();

    await res.status(newUser ? 201 : 200).json(updatedUser);
  }

  export async function getOrgUsers(req: any, res: Response) {
    // TODO: This could potentially be optimized with something like this:
    // SELECT "user".*
    //   FROM role
    // INNER JOIN user_roles
    //   ON role.id = user_roles.role
    // INNER JOIN "user"
    //   ON user_roles."user" = "user"."EDIPI"
    // WHERE role.org_id=1

    const orgId = parseInt(req.params.orgId);

    const roles = await Role.find({
      where: {
        org: orgId,
      },
    });

    const users: User[] = [];
    for (const role of roles) {
      const roleUsers = await User.createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.id = :id', { id: role.id })
        .getMany();

      roleUsers.forEach(user => {
        user.roles = [role];
        users.push(user);
      });
    }

    await res.json(users);
  }

  export async function deleteUser(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const userEDIPI = req.params.userEDIPI;

    const user = await User.findOne({
      where: {
        edipi: userEDIPI,
        org: orgId,
      },
    });

    if (!user) {
      throw new NotFoundError('User could not be found.');
    }

    const removedUser = await user.remove();

    await res.json(removedUser);
  }

  export async function updateUser(req: any, res: Response) {
    const org = req.params.orgId;
    const userEDIPI = req.params.userEDIPI;
    // TODO: Implement
  }
}
