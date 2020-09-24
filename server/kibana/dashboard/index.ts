import { Router } from 'express';
import controller from './read-only-rest.controller';

const router = Router() as any;

router.get(
  '/',
  controller.logout,
  controller.login,
);

export default router;
