import bodyParser from 'body-parser';
import express from 'express';
import { OrgController } from './org.controller';
import { requireRootAdmin } from '../../auth';

const router = express.Router();

router.get(
  '/:orgId',
  requireRootAdmin,
  OrgController.getOrg,
);

router.delete(
  '/:orgId',
  requireRootAdmin,
  OrgController.deleteOrg,
);

router.put(
  '/:orgId',
  bodyParser.json(),
  requireRootAdmin,
  OrgController.updateOrg,
);

router.post(
  '/',
  bodyParser.json(),
  requireRootAdmin,
  OrgController.addOrg,
);

export default router;
