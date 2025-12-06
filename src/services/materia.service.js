import { MateriaRepository } from '../repositories/materia.repository.js';
import { MateriaEntity } from '../entities/materia.entity.js';

export class MateriaService {
    constructor(repo = new MateriaRepository()) {
        this.repo = repo;
    }

    async listar() {
        const rows = await this.repo.findAll();
        return rows.map(MateriaEntity.fromModel).map(m => m.toJSON());
    }

    async obtener(id) {
        const row = await this.repo.findById(id);
        return row ? MateriaEntity.fromModel(row).toJSON() : null;
    }

    async crear(data) {
        const created = await this.repo.create(data);
        return MateriaEntity.fromModel(created).toJSON();
    }

    async actualizar(id, data) {
        const updated = await this.repo.update(id, data);
        return updated ? MateriaEntity.fromModel(updated).toJSON() : null;
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
