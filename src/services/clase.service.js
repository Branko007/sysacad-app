import { ClaseRepository } from '../repositories/clase.repository.js';
import Materia from '../models/Materia.js';

export class ClaseService {
    constructor(repo = new ClaseRepository()) {
        this.repo = repo;
    }

    async listar() {
        return this.repo.findAll();
    }

    async obtener(id) {
        return this.repo.findById(id);
    }

    async crear(data) {
        const { materiaId, horaInicio, horaFin } = data;

        // Validar materia
        const materia = await Materia.findByPk(materiaId);
        if (!materia) throw new Error('Materia no encontrada');

        // Validar horarios
        if (horaInicio >= horaFin) {
            throw new Error('La hora de inicio debe ser anterior a la hora de fin');
        }

        return this.repo.create(data);
    }

    async actualizar(id, data) {
        if (data.materiaId) {
            const materia = await Materia.findByPk(data.materiaId);
            if (!materia) throw new Error('Materia no encontrada');
        }

        if (data.horaInicio && data.horaFin) {
            if (data.horaInicio >= data.horaFin) {
                throw new Error('La hora de inicio debe ser anterior a la hora de fin');
            }
        }

        return this.repo.update(id, data);
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
