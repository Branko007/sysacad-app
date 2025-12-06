import Materia from '../models/Materia.js';

export class MateriaRepository {
    async findAll() {
        return Materia.findAll();
    }

    async findById(id) {
        return Materia.findByPk(id);
    }

    async create(data) {
        return Materia.create(data);
    }

    async update(id, data) {
        const materia = await Materia.findByPk(id);
        if (!materia) return null;
        return materia.update(data);
    }

    async remove(id) {
        return Materia.destroy({ where: { id } });
    }
}
