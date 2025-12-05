import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwtSysacad;

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, env.jwt.secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verificando token:', error.message);
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

export const authenticate = authenticateToken;

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (roles.length && !roles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado: Rol insuficiente' });
        }

        next();
    };
};
