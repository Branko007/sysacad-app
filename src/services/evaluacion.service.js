import { EvaluacionRepository } from '../repositories/evaluacion.repository.js';
import Materia from '../models/Materia.js';

export class EvaluacionService {
    constructor(repo = new EvaluacionRepository()) {
        this.repo = repo;
    }

    async listar() {
        return this.repo.findAll();
    }

    async obtener(id) {
        return this.repo.findById(id);
    }

    async crear(data) {
        const { materiaId, fecha } = data;

        // Validar materia
        const materia = await Materia.findByPk(materiaId);
        if (!materia) throw new Error('Materia no encontrada');

        // Opcional: Validar fecha futura si es regla de negocio
        // if (new Date(fecha) < new Date()) { ... }

        return this.repo.create(data);
    }

    async actualizar(id, data) {
        if (data.materiaId) {
            const materia = await Materia.findByPk(data.materiaId);
            if (!materia) throw new Error('Materia no encontrada');
        }
        return this.repo.update(id, data);
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
