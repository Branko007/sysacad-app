import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../../models/Inscripcion.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.unstable_mockModule('../../models/Alumno.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
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
const { default: Inscripcion } = await import('../../models/Inscripcion.js');
const { default: Alumno } = await import('../../models/Alumno.js');
const { default: Materia } = await import('../../models/Materia.js');
const { default: inscripcionesRouter } = await import('../../routes/inscripciones.routes.js');

describe('Inscripciones Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/inscripciones', inscripcionesRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // POST /
    test('POST /inscripciones inscribe alumno valido', async () => {
        Alumno.findByPk.mockResolvedValue({ id: 1 });
        Materia.findByPk.mockResolvedValue({ id: 1 });
        Inscripcion.findOne.mockResolvedValue(null); // No duplicado

        const mockCreated = {
            id: 1,
            alumnoId: 1,
            materiaId: 1,
            cicloLectivo: 2024,
            toJSON: () => ({ id: 1, alumnoId: 1, materiaId: 1 })
        };
        // Repo create returns model, model.create returns model.
        Inscripcion.create.mockResolvedValue(mockCreated);

        const res = await request(app).post('/inscripciones').send({
            alumnoId: 1,
            materiaId: 1,
            cicloLectivo: 2024
        });

        expect(res.status).toBe(201);
        expect(Inscripcion.create).toHaveBeenCalled();
    });

    test('POST /inscripciones falla si alumno no existe', async () => {
        Alumno.findByPk.mockResolvedValue(null);
        const res = await request(app).post('/inscripciones').send({
            alumnoId: 99,
            materiaId: 1,
            cicloLectivo: 2024
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('Alumno no encontrado');
    });

    test('POST /inscripciones falla si ya esta inscripto', async () => {
        Alumno.findByPk.mockResolvedValue({ id: 1 });
        Materia.findByPk.mockResolvedValue({ id: 1 });
        Inscripcion.findOne.mockResolvedValue({ id: 5 }); // Ya existe

        const res = await request(app).post('/inscripciones').send({
            alumnoId: 1,
            materiaId: 1,
            cicloLectivo: 2024
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('ya está inscripto');
    });

    // GET /alumno/:id
    test('GET /inscripciones/alumno/:id devuelve lista', async () => {
        Inscripcion.findAll.mockResolvedValue([{ id: 1, alumnoId: 1, materiaId: 1 }]);

        const res = await request(app).get('/inscripciones/alumno/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    // DELETE /:id
    test('DELETE /inscripciones/:id cancela correcto', async () => {
        Inscripcion.destroy.mockResolvedValue(1);
        const res = await request(app).delete('/inscripciones/1');
        expect(res.status).toBe(204);
    });
});
