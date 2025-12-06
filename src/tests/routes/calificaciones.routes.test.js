import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Calificacion.js', () => ({
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

jest.unstable_mockModule('../../models/Alumno.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    },
}));

jest.unstable_mockModule('../../models/Evaluacion.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    },
}));

// Mock auth middleware
jest.unstable_mockModule('../../middlewares/auth.middleware.js', () => ({
    authenticateToken: (req, res, next) => next(),
}));

// Import modules AFTER mocking
const { default: Calificacion } = await import('../../models/Calificacion.js');
const { default: Alumno } = await import('../../models/Alumno.js');
const { default: Evaluacion } = await import('../../models/Evaluacion.js');
const { default: calificacionesRouter } = await import('../../routes/calificaciones.routes.js');

describe('Calificaciones Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/calificaciones', calificacionesRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /
    test('POST /calificaciones crea calificacion aprobada (nota >= 6)', async () => {
        Alumno.findByPk.mockResolvedValue({ id: 1 });
        Evaluacion.findByPk.mockResolvedValue({ id: 1 });
        Calificacion.findOne.mockResolvedValue(null); // No duplicado

        const mockCreated = {
            id: 1,
            nota: 8,
            estado: 'aprobado',
            alumnoId: 1,
            evaluacionId: 1,
            toJSON: () => ({ id: 1, nota: 8, estado: 'aprobado' })
        };
        Calificacion.create.mockResolvedValue(mockCreated);

        const res = await request(app).post('/calificaciones').send({
            nota: 8,
            alumnoId: 1,
            evaluacionId: 1
        });

        expect(res.status).toBe(201);
        expect(Calificacion.create).toHaveBeenCalledWith(expect.objectContaining({
            estado: 'aprobado' // Auto-calculated
        }));
    });

    test('POST /calificaciones crea calificacion desaprobada (nota < 6)', async () => {
        Alumno.findByPk.mockResolvedValue({ id: 1 });
        Evaluacion.findByPk.mockResolvedValue({ id: 1 });
        Calificacion.findOne.mockResolvedValue(null); // No duplicado

        const mockCreated = {
            id: 1,
            nota: 4,
            estado: 'desaprobado',
            alumnoId: 1,
            evaluacionId: 1,
            toJSON: () => ({ id: 1, nota: 4, estado: 'desaprobado' })
        };
        Calificacion.create.mockResolvedValue(mockCreated);

        const res = await request(app).post('/calificaciones').send({
            nota: 4,
            alumnoId: 1,
            evaluacionId: 1
        });

        expect(res.status).toBe(201);
        expect(Calificacion.create).toHaveBeenCalledWith(expect.objectContaining({
            estado: 'desaprobado' // Auto-calculated
        }));
    });

    test('POST /calificaciones falla si ya existe calificacion', async () => {
        Alumno.findByPk.mockResolvedValue({ id: 1 });
        Evaluacion.findByPk.mockResolvedValue({ id: 1 });
        Calificacion.findOne.mockResolvedValue({ id: 5 }); // Ya existe

        const res = await request(app).post('/calificaciones').send({
            nota: 8,
            alumnoId: 1,
            evaluacionId: 1
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('tiene una calificación');
    });

    test('GET /calificaciones devuelve lista', async () => {
        Calificacion.findAll.mockResolvedValue([{ id: 1, nota: 10 }]);

        const res = await request(app).get('/calificaciones');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
});
