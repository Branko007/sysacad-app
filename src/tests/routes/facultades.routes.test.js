import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/facultad.js', () => ({
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
const { default: Facultad } = await import('../../models/facultad.js');
const { default: facultadesRouter } = await import('../../routes/facultades.routes.js');

describe('Facultades Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/facultades', facultadesRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // GET /
    test('GET /facultades devuelve lista', async () => {
        const mockData = [{ id: 1, nombre: 'Ingeniería' }];
        Facultad.findAll.mockResolvedValue(mockData);

        const res = await request(app).get('/facultades');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockData);
    });

    // GET /:id
    test('GET /facultades/:id devuelve facultad si existe', async () => {
        Facultad.findByPk.mockResolvedValue({ id: 1, nombre: 'Ingeniería' });

        const res = await request(app).get('/facultades/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, nombre: 'Ingeniería' });
    });

    test('GET /facultades/:id devuelve 404 si no existe', async () => {
        Facultad.findByPk.mockResolvedValue(null);

        const res = await request(app).get('/facultades/99');
        expect(res.status).toBe(404);
    });

    // POST /
    test('POST /facultades crea facultad valida', async () => {
        Facultad.findOne.mockResolvedValue(null); // No existe nombre duplicado
        Facultad.create.mockResolvedValue({ id: 1, nombre: 'Ingeniería' });

        const res = await request(app).post('/facultades').send({ nombre: 'Ingeniería' });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: 1, nombre: 'Ingeniería' });
    });

    test('POST /facultades falla si falta nombre (validacion)', async () => {
        const res = await request(app).post('/facultades').send({});
        expect(res.status).toBe(400); // Joi validation error
    });

    test('POST /facultades falla si nombre duplicado', async () => {
        Facultad.findOne.mockResolvedValue({ id: 1, nombre: 'Ingeniería' }); // Ya existe

        const res = await request(app).post('/facultades').send({ nombre: 'Ingeniería' });
        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/Ya existe una facultad con ese nombre/);
    });

    // PUT /:id
    test('PUT /facultades/:id actualiza correcto', async () => {
        // Mock findById inside update logic check
        Facultad.findOne.mockResolvedValue(null);

        // Mock instance update
        const mockInstance = {
            id: 1,
            nombre: 'Ingeniería',
            update: jest.fn().mockResolvedValue({ id: 1, nombre: 'Medicina' })
        };
        Facultad.findByPk.mockResolvedValue(mockInstance);

        const res = await request(app)
            .put('/facultades/1')
            .send({ nombre: 'Medicina' });

        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Medicina');
    });

    // DELETE /:id
    test('DELETE /facultades/:id elimina correcto', async () => {
        Facultad.destroy.mockResolvedValue(1); // 1 deleted

        const res = await request(app).delete('/facultades/1');
        expect(res.status).toBe(204);
    });

    test('DELETE /facultades/:id 404 si no existe', async () => {
        Facultad.destroy.mockResolvedValue(0);

        const res = await request(app).delete('/facultades/99');
        expect(res.status).toBe(404);
    });
});
