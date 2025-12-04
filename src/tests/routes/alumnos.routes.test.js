import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Alumno.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
        belongsTo: jest.fn(), // Mock association
    },
}));

jest.unstable_mockModule('../../models/Persona.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
        hasOne: jest.fn(), // Mock association
    },
}));

// Mock auth middleware
jest.unstable_mockModule('../../middlewares/auth.middleware.js', () => ({
    authenticateToken: (req, res, next) => next(),
}));

// Mock sequelize transaction
jest.unstable_mockModule('../../config/db.js', () => ({
    __esModule: true,
    default: {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));

const { default: Alumno } = await import('../../models/Alumno.js');
const { default: Persona } = await import('../../models/Persona.js');
const { default: alumnosRouter } = await import('../../routes/alumnos.routes.js');

describe('Alumnos Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/alumnos', alumnosRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /alumnos devuelve lista', async () => {
        Alumno.findAll.mockResolvedValue([]);
        const res = await request(app).get('/alumnos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /alumnos crea alumno valido', async () => {
        Persona.findOne.mockResolvedValue(null); // No duplicates
        Alumno.findOne.mockResolvedValue(null); // No duplicates

        // Mock creation flow
        Persona.create.mockResolvedValue({ id: 1 });
        Alumno.create.mockResolvedValue({ id: 1, personaId: 1 });

        // Mock findById after creation
        Alumno.findByPk.mockResolvedValue({
            id: 1,
            nroLegajo: 1000,
            Persona: {
                toJSON: () => ({
                    apellido: 'Doe',
                    nombre: 'John',
                    email: 'john@example.com'
                })
            }
        });

        const res = await request(app).post('/alumnos').send({
            apellido: 'Doe',
            nombre: 'John',
            nroDocumento: '12345678',
            tipoDocumento: 'dni',
            fechaNacimiento: '1990-01-01',
            email: 'john@example.com',
            nroLegajo: 1000,
            fechaIngreso: '2023-01-01',
            cohorte: 2023
        });

        expect(res.status).toBe(201);
        expect(res.body.nroLegajo).toBe(1000);
    });
});
