import Evaluacion from '../models/Evaluacion.js';
import Materia from '../models/Materia.js';

export class EvaluacionRepository {
    async findAll() {
        return Evaluacion.findAll({
            include: [{ model: Materia, attributes: ['nombre'] }]
        });
    }

    async findById(id) {
        return Evaluacion.findByPk(id, {
            include: [{ model: Materia, attributes: ['nombre'] }]
        });
    }

    async findByMateria(materiaId) {
        return Evaluacion.findAll({ where: { materiaId } });
    }

    async create(data) {
        return Evaluacion.create(data);
    }

    async update(id, data) {
        const evaluacion = await Evaluacion.findByPk(id);
        if (!evaluacion) return null;
        return evaluacion.update(data);
    }

    async remove(id) {
        return Evaluacion.destroy({ where: { id } });
    }
}
