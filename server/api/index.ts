import express from 'express';
import orgRoutes from './org';
import userRoutes from './user';
import roleRoutes from './role';

const router = express.Router();

router.use('/org', orgRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);

export default router;
