import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get(
  '/role',
  UserController.role,
);

export default router;
