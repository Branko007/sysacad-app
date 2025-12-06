import Clase from '../models/Clase.js';
import Materia from '../models/Materia.js';

export class ClaseRepository {
    async findAll() {
        return Clase.findAll({
            include: [{ model: Materia, attributes: ['nombre'] }]
        });
    }

    async findById(id) {
        return Clase.findByPk(id, {
            include: [{ model: Materia, attributes: ['nombre'] }]
        });
    }

    async findByMateria(materiaId) {
        return Clase.findAll({ where: { materiaId } });
    }

    async create(data) {
        return Clase.create(data);
    }

    async update(id, data) {
        const clase = await Clase.findByPk(id);
        if (!clase) return null;
        return clase.update(data);
    }

    async remove(id) {
        return Clase.destroy({ where: { id } });
    }
}
