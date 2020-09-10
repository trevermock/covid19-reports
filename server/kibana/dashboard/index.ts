import { Router } from 'express';

import * as rorController from './read-only-rest.controller';

const router = Router();

router.get(
  '/',
  rorController.logout,
  rorController.login,
);

export default router;
