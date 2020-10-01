import bodyParser from 'body-parser';
import express from 'express';

import controller from './role.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoles),
  controller.getOrgRoles,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoles),
  controller.addRole,
);

router.get(
  '/:orgId/:roleId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoles),
  controller.getRole,
);

router.delete(
  '/:orgId/:roleId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoles),
  controller.deleteRole,
);

router.put(
  '/:orgId/:roleId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoles),
  controller.updateRole,
);

export default router;
