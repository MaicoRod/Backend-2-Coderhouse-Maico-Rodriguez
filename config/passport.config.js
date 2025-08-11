// config/passport.config.js
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/UserModel.js';

export const initPassport = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('❌ FALTA JWT_SECRET en .env');
    throw new Error('JWT_SECRET is required');
  }

  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
      },
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
