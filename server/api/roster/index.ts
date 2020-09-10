import express from 'express';
import multer from 'multer';
import path from 'path';
import { RosterController } from './roster.controller';
import { requireRolePermission } from "../../auth";

const rosterUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      console.log('destination');
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req: any, file: any, cb: any) => {
      console.log('filename');
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
  }),
});

const router = express.Router();

router.get(
  '/:orgId/template',
  requireRolePermission((role) => role.can_manage_roster),
  RosterController.getRosterTemplate,
);

router.get(
  '/:orgId',
  requireRolePermission((role) => role.can_manage_roster),
  RosterController.getRoster,
);

router.post(
  '/:orgId',
  requireRolePermission((role) => role.can_manage_roster),
  RosterController.addRosterEntry
);

router.post(
  '/:orgId/bulk',
  requireRolePermission((role) => role.can_manage_roster),
  rosterUpload.single('roster_csv'),
  RosterController.uploadRosterEntries
)

router.get(
  '/:orgId/:rosterEDIPI',
  requireRolePermission((role) => role.can_manage_roster),
  RosterController.getRosterEntry,
);

router.delete(
  '/:orgId/:rosterEDIPI',
  requireRolePermission((role) => role.can_manage_roster),
  RosterController.deleteRosterEntry,
);

router.put(
  '/:orgId/:rosterEDIPI',
  requireRolePermission((role) => role.can_manage_roster),
  RosterController.updateRosterEntry
);

export default router;
