import { Router } from 'express';
import controller from './controller.js';

const router = Router();

router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);

router.post('/', controller.addUser);

export default router;
