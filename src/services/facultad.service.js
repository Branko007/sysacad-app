import { FacultadRepository } from '../repositories/facultad.repository.js';
import { FacultadEntity } from '../entities/facultad.entity.js';

export class FacultadService {
  constructor(repo = new FacultadRepository()) {
    this.repo = repo;
  }

  async listar() {
    const rows = await this.repo.findAll();
    return rows.map(FacultadEntity.fromModel).map(f => f.toJSON());
  }

  async obtener(id) {
    const row = await this.repo.findById(id);
    return row ? FacultadEntity.fromModel(row).toJSON() : null;
  }

  async crear(data) {
    // Validar duplicados
    const exists = await this.repo.findByNombre(data.nombre);
    if (exists) throw new Error('Ya existe una facultad con ese nombre');

    const created = await this.repo.create(data);
    return FacultadEntity.fromModel(created).toJSON();
  }

  async actualizar(id, data) {
    if (data.nombre) {
        const exists = await this.repo.findByNombre(data.nombre);
        if (exists && exists.id !== id) throw new Error('Ya existe otra facultad con ese nombre');
    }

    const updated = await this.repo.update(id, data);
    return updated ? FacultadEntity.fromModel(updated).toJSON() : null;
  }

  async eliminar(id) {
    const result = await this.repo.remove(id);
    return result > 0;
  }
}