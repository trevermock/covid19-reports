import express from 'express';
import bodyParser from 'body-parser';
import controller from './user.controller';
import { requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/current',
  controller.current,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireRolePermission(role => role.can_manage_users),
  controller.addUser,
);

router.get(
  '/:orgId',
  requireRolePermission(role => role.can_manage_users),
  controller.getOrgUsers,
);

router.delete(
  '/:orgId/:userEDIPI',
  requireRolePermission(role => role.can_manage_users),
  controller.deleteUser,
);

// router.put(
//   '/:orgId/:userEDIPI',
//   bodyParser.json(),
//   requireRolePermission(role => role.can_manage_users),
//   controller.updateUser,
// );

export default router;
