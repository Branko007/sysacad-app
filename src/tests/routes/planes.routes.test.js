import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Plan.js', () => ({
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

jest.unstable_mockModule('../../models/Carrera.js', () => ({
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
const { default: Plan } = await import('../../models/Plan.js');
const { default: Carrera } = await import('../../models/Carrera.js');
const { default: planesRouter } = await import('../../routes/planes.routes.js');

describe('Planes Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/planes', planesRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /
    test('POST /planes crea plan valido', async () => {
        Carrera.findByPk.mockResolvedValue({ id: 1 });
        Plan.findOne.mockResolvedValue(null); // No duplicado

        const mockCreated = {
            id: 1,
            nombre: 'Plan 2023',
            codigo: 'P2023',
            fechaInicio: '2023-01-01',
            fechaFin: '2027-12-31',
            carreraId: 1,
            toJSON: () => ({ id: 1, nombre: 'Plan 2023' })
        };
        Plan.create.mockResolvedValue(mockCreated);

        const res = await request(app).post('/planes').send({
            nombre: 'Plan 2023',
            codigo: 'P2023',
            fechaInicio: '2023-01-01',
            fechaFin: '2027-12-31',
            carreraId: 1
        });

        expect(res.status).toBe(201);
        expect(Plan.create).toHaveBeenCalled();
    });

    test('POST /planes falla fecha invalida', async () => {
        // Validation check for dates from Joi first, but service also checks.
        // If we send format mismatch, Joi catches it.
        // If we send start > end:

        // Mock validations passing (Joi)
        Carrera.findByPk.mockResolvedValue({ id: 1 });
        Plan.findOne.mockResolvedValue(null);

        const res = await request(app).post('/planes').send({
            nombre: 'Plan',
            codigo: 'INV',
            fechaInicio: '2028-01-01',
            fechaFin: '2023-01-01', // Invalid
            carreraId: 1
        });

        expect(res.status).toBe(400);
    });

    // GET /
    test('GET /planes devuelve lista', async () => {
        Plan.findAll.mockResolvedValue([{ id: 1, nombre: 'Plan 2023' }]);

        const res = await request(app).get('/planes');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
});
