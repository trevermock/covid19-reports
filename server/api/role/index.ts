import express from 'express';
import {RoleController} from './role.controller';
import {requireRolePermission} from "../../auth";

const router = express.Router();

router.get(
  '/:orgId',
  requireRolePermission((role) => role.canManageRoles),
  RoleController.getOrgRoles,
);

router.post(
  '/:orgId',
  requireRolePermission((role) => role.canManageRoles),
  RoleController.addRole
);

router.get(
  '/:orgId/:roleId',
  requireRolePermission((role) => role.canManageRoles),
  RoleController.getRole,
);

router.delete(
  '/:orgId/:roleId',
  requireRolePermission((role) => role.canManageRoles),
  RoleController.deleteRole,
);

router.put(
  '/:orgId/:roleId',
  requireRolePermission((role) => role.canManageRoles),
  RoleController.updateRole
);

export default router;
