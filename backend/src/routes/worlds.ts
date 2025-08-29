import express from 'express';
import { getWorlds, createWorld, getWorldById, updateWorld, deleteWorld } from '../controllers/worldController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getWorlds);
router.post('/', createWorld);
router.get('/:id', getWorldById);
router.put('/:id', updateWorld);
router.delete('/:id', deleteWorld);

export default router;
