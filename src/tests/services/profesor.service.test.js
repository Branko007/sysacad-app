import { jest } from '@jest/globals';
import { ProfesorService } from '../../services/profesor.service.js';

describe('ProfesorService', () => {
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
        service = new ProfesorService(mockRepo, mockPersonaRepo);
    });

    test('listar devuelve lista de profesores', async () => {
        const mockData = [{
            id: 1,
            legajo: 100,
            fechaIngreso: '2023-01-01',
            especialidad: 'Sistemas',
            antigüedad: 5,
            Persona: {
                toJSON: () => ({
                    id: 1,
                    nombre: 'Juan',
                    apellido: 'Perez',
                    email: 'juan@example.com'
                })
            }
        }];
        mockRepo.findAll.mockResolvedValue(mockData);

        const result = await service.listar();

        expect(result).toHaveLength(1);
        expect(result[0].legajo).toBe(100);
        expect(result[0].email).toBe('juan@example.com');
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

        await expect(service.crear({ nroDocumento: '123', email: 'test@test.com', legajo: 100 }))
            .rejects.toThrow('El legajo ya está registrado');
    });
});
