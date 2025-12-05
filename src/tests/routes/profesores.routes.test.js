import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

// Mockear ProfesorController
jest.unstable_mockModule('../../controllers/profesor.controller.js', () => ({
    listarProfesores: jest.fn((req, res) => res.json([])),
    obtenerProfesor: jest.fn(),
    crearProfesor: jest.fn((req, res) => res.status(201).json(req.body)),
    actualizarProfesor: jest.fn(),
    eliminarProfesor: jest.fn(),
}));

jest.unstable_mockModule('../../config/env.js', () => ({
    env: {
        jwt: { secret: 'test-secret' }
    }
}));

// Importar módulos
const { listarProfesores, crearProfesor } = await import('../../controllers/profesor.controller.js');
const { default: profesoresRouter } = await import('../../routes/profesores.routes.js');

describe('Profesores Routes', () => {
    let app;
    const secret = 'test-secret';

    beforeAll(() => {
        process.env.JWT_SECRET = secret;
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use('/api/profesores', profesoresRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/profesores requiere autenticación', async () => {
        const res = await request(app).get('/api/profesores');
        expect(res.status).toBe(401);
    });

    test('GET /api/profesores devuelve lista con token válido', async () => {
        const token = jwt.sign({ id: 1, rol: 'admin' }, secret);

        listarProfesores.mockImplementation((req, res) => res.json([]));

        const res = await request(app)
            .get('/api/profesores')
            .set('Cookie', [`jwtSysacad=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
        expect(listarProfesores).toHaveBeenCalled();
    });

    test('POST /api/profesores crea profesor (admin)', async () => {
        const token = jwt.sign({ id: 1, rol: 'admin' }, secret);

        crearProfesor.mockImplementation((req, res) => res.status(201).json({ legajo: req.body.legajo }));

        const res = await request(app)
            .post('/api/profesores')
            .set('Cookie', [`jwtSysacad=${token}`])
            .send({
                legajo: 100,
                fechaIngreso: '2023-01-01',
                especialidad: 'Sistemas',
                antigüedad: 5,
                apellido: 'Test',
                nombre: 'Profesor',
                nroDocumento: '12345678',
                tipoDocumento: 'dni',
                fechaNacimiento: '1980-01-01',
                email: 'profesor@test.com'
            });

        expect(res.status).toBe(201);
        expect(res.body.legajo).toBe(100);
        expect(crearProfesor).toHaveBeenCalled();
    });
});
