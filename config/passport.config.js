import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const cookieExtractor = (req) => {
    if (!req || !req.cookies) return null;
    return req.cookies[process.env.COOKIE_NAME || 'cookieToken'] || null;
};

export const initPassport = () => {
    // Registro
passport.use('register',
    new LocalStrategy(
        {usernameField:'email', passReqToCallback: true},
        async (req, email, password, done) => {
            try {
                const exist = await UserModel.findOne({email});
                if (exist) return done (null, false, {message: 'Email registrado'});
                const hashed = bcrypt.hashSync(password, SALT_ROUNDS);
                const user = await UserModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email,
                    age: req.body.age,
                    password: hashed,
                    role: 'user',
                });
                return done(null, user);
            } catch (err){
                return done(err);
            }
        }
    )
);

// Login

passport.use('login',
    new LocalStrategy(
        {usernameField: 'email'},
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({email});
                if (!user) return done(null, false, {message:'Credenciales invalidas'});
                const ok = bcrypt.compareSync(password, user.password);
                if (!ok) return done(null, false, {message:'Credenciales invalidas'});
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET es requerido');

passport.use('jwt',
    new JwtStrategy(
        {jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), secretOrKey: secret,},
        async (payload, done) => {
            try {
                const user = await UserModel.findById(payload.uid).lean();
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

};