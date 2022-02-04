import { Router } from 'express';

import { UserController } from './controllers/UserController';
import { MessageController } from './controllers/MessageController';
import { ConnectionController } from './controllers/ConnectionController';

const userController = new UserController();
const messageController = new MessageController();
const connectionController = new ConnectionController();

const router = Router();

router.get('/users/:login', userController.show);

router.use('/', userController.middleware);

router.get('/messages', messageController.index);

router.get('/connections', connectionController.index);

export default router;