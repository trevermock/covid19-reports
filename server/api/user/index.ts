import express from 'express';
import bodyParser from 'body-parser';
import { UserController } from './user.controller';
import { requireRolePermission } from '../../auth';

const router = express.Router();

router.get(
  '/current',
  UserController.current,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  requireRolePermission(role => role.can_manage_users),
  UserController.addUser,
);

router.get(
  '/:orgId',
  requireRolePermission(role => role.can_manage_users),
  UserController.getOrgUsers,
);

router.delete(
  '/:orgId/:userEDIPI',
  requireRolePermission(role => role.can_manage_users),
  UserController.deleteUser,
);

// router.put(
//   '/:orgId/:userEDIPI',
//   bodyParser.json(),
//   requireRolePermission(role => role.can_manage_users),
//   UserController.updateUser,
// );

export default router;
