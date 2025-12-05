import { jest } from '@jest/globals';
import { UsuarioService } from '../../services/usuario.service.js';
import { UsuarioEntity } from '../../entities/usuario.entity.js';

describe('UsuarioService', () => {
    let service;
    let mockRepo;
    let mockPersonaRepo;

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        mockPersonaRepo = {
            findByDocumento: jest.fn(),
            findByEmail: jest.fn(),
        };
        service = new UsuarioService(mockRepo, mockPersonaRepo);
    });

    test('listar devuelve lista de usuarios', async () => {
        const mockData = [{
            id: 1,
            nombreUsuario: 'test',
            rol: 'admin',
            Persona: {
                toJSON: () => ({
                    id: 1,
                    nombre: 'Test',
                    apellido: 'User',
                    email: 'test@example.com'
                })
            }
        }];
        mockRepo.findAll.mockResolvedValue(mockData);

        const result = await service.listar();

        expect(result).toHaveLength(1);
        expect(result[0].nombreUsuario).toBe('test');
        expect(result[0].email).toBe('test@example.com');
    });

    test('crear lanza error si documento existe', async () => {
        mockPersonaRepo.findByDocumento.mockResolvedValue({ id: 1 });

        await expect(service.crear({ nroDocumento: '123' }))
            .rejects.toThrow('El documento ya está registrado');
    });

    test('crear lanza error si email existe', async () => {
        mockPersonaRepo.findByDocumento.mockResolvedValue(null);
        mockPersonaRepo.findByEmail.mockResolvedValue({ id: 1 });

        await expect(service.crear({ nroDocumento: '123', email: 'test@example.com' }))
            .rejects.toThrow('El email ya está registrado');
    });
});
