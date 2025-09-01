import jwt from 'jsonwebtoken';
import UserDTO from '../dto/UserDTO.js';

const COOKIE_NAME = process.env.COOKIE_NAME || 'cookieToken';
const isProd = process.env.NODE_ENV === 'production';

function setAuthCookie(res, userPayload) {
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES || '1d',});
    res.cookie(COOKIE_NAME, token, { 
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24*60*60*1000,
    });
}

export const register = (req, res) => {
        const user = req.user;
        setAuthCookie(res, {uid: user._id, role: user.role, email: user.email});
        res.json({status:'success', message: 'Usuario registrado'});
    };

export const login = (req, res) => {
            const user = req.user;
            setAuthCookie(res, {uid: user._id, role: user.role, email: user.email});
            res.json({status:'success', message:'Login correcto'});
        };

export const current = (req, res) => {
    const dto = new UserDTO(req.user);
    res.json({status:'success', user: dto});
};

export const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({status:'success', message:'Logout correcto'});
};