import { CarreraRepository } from '../repositories/carrera.repository.js';
import Facultad from '../models/facultad.js';

export class CarreraService {
    constructor(repo = new CarreraRepository()) {
        this.repo = repo;
    }

    async listar() {
        return this.repo.findAll();
    }

    async obtener(id) {
        return this.repo.findById(id);
    }

    async crear(data) {
        const { codigo, facultadId } = data;

        // Validar código único
        const existeCodigo = await this.repo.findByCodigo(codigo);
        if (existeCodigo) throw new Error('Ya existe una carrera con ese código');

        // Validar facultad
        const facultad = await Facultad.findByPk(facultadId);
        if (!facultad) throw new Error('Facultad no encontrada');

        return this.repo.create(data);
    }

    async actualizar(id, data) {
        if (data.codigo) {
            const existeCodigo = await this.repo.findByCodigo(data.codigo);
            if (existeCodigo && existeCodigo.id !== id) throw new Error('Ya existe una carrera con ese código');
        }

        if (data.facultadId) {
            const facultad = await Facultad.findByPk(data.facultadId);
            if (!facultad) throw new Error('Facultad no encontrada');
        }

        return this.repo.update(id, data);
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
