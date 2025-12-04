import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Persona.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
    },
}));

// Mock auth middleware to bypass token check
jest.unstable_mockModule('../../middlewares/auth.middleware.js', () => ({
    authenticateToken: (req, res, next) => next(),
}));

const { default: Persona } = await import('../../models/Persona.js');
const { default: personasRouter } = await import('../../routes/personas.routes.js');

describe('Personas Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/personas', personasRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /personas devuelve lista', async () => {
        Persona.findAll.mockResolvedValue([]);
        const res = await request(app).get('/personas');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /personas crea persona valida', async () => {
        Persona.findOne.mockResolvedValue(null); // No duplicates
        Persona.create.mockResolvedValue({
            id: 1,
            apellido: 'Doe',
            nombre: 'John',
            nroDocumento: '12345678',
            tipoDocumento: 'dni',
            fechaNacimiento: '1990-01-01',
            email: 'john@example.com'
        });

        const res = await request(app).post('/personas').send({
            apellido: 'Doe',
            nombre: 'John',
            nroDocumento: '12345678',
            tipoDocumento: 'dni',
            fechaNacimiento: '1990-01-01',
            email: 'john@example.com'
        });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe(1);
    });

    test('POST /personas falla validacion', async () => {
        const res = await request(app).post('/personas').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validación');
    });
});
