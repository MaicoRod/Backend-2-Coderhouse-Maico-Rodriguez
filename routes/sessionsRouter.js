import { Router } from 'express';
import passport from 'passport';
import { login, current, register, logout } from '../controllers/sessionsController.js';
import {recover, resetPassword} from '../controllers/sessionsController.js';

const router = Router();

router.post('/register', passport.authenticate('register', {session: false }), register);

router.post('/login', passport.authenticate('login', {session: false}), login);

router.get('/current', passport.authenticate('jwt', {session: false}), current);

router.post('/recover', recover);

router.post('/reset-password', resetPassword);

router.post('/logout', logout);

export default router;