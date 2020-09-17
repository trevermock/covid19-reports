import bodyParser from 'body-parser';
import express from 'express';
import controller from './role.controller';
import { requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireRolePermission(role => role.can_manage_roles),
  controller.getOrgRoles,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireRolePermission(role => role.can_manage_roles),
  controller.addRole,
);

router.get(
  '/:orgId/:roleId',
  requireRolePermission(role => role.can_manage_roles),
  controller.getRole,
);

router.delete(
  '/:orgId/:roleId',
  requireRolePermission(role => role.can_manage_roles),
  controller.deleteRole,
);

router.put(
  '/:orgId/:roleId',
  bodyParser.json(),
  requireRolePermission(role => role.can_manage_roles),
  controller.updateRole,
);

export default router;
