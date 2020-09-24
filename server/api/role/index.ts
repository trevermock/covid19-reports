import bodyParser from 'body-parser';
import express from 'express';

import controller from './role.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_roles),
  controller.getOrgRoles,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_roles),
  controller.addRole,
);

router.get(
  '/:orgId/:roleId',
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_roles),
  controller.getRole,
);

router.delete(
  '/:orgId/:roleId',
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_roles),
  controller.deleteRole,
);

router.put(
  '/:orgId/:roleId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_roles),
  controller.updateRole,
);

export default router;
