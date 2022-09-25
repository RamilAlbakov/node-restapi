import { Router } from 'express';
import controller from './controller.js';

const router = Router();

router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);

router.post('/', controller.addUser);

router.delete('/:id', controller.removeUser);

export default router;
