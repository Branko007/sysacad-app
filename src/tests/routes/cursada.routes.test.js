import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Clase.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.unstable_mockModule('../../models/Asistencia.js', () => ({
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

jest.unstable_mockModule('../../models/Materia.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    },
}));

jest.unstable_mockModule('../../models/Alumno.js', () => ({
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
const { default: Clase } = await import('../../models/Clase.js');
const { default: Asistencia } = await import('../../models/Asistencia.js');
const { default: Materia } = await import('../../models/Materia.js');
const { default: Alumno } = await import('../../models/Alumno.js');
const { default: clasesRouter } = await import('../../routes/clases.routes.js');
const { default: asistenciasRouter } = await import('../../routes/asistencias.routes.js');

describe('Cursada Routes (Clases & Asistencia)', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/clases', clasesRouter);
        app.use('/asistencias', asistenciasRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Clases', () => {
        test('POST /clases crea clase valida', async () => {
            Materia.findByPk.mockResolvedValue({ id: 1 });

            const mockCreated = {
                id: 1,
                fecha: '2024-06-01',
                horaInicio: '18:00',
                horaFin: '22:00',
                materiaId: 1,
                toJSON: () => ({ id: 1 })
            };
            Clase.create.mockResolvedValue(mockCreated);

            const res = await request(app).post('/clases').send({
                fecha: '2024-06-01',
                horaInicio: '18:00',
                horaFin: '22:00',
                materiaId: 1
            });

            expect(res.status).toBe(201);
            expect(Clase.create).toHaveBeenCalled();
        });

        test('POST /clases falla fecha invalida (inicio > fin)', async () => {
            Materia.findByPk.mockResolvedValue({ id: 1 });

            const res = await request(app).post('/clases').send({
                fecha: '2024-06-01',
                horaInicio: '22:00',
                horaFin: '18:00',
                materiaId: 1
            });

            // This is caught by Service or Validator?
            // Validator regex checks format, Service checks logic.
            // Service throws error.
            expect(res.status).toBe(400);
        });
    });

    describe('Asistencias', () => {
        test('POST /asistencias registra asistencia valida', async () => {
            Clase.findByPk.mockResolvedValue({ id: 1 });
            Alumno.findByPk.mockResolvedValue({ id: 1 });
            Asistencia.findOne.mockResolvedValue(null); // No duplicado

            const mockCreated = { id: 1, presente: true, claseId: 1, alumnoId: 1, toJSON: () => ({ id: 1 }) };
            Asistencia.create.mockResolvedValue(mockCreated);

            const res = await request(app).post('/asistencias').send({
                presente: true,
                claseId: 1,
                alumnoId: 1
            });

            expect(res.status).toBe(201);
            expect(Asistencia.create).toHaveBeenCalled();
        });

        test('POST /asistencias falla si alumno ya tiene asistencia', async () => {
            Clase.findByPk.mockResolvedValue({ id: 1 });
            Alumno.findByPk.mockResolvedValue({ id: 1 });
            Asistencia.findOne.mockResolvedValue({ id: 99 }); // Duplicado

            const res = await request(app).post('/asistencias').send({
                presente: true,
                claseId: 1,
                alumnoId: 1
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('ya tiene asistencia');
        });
    });
});
