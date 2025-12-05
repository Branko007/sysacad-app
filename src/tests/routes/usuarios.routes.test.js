import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

// Mockear UsuarioController
jest.unstable_mockModule('../../controllers/usuario.controller.js', () => ({
    listarUsuarios: jest.fn((req, res) => res.json([])),
    obtenerUsuario: jest.fn(),
    crearUsuario: jest.fn((req, res) => res.status(201).json(req.body)),
    actualizarUsuario: jest.fn(),
    eliminarUsuario: jest.fn(),
}));

jest.unstable_mockModule('../../config/env.js', () => ({
    env: {
        jwt: { secret: 'test-secret' }
    }
}));

// Importar módulos
const { listarUsuarios, crearUsuario } = await import('../../controllers/usuario.controller.js');
const { default: usuariosRouter } = await import('../../routes/usuarios.routes.js');

describe('Usuarios Routes', () => {
    let app;
    const secret = 'test-secret';

    beforeAll(() => {
        process.env.JWT_SECRET = secret;
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use('/api/usuarios', usuariosRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/usuarios requiere autenticación', async () => {
        const res = await request(app).get('/api/usuarios');
        expect(res.status).toBe(401);
    });

    test('GET /api/usuarios devuelve lista con token válido', async () => {
        const token = jwt.sign({ id: 1, rol: 'admin' }, secret);

        // Configurar mock
        listarUsuarios.mockImplementation((req, res) => res.json([]));

        const res = await request(app)
            .get('/api/usuarios')
            .set('Cookie', [`jwtSysacad=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
        expect(listarUsuarios).toHaveBeenCalled();
    });

    test('POST /api/usuarios crea usuario', async () => {
        const token = jwt.sign({ id: 1, rol: 'admin' }, secret);

        crearUsuario.mockImplementation((req, res) => res.status(201).json({ nombreUsuario: req.body.nombreUsuario }));

        const res = await request(app)
            .post('/api/usuarios')
            .set('Cookie', [`jwtSysacad=${token}`])
            .send({
                nombreUsuario: 'testuser',
                password: 'password123',
                rol: 'alumno',
                apellido: 'Test',
                nombre: 'User',
                nroDocumento: '12345678',
                tipoDocumento: 'dni',
                fechaNacimiento: '1990-01-01',
                email: 'test@example.com'
            });

        expect(res.status).toBe(201);
        expect(res.body.nombreUsuario).toBe('testuser');
        expect(crearUsuario).toHaveBeenCalled();
    });
});
