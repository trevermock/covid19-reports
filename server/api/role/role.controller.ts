import { Response } from 'express';
import { getConnection } from 'typeorm';
import { ApiRequest, OrgParam, OrgRoleParams } from '../index';
import { Role } from './role.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import { RosterPIIColumns } from '../roster/roster.model';

class RoleController {

  async getOrgRoles(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const roles = await Role.find({
      where: {
        org: req.appOrg.id,
      },
      order: {
        id: 'ASC',
      },
    });

    res.json(roles);
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

    const userCount = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from('user_roles', 'user_roles')
      .where('user_roles.role = :id', { id: roleId })
      .getCount();

    if (userCount > 0) {
      throw new BadRequestError('Cannot delete a role that is assigned to users.');
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

    const updatedRole = await role.save();

    res.json(updatedRole);
  }

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
  if (body.allowedRosterColumns != null) {
    // TODO: This validation logic could be shared with the client-side parsing functionality
    const columns = body.allowedRosterColumns.split(',').filter(column => column.length > 0);
    if (columns.length === 0) {
      role.allowedRosterColumns = '';
    } else if (columns.length === 1 && columns[0] === '*') {
      role.allowedRosterColumns = '*';
    } else {
      for (const column of columns) {
        if (!RosterPIIColumns.hasOwnProperty(column)) {
          throw new BadRequestError(`Unknown roster column: ${column}`);
        }
      }
      role.allowedRosterColumns = body.allowedRosterColumns;
    }
  }
  if (body.allowedNotificationEvents != null) {
    // TODO: Validate notification events
    role.allowedNotificationEvents = body.allowedNotificationEvents;
  }
  if (body.canManageGroup != null) {
    role.canManageGroup = body.canManageGroup;
  }
  if (body.canManageRoster != null) {
    role.canManageRoster = body.canManageRoster;
  }
  if (body.canManageWorkspace != null) {
    role.canManageWorkspace = body.canManageWorkspace;
  }
  if (body.canViewRoster != null) {
    role.canViewRoster = body.canViewRoster;
  }
  if (body.canViewMuster != null) {
    role.canViewMuster = body.canViewMuster;
  }
  if (body.canViewPII != null) {
    role.canViewPII = body.canViewPII;
  }

}

type RoleBody = {
  name?: string
  description?: string
  indexPrefix?: string
  allowedRosterColumns?: string
  allowedNotificationEvents?: string
  canManageGroup?: boolean
  canManageRoster?: boolean
  canManageWorkspace?: boolean
  canViewRoster?: boolean
  canViewMuster?: boolean
  canViewPII?: boolean
};

export default new RoleController();
