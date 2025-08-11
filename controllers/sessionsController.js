import jwt from 'jsonwebtoken';
import UserService from '../services/UserService.js';


const userService  = new UserService();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
        return res.status(400).json({error:'Email y contraseñas son requeridos'});
    
        const user = await userService.getByEmail(email);
        if (!user) return res.status(401).json({ error:'Credenciales invalidas'});
        
        const passwordValidation = userService.validatePassword(user, password);
        if (!passwordValidation) return res.status(401).json({error:'Credenciales invalidas'});
        
        const token = jwt.sign(
            { uid: user._id, role: user.role, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES || '1d'}
        );
        res.json({status:'success', token});
    } catch (e) {
        console.error('Error de logueo', e);
        res.status(500).json({error:'Error interno'});
    }
};

export const current = async (req, res) => {
    if (!req.user) return res.status(401).json({error:'No autorizado'});
    const {password, ...safe} = req.user;
    res.json({status:'success', user: safe});
};