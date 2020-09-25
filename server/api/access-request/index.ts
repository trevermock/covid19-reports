import express from 'express';
import bodyParser from 'body-parser';
import controller from './access-request.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_users),
  controller.getAccessRequests,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  controller.issueAccessRequest,
);

router.post(
  '/:orgId/approve',
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_users),
  bodyParser.json(),
  controller.approveAccessRequest,
);

router.post(
  '/:orgId/reject',
  requireOrgAccess,
  requireRolePermission(role => role.can_manage_users),
  bodyParser.json(),
  controller.rejectAccessRequest,
);

export default router;
