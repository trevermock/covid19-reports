import express from 'express';
import {OrgController} from './org.controller';
import {requireRootAdmin} from "../../auth";

const router = express.Router();

router.get(
  '/:orgId',
  requireRootAdmin,
  OrgController.getOrg
);

router.delete(
  '/:orgId',
  requireRootAdmin,
  OrgController.deleteOrg
);

router.put(
  '/:orgId',
  requireRootAdmin,
  OrgController.updateOrg
);

router.post(
  '/',
  requireRootAdmin,
  OrgController.addOrg
);

export default router;
