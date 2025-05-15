import express from 'express';
import { createUser, getUsers, loginUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/getAll', auth, getUsers);


export default router;
