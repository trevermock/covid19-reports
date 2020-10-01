import express from 'express';
import bodyParser from 'body-parser';
import controller from './user.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/current',
  controller.current,
);

router.post(
  '/',
  bodyParser.json(),
  controller.registerUser,
);

router.get(
  '/access-requests',
  controller.getAccessRequests,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRolePermission(role => role.canManageUsers),
  controller.addUser,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageUsers),
  controller.getOrgUsers,
);

router.delete(
  '/:orgId/:userEDIPI',
  requireOrgAccess,
  requireRolePermission(role => role.canManageUsers),
  controller.deleteUser,
);

// router.put(
//   '/:orgId/:userEDIPI',
//   bodyParser.json(),
//   requireOrgAccess,
//   requireRolePermission((role) => role.canManageUsers),
//   controller.updateUser
// );

export default router;
