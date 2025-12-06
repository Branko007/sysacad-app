import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Carrera.js', () => ({
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

jest.unstable_mockModule('../../models/facultad.js', () => ({
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
const { default: Carrera } = await import('../../models/Carrera.js');
const { default: Facultad } = await import('../../models/facultad.js');
const { default: carrerasRouter } = await import('../../routes/carreras.routes.js');

describe('Carreras Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/carreras', carrerasRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /
    test('POST /carreras crea carrera valida', async () => {
        Facultad.findByPk.mockResolvedValue({ id: 1 });
        Carrera.findOne.mockResolvedValue(null); // No duplicado

        const mockCreated = {
            id: 1,
            nombre: 'Ingeniería en Sistemas',
            codigo: 'ISI',
            duracionAnios: 5,
            titulo: 'Ingeniero en Sistemas',
            nivel: 'grado',
            facultadId: 1,
            toJSON: () => ({ id: 1, nombre: 'Ingeniería en Sistemas' })
        };
        Carrera.create.mockResolvedValue(mockCreated);

        const res = await request(app).post('/carreras').send({
            nombre: 'Ingeniería en Sistemas',
            codigo: 'ISI',
            duracionAnios: 5,
            titulo: 'Ingeniero en Sistemas',
            nivel: 'grado',
            facultadId: 1
        });

        expect(res.status).toBe(201);
        expect(Carrera.create).toHaveBeenCalled();
    });

    test('POST /carreras falla si facultad no existe', async () => {
        Facultad.findByPk.mockResolvedValue(null);
        Carrera.findOne.mockResolvedValue(null);

        const res = await request(app).post('/carreras').send({
            nombre: 'Ingeniería en Sistemas',
            codigo: 'ISI',
            duracionAnios: 5,
            titulo: 'Ingeniero en Sistemas',
            nivel: 'grado',
            facultadId: 99
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Facultad no encontrada');
    });

    test('POST /carreras falla si codigo existe', async () => {
        Carrera.findOne.mockResolvedValue({ id: 2 }); // Ya existe

        const res = await request(app).post('/carreras').send({
            nombre: 'Ingeniería en Sistemas',
            codigo: 'ISI',
            duracionAnios: 5,
            titulo: 'Ingeniero en Sistemas',
            nivel: 'grado',
            facultadId: 1
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Ya existe una carrera');
    });

    // GET /
    test('GET /carreras devuelve lista', async () => {
        Carrera.findAll.mockResolvedValue([{ id: 1, nombre: 'ISI' }]);

        const res = await request(app).get('/carreras');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
});
