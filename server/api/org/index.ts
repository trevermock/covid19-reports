import bodyParser from 'body-parser';
import express from 'express';
import controller from './org.controller';
import { requireOrgAccess, requireRootAdmin } from '../../auth';

const router = express.Router() as any;

router.get(
  '/',
  controller.getOrgList,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRootAdmin,
  controller.getOrg,
);

router.delete(
  '/:orgId',
  requireOrgAccess,
  requireRootAdmin,
  controller.deleteOrg,
);

router.put(
  '/:orgId',
  bodyParser.json(),
  requireOrgAccess,
  requireRootAdmin,
  controller.updateOrg,
);

router.post(
  '/',
  bodyParser.json(),
  requireRootAdmin,
  controller.addOrg,
);

export default router;
