import express from 'express';
import multer from 'multer';
import {RosterController} from './roster.controller';
import {requireRolePermission} from "../../auth";

const router = express.Router();

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

const storage = multer.diskStorage({
  destination(
    req: express.Request,
    file:Express.Multer.File,
    callback: (error: (Error | null), filename: string) => void) {
    callback(null, __dirname + '/rosterUploads/');
  },
  filename(
    req: express.Request,
    file: Express.Multer.File,
    callback: (error: (Error | null), filename: string) => void) {
    callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
});

const upload = multer({storage: storage});

router.post(
  '/:orgId/bulk',
  requireRolePermission((role) => role.can_manage_roster),
  upload.single('roster_csv'),
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
