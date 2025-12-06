import Carrera from '../models/Carrera.js';
import Facultad from '../models/facultad.js';

export class CarreraRepository {
    async findAll() {
        return Carrera.findAll({
            include: [{ model: Facultad, attributes: ['nombre'] }]
        });
    }

    async findById(id) {
        return Carrera.findByPk(id, {
            include: [{ model: Facultad, attributes: ['nombre'] }]
        });
    }

    async findByCodigo(codigo) {
        return Carrera.findOne({ where: { codigo } });
    }

    async create(data) {
        return Carrera.create(data);
    }

    async update(id, data) {
        const carrera = await Carrera.findByPk(id);
        if (!carrera) return null;
        return carrera.update(data);
    }

    async remove(id) {
        return Carrera.destroy({ where: { id } });
    }
}
