import express from 'express';
import bodyParser from 'body-parser';
import controller from './access-request.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getAccessRequests,
);

router.post(
  '/:orgId',
  bodyParser.json(),
  controller.issueAccessRequest,
);

router.post(
  '/:orgId/cancel',
  bodyParser.json(),
  controller.cancelAccessRequest,
);

router.post(
  '/:orgId/approve',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.approveAccessRequest,
);

router.post(
  '/:orgId/deny',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.denyAccessRequest,
);

export default router;
