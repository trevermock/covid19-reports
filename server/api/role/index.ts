import bodyParser from 'body-parser';
import express from 'express';
import { RoleController } from './role.controller';
import { requireRolePermission } from '../../auth';

const router = express.Router();

router.get(
  '/:orgId',
  requireRolePermission(role => role.can_manage_roles),
  RoleController.getOrgRoles,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireRolePermission(role => role.can_manage_roles),
  RoleController.addRole,
);

router.get(
  '/:orgId/:roleId',
  requireRolePermission(role => role.can_manage_roles),
  RoleController.getRole,
);

router.delete(
  '/:orgId/:roleId',
  requireRolePermission(role => role.can_manage_roles),
  RoleController.deleteRole,
);

router.put(
  '/:orgId/:roleId',
  bodyParser.json(),
  requireRolePermission(role => role.can_manage_roles),
  RoleController.updateRole,
);

export default router;
