import Facultad from '../models/facultad.js';

export class FacultadRepository {
  async findAll() {
    return Facultad.findAll();
  }

  async findById(id) {
    return Facultad.findByPk(id);
  }

  async findByNombre(nombre) {
    return Facultad.findOne({ where: { nombre } });
  }

  async create(data) {
    return Facultad.create(data);
  }

  async update(id, data) {
    const facultad = await Facultad.findByPk(id);
    if (!facultad) return null;
    return facultad.update(data);
  }

  async remove(id) {
    return Facultad.destroy({ where: { id } });
  }
}
