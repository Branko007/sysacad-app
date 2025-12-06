import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Evaluacion.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.unstable_mockModule('../../models/Materia.js', () => ({
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
const { default: Evaluacion } = await import('../../models/Evaluacion.js');
const { default: Materia } = await import('../../models/Materia.js');
const { default: evaluacionesRouter } = await import('../../routes/evaluaciones.routes.js');

describe('Evaluaciones Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/evaluaciones', evaluacionesRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /
    test('POST /evaluaciones crea evaluacion valida', async () => {
        Materia.findByPk.mockResolvedValue({ id: 1 });

        const mockCreated = {
            id: 1,
            fecha: '2024-06-01',
            tipo: 'parcial',
            descripcion: 'Primer Parcial',
            materiaId: 1,
            toJSON: () => ({ id: 1, descripcion: 'Primer Parcial' })
        };
        Evaluacion.create.mockResolvedValue(mockCreated);

        const res = await request(app).post('/evaluaciones').send({
            fecha: '2024-06-01',
            tipo: 'parcial',
            descripcion: 'Primer Parcial',
            materiaId: 1
        });

        expect(res.status).toBe(201);
        expect(Evaluacion.create).toHaveBeenCalled();
    });

    test('POST /evaluaciones falla si materia no existe', async () => {
        Materia.findByPk.mockResolvedValue(null);

        const res = await request(app).post('/evaluaciones').send({
            fecha: '2024-06-01',
            tipo: 'parcial',
            descripcion: 'Primer Parcial',
            materiaId: 99
        });

        expect(res.status).toBe(400);
    });

    // GET /
    test('GET /evaluaciones devuelve lista', async () => {
        Evaluacion.findAll.mockResolvedValue([{ id: 1, descripcion: 'Parcial' }]);

        const res = await request(app).get('/evaluaciones');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
});
