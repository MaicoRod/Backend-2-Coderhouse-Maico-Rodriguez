import passport from "passport";

export const requireAuth = passport.authenticate('jwt', {session: false});

export const requireRole = (...allowed) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({error:'No autenticado'});
        if (!allowed.includes(req.user.role)){
            return res.status(403).json({error: 'No autorizado'});
        }
        next();
    };
};

export const cartAccess = () => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({error: 'No autenticado'});
        if (req.user.role === 'admin') return next ();

        const userCartId = req.user.cart.toString();

        const cid = req.params.cid.toString();

        if (!userCartId || !cid || userCartId !== cid){
            return res.status(403).json({error: 'No autorizado para este carrito'});
        }
        next();
    };
};

