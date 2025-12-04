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
