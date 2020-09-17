import express from 'express';
import multer from 'multer';
import path from 'path';
import controller from './roster.controller';
import { requireRolePermission } from '../../auth';

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

const router = express.Router() as any;

router.get(
  '/:orgId/template',
  requireRolePermission(role => role.can_manage_roster),
  controller.getRosterTemplate,
);

router.get(
  '/:orgId',
  requireRolePermission(role => role.can_manage_roster),
  controller.getRoster,
);

router.get(
  '/:orgId/count',
  requireRolePermission(role => role.can_manage_roster),
  controller.getRosterCount,
);

router.post(
  '/:orgId',
  requireRolePermission(role => role.can_manage_roster),
  controller.addRosterEntry,
);

router.post(
  '/:orgId/bulk',
  requireRolePermission(role => role.can_manage_roster),
  rosterUpload.single('roster_csv'),
  controller.uploadRosterEntries,
);

router.get(
  '/:orgId/:rosterEDIPI',
  requireRolePermission(role => role.can_manage_roster),
  controller.getRosterEntry,
);

router.delete(
  '/:orgId/:rosterEDIPI',
  requireRolePermission(role => role.can_manage_roster),
  controller.deleteRosterEntry,
);

router.put(
  '/:orgId/:rosterEDIPI',
  requireRolePermission(role => role.can_manage_roster),
  controller.updateRosterEntry,
);

export default router;
