import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Materia.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

// Mock auth middleware
jest.unstable_mockModule('../../middlewares/auth.middleware.js', () => ({
    authenticateToken: (req, res, next) => next(),
}));

// Import modules AFTER mocking
const { default: Materia } = await import('../../models/Materia.js');
const { default: materiasRouter } = await import('../../routes/materias.routes.js');

describe('Materias Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/materias', materiasRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // GET /
    test('GET /materias devuelve lista', async () => {
        const mockData = [{ id: 1, nombre: 'Matemática', anio: 1, planId: 1, especialidadId: 1 }];
        Materia.findAll.mockResolvedValue(mockData);

        const res = await request(app).get('/materias');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockData);
    });

    // GET /:id
    test('GET /materias/:id devuelve materia si existe', async () => {
        Materia.findByPk.mockResolvedValue({ id: 1, nombre: 'Matemática', anio: 1, planId: 1, especialidadId: 1 });

        const res = await request(app).get('/materias/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, nombre: 'Matemática', anio: 1, planId: 1, especialidadId: 1 });
    });

    test('GET /materias/:id devuelve 404 si no existe', async () => {
        Materia.findByPk.mockResolvedValue(null);

        const res = await request(app).get('/materias/99');
        expect(res.status).toBe(404);
    });

    // POST /
    test('POST /materias crea materia valida', async () => {
        Materia.create.mockResolvedValue({ id: 1, nombre: 'Matemática', anio: 1, planId: 1, especialidadId: 1 });

        const res = await request(app).post('/materias').send({
            nombre: 'Matemática', anio: 1, planId: 1, especialidadId: 1
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: 1, nombre: 'Matemática', anio: 1, planId: 1, especialidadId: 1 });
    });

    test('POST /materias falla si faltan campos', async () => {
        const res = await request(app).post('/materias').send({ nombre: 'Matemática' }); // Missing anio, planId, etc
        expect(res.status).toBe(400);
    });

    // PUT /:id
    test('PUT /materias/:id actualiza correcto', async () => {
        // Mock instance update
        const mockInstance = {
            id: 1,
            nombre: 'Matemática',
            anio: 1,
            planId: 1,
            especialidadId: 1,
            update: jest.fn().mockResolvedValue({ id: 1, nombre: 'Matemática II', anio: 2, planId: 1, especialidadId: 1 })
        };
        Materia.findByPk.mockResolvedValue(mockInstance);

        const res = await request(app)
            .put('/materias/1')
            .send({ nombre: 'Matemática II', anio: 2 });

        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Matemática II');
    });

    // DELETE /:id
    test('DELETE /materias/:id elimina correcto', async () => {
        Materia.destroy.mockResolvedValue(1);

        const res = await request(app).delete('/materias/1');
        expect(res.status).toBe(204);
    });
});
