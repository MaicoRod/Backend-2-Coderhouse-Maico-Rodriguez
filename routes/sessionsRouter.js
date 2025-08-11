import { Router } from 'express';
import passport from 'passport';
import { login, current } from '../controllers/sessionsController.js';

const router = Router();

router.post('/login', login);

router.get('/current', passport.authenticate('jwt', {session:false}), current);

export default router;