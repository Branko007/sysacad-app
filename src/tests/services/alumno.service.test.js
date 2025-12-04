import { jest } from '@jest/globals';
import { AlumnoService } from '../../services/alumno.service.js';
import { AlumnoEntity } from '../../entities/alumno.entity.js';

describe('AlumnoService', () => {
    let service;
    let mockRepo;
    let mockPersonaRepo;

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByLegajo: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        mockPersonaRepo = {
            findByDocumento: jest.fn(),
            findByEmail: jest.fn(),
        };
        service = new AlumnoService(mockRepo, mockPersonaRepo);
    });

    test('crear lanza error si documento existe', async () => {
        mockPersonaRepo.findByDocumento.mockResolvedValue({ id: 1 });
        await expect(service.crear({ nroDocumento: '123' }))
            .rejects.toThrow('El documento ya está registrado');
    });

    test('crear lanza error si legajo existe', async () => {
        mockPersonaRepo.findByDocumento.mockResolvedValue(null);
        mockPersonaRepo.findByEmail.mockResolvedValue(null);
        mockRepo.findByLegajo.mockResolvedValue({ id: 1 });

        await expect(service.crear({ nroDocumento: '123', email: 'test@test.com', nroLegajo: 1000 }))
            .rejects.toThrow('El legajo ya está registrado');
    });

    test('crear crea alumno si todo es valido', async () => {
        mockPersonaRepo.findByDocumento.mockResolvedValue(null);
        mockPersonaRepo.findByEmail.mockResolvedValue(null);
        mockRepo.findByLegajo.mockResolvedValue(null);

        const input = {
            nroDocumento: '123',
            email: 'test@test.com',
            nroLegajo: 1000,
            apellido: 'Doe',
            nombre: 'John'
        };

        // Mock create returning the created entity (simplified)
        const createdModel = {
            id: 1,
            nroLegajo: 1000,
            Persona: {
                toJSON: () => ({ apellido: 'Doe', nombre: 'John' })
            }
        };
        mockRepo.create.mockResolvedValue(createdModel);

        const result = await service.crear(input);
        expect(result.nroLegajo).toBe(1000);
        expect(mockRepo.create).toHaveBeenCalled();
    });
});
