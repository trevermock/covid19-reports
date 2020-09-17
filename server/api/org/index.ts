import bodyParser from 'body-parser';
import express from 'express';
import controller from './org.controller';
import { requireRootAdmin } from '../../auth';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireRootAdmin,
  controller.getOrg,
);

router.delete(
  '/:orgId',
  requireRootAdmin,
  controller.deleteOrg,
);

router.put(
  '/:orgId',
  bodyParser.json(),
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
