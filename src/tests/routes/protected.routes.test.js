import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

// Mockear el modelo Usuario y el middleware de autenticación
jest.unstable_mockModule('../../models/Usuario.js', () => ({
    __esModule: true,
    default: { findAll: jest.fn() },
}));

jest.unstable_mockModule('../../config/env.js', () => ({
    env: {
        jwt: { secret: 'test-secret' }
    }
}));

// Importar módulos
const { default: Usuario } = await import('../../models/Usuario.js');
const { default: usuariosRouter } = await import('../../routes/usuarios.routes.js');
const { default: authRouter } = await import('../../routes/auth.routes.js');

describe('Protected Routes & Logout', () => {
    let app;
    const secret = 'test-secret';

    beforeAll(() => {
        process.env.JWT_SECRET = secret;
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use('/api/usuarios', usuariosRouter);
        app.use('/api/auth', authRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('401 si se accede a /api/usuarios sin token', async () => {
        const res = await request(app).get('/api/usuarios');
        expect(res.status).toBe(401);
        expect(res.body.error).toMatch(/Acceso denegado/i);
    });

    test('403 si el token es inválido', async () => {
        const res = await request(app)
            .get('/api/usuarios')
            .set('Cookie', ['jwtSysacad=invalidtoken']);
        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/Token inválido/i);
    });

    test('200 si se accede con token válido', async () => {
        const token = jwt.sign({ id: 1, rol: 'admin' }, secret);
        Usuario.findAll.mockResolvedValue([]);

        const res = await request(app)
            .get('/api/usuarios')
            .set('Cookie', [`jwtSysacad=${token}`]);

        expect(res.status).toBe(200);
    });

    test('Logout limpia la cookie', async () => {
        const res = await request(app).post('/api/auth/logout');

        expect(res.status).toBe(200);
        expect(res.body.mensaje).toMatch(/Logout exitoso/i);

        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        // Verificar que la cookie se expira (Max-Age=0 o Expires en el pasado)
        const cookie = cookies.find(c => c.startsWith('jwtSysacad='));
        expect(cookie).toMatch(/jwtSysacad=;/);
    });
});
