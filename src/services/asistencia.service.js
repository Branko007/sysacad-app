import { AsistenciaRepository } from '../repositories/asistencia.repository.js';
import Alumno from '../models/Alumno.js';
import Clase from '../models/Clase.js';

export class AsistenciaService {
    constructor(repo = new AsistenciaRepository()) {
        this.repo = repo;
    }

    async listar() {
        return this.repo.findAll();
    }

    async obtener(id) {
        return this.repo.findById(id);
    }

    async listarPorClase(claseId) {
        return this.repo.findByClase(claseId);
    }

    async registrar(data) {
        const { claseId, alumnoId } = data;

        // Validar clase
        const clase = await Clase.findByPk(claseId);
        if (!clase) throw new Error('Clase no encontrada');

        // Validar alumno
        const alumno = await Alumno.findByPk(alumnoId);
        if (!alumno) throw new Error('Alumno no encontrado');

        // Validar duplicado
        const canRegister = await this.repo.canRegister(claseId, alumnoId);
        if (!canRegister) throw new Error('El alumno ya tiene asistencia registrada para esta clase');

        return this.repo.create(data);
    }

    async actualizar(id, data) {
        return this.repo.update(id, data);
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
