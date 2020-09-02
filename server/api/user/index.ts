import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get(
  '/test',
  UserController.test,
);

export default router;
