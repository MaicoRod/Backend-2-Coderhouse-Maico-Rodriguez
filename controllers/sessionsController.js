import jwt from 'jsonwebtoken';
import UserDTO from '../dto/UserDTO.js';
import config from '../config/config.js';
import { sendPasswordReset } from '../utils/mailer.js';
import UserService from '../services/UserService.js';

const userService = new UserService();
const COOKIE_NAME = config.COOKIE_NAME || 'cookieToken';
const isProd = config.NODE_ENV === 'production';

function setAuthCookie(res, userPayload) {
    const token = jwt.sign(userPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES || '1d', });
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });
}

export const register = (req, res) => {
    const user = req.user;
    setAuthCookie(res, { uid: user._id, role: user.role, email: user.email });
    res.json({ status: 'success', message: 'Usuario registrado' });
};

export const login = (req, res) => {
    const user = req.user;
    setAuthCookie(res, { uid: user._id, role: user.role, email: user.email });
    res.json({ status: 'success', message: 'Login correcto' });
};

export const current = (req, res) => {
    const dto = new UserDTO(req.user);
    res.json({ status: 'success', user: dto });
};

export const recover = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const user = await userService.getByEmail(email);
    if (user) {
        const token = jwt.sign(
            { uid: user._id, type: 'pwdReset' },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const link = `${config.BASE_URL}/api/sessions/reset-password?token=${token}`;
        await sendPasswordReset(email, link);
    }

    return res.json({
        status: 'success',
        message: 'Si el email existe, se envió un enlace para restablecer la contraseña.',
    });
};


export const resetPassword = async (req, res) => {
    const token = req.body.token || req.query.token;
    const password = req.body.password || req.body.newPassword;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token y password son requeridos' });
    }

    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        if (payload.type !== 'pwdReset') {
            return res.status(400).json({ error: 'Token inválido' });
        }

        const user = await userService.getUserById(payload.uid);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const same = await userService.isSamePassword(user, password);
        if (same) return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });

        await userService.updatePassword(user._id, password);
        return res.json({ status: 'success', message: 'Contraseña actualizada' });
    } catch (e) {
        console.error('Error al verificar token:', e);
        if (e.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'El enlace expiró. Volvé a solicitarlo.' });
        }
        return res.status(400).json({ error: 'Token inválido' });
    }
};

export const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ status: 'success', message: 'Logout correcto' });
};