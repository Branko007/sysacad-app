import { jest } from '@jest/globals';
import { PersonaService } from '../../services/persona.service.js';
import { PersonaEntity } from '../../entities/persona.entity.js';

describe('PersonaService', () => {
    let service;
    let mockRepo;

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByDocumento: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        service = new PersonaService(mockRepo);
    });

    test('listar devuelve array de entidades JSON', async () => {
        const mockData = [{ id: 1, nombre: 'Test' }];
        mockRepo.findAll.mockResolvedValue(mockData);
        // Mock static fromModel
        const originalFromModel = PersonaEntity.fromModel;
        PersonaEntity.fromModel = jest.fn(x => ({ toJSON: () => x }));

        const result = await service.listar();
        expect(result).toEqual(mockData);
        expect(mockRepo.findAll).toHaveBeenCalled();

        PersonaEntity.fromModel = originalFromModel;
    });

    test('crear lanza error si documento existe', async () => {
        mockRepo.findByDocumento.mockResolvedValue({ id: 1 });
        await expect(service.crear({ nroDocumento: '123' }))
            .rejects.toThrow('El documento ya está registrado');
    });

    test('crear crea persona si no existe conflicto', async () => {
        mockRepo.findByDocumento.mockResolvedValue(null);
        mockRepo.findByEmail.mockResolvedValue(null);
        const input = { nroDocumento: '123', email: 'test@test.com' };
        const created = { ...input, id: 1 };
        mockRepo.create.mockResolvedValue(created);

        const result = await service.crear(input);
        expect(result.id).toBe(1);
        expect(mockRepo.create).toHaveBeenCalledWith(input);
    });
});
