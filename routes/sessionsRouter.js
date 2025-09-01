import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { login, current } from '../controllers/sessionsController.js';

const router = Router();

const COOKIE_NAME = process.env.COOKIE_NAME || 'cookieToken';
const isProd = process.env.NODE_ENV === 'production';

function setAuthCookie(res, userPayload) {
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES || '1d',});
    res.cookie(COOKIE_NAME, token, { 
        httpOnly:true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24*60*60*1000,
    });
}

router.post('/register',
    passport.authenticate('register', {session: false }),
    (req, res) => {
        const user = req.user;
        setAuthCookie(res, {uid: user._id, role: user.role, email: user.email});
        res.json({status:'success', message: 'Usuario registrado'});
    }
);
router.post('/login', 
    passport.authenticate('login', {session: false}),
    (req, res) => {
        const user = req.user;
        setAuthCookie(res, {uid: user._id, role: user.role, email: user.email});
        res.json({status:'success', message:'Login correcto'});
    }
);

router.get('/current', passport.authenticate('jwt', {session:false}), 
(req, res) => {
    const {password, ...safe} = req.user;
    res.json({status:'success', user: safe});
}
);


router.post('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({status:'success', message:'Logout correcto'});
});

export default router;