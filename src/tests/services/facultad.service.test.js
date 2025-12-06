import { jest } from '@jest/globals';
import { FacultadService } from '../../services/facultad.service.js';
import { FacultadEntity } from '../../entities/facultad.entity.js';

describe('FacultadService', () => {
    let service;
    let mockRepo;

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByNombre: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        service = new FacultadService(mockRepo);
    });

    test('listar devuelve array de entidades serializadas', async () => {
        const mockData = [{ id: 1, nombre: 'Ingeniería' }, { id: 2, nombre: 'Medicina' }];
        mockRepo.findAll.mockResolvedValue(mockData);

        const result = await service.listar();
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ id: 1, nombre: 'Ingeniería' });
        expect(mockRepo.findAll).toHaveBeenCalled();
    });

    test('obtener devuelve entidad si existe', async () => {
        mockRepo.findById.mockResolvedValue({ id: 1, nombre: 'Ingeniería' });
        const result = await service.obtener(1);
        expect(result).toEqual({ id: 1, nombre: 'Ingeniería' });
    });

    test('obtener devuelve null si no existe', async () => {
        mockRepo.findById.mockResolvedValue(null);
        const result = await service.obtener(99);
        expect(result).toBeNull();
    });

    test('crear lanza error si nombre existe', async () => {
        mockRepo.findByNombre.mockResolvedValue({ id: 1, nombre: 'Ingeniería' });
        await expect(service.crear({ nombre: 'Ingeniería' }))
            .rejects.toThrow('Ya existe una facultad con ese nombre');
    });

    test('crear guarda nueva facultad si valido', async () => {
        mockRepo.findByNombre.mockResolvedValue(null);
        mockRepo.create.mockResolvedValue({ id: 1, nombre: 'Ingeniería' });

        const result = await service.crear({ nombre: 'Ingeniería' });
        expect(result).toEqual({ id: 1, nombre: 'Ingeniería' });
        expect(mockRepo.create).toHaveBeenCalledWith({ nombre: 'Ingeniería' });
    });

    test('actualizar lanza error si nuevo nombre duplicado de otra facultad', async () => {
        mockRepo.findByNombre.mockResolvedValue({ id: 2, nombre: 'Medicina' }); // Existe otra con este nombre
        await expect(service.actualizar(1, { nombre: 'Medicina' }))
            .rejects.toThrow('Ya existe otra facultad con ese nombre');
    });

    test('actualizar permite mismo nombre si es la misma facultad', async () => {
        mockRepo.findByNombre.mockResolvedValue({ id: 1, nombre: 'Ingeniería' }); // Es la misma
        mockRepo.update.mockResolvedValue({ id: 1, nombre: 'Ingeniería' });

        const result = await service.actualizar(1, { nombre: 'Ingeniería' });
        expect(result).toEqual({ id: 1, nombre: 'Ingeniería' });
    });

    test('eliminar devuelve true si se borró', async () => {
        mockRepo.remove.mockResolvedValue(1);
        const result = await service.eliminar(1);
        expect(result).toBe(true);
    });

    test('eliminar devuelve false si no se borró', async () => {
        mockRepo.remove.mockResolvedValue(0);
        const result = await service.eliminar(1);
        expect(result).toBe(false);
    });
});
