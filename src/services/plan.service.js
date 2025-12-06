import { PlanRepository } from '../repositories/plan.repository.js';
import Carrera from '../models/Carrera.js';

export class PlanService {
    constructor(repo = new PlanRepository()) {
        this.repo = repo;
    }

    async listar() {
        return this.repo.findAll();
    }

    async obtener(id) {
        return this.repo.findById(id);
    }

    async crear(data) {
        const { carreraId, fechaInicio, fechaFin } = data;

        // Validar carrera
        const carrera = await Carrera.findByPk(carreraId);
        if (!carrera) throw new Error('Carrera no encontrada');

        // Validar fechas
        if (new Date(fechaInicio) >= new Date(fechaFin)) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        // Validar codigo unico
        const existe = await this.repo.findByCodigo(data.codigo);
        if (existe) throw new Error('Ya existe un plan con ese código');

        return this.repo.create(data);
    }

    async actualizar(id, data) {
        // Validaciones si se actualizan campos sensibles
        if (data.fechaInicio && data.fechaFin) {
            if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
                throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
            }
        }

        if (data.carreraId) {
            const carrera = await Carrera.findByPk(data.carreraId);
            if (!carrera) throw new Error('Carrera no encontrada');
        }

        return this.repo.update(id, data);
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
