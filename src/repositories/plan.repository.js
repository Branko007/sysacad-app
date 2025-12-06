import Plan from '../models/Plan.js';
import Carrera from '../models/Carrera.js';

export class PlanRepository {
    async findAll() {
        return Plan.findAll({
            include: [{ model: Carrera, attributes: ['nombre'] }]
        });
    }

    async findById(id) {
        return Plan.findByPk(id, {
            include: [{ model: Carrera, attributes: ['nombre'] }]
        });
    }

    async findByCodigo(codigo) {
        return Plan.findOne({ where: { codigo } });
    }

    async findByCarrera(carreraId) {
        return Plan.findAll({ where: { carreraId } });
    }

    async create(data) {
        return Plan.create(data);
    }

    async update(id, data) {
        const plan = await Plan.findByPk(id);
        if (!plan) return null;
        return plan.update(data);
    }

    async remove(id) {
        return Plan.destroy({ where: { id } });
    }
}
