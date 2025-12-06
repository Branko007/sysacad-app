import { InscripcionRepository } from '../repositories/inscripcion.repository.js';
import Alumno from '../models/Alumno.js';
import Materia from '../models/Materia.js';

export class InscripcionService {
    constructor(repo = new InscripcionRepository()) {
        this.repo = repo;
    }

    async inscribir(data) {
        const { alumnoId, materiaId } = data;

        // Validar existencia de Alumno y Materia
        const alumno = await Alumno.findByPk(alumnoId);
        if (!alumno) throw new Error('Alumno no encontrado');

        const materia = await Materia.findByPk(materiaId);
        if (!materia) throw new Error('Materia no encontrada');

        // Validar duplicados
        const existente = await this.repo.findByAlumnoAndMateria(alumnoId, materiaId);
        if (existente) throw new Error('El alumno ya está inscripto en esta materia');

        return this.repo.create(data);
    }

    async listarPorAlumno(alumnoId) {
        // Validar existencia de alumno opcionalmente, pero findByAlumno simplemente devolvería vacío
        return this.repo.findByAlumno(alumnoId);
    }

    async cancelar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
