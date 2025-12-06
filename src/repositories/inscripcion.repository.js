import Inscripcion from '../models/Inscripcion.js';
import Materia from '../models/Materia.js';
import Alumno from '../models/Alumno.js';
import Persona from '../models/Persona.js';

export class InscripcionRepository {
    async create(data) {
        return Inscripcion.create(data);
    }

    async findAll() {
        return Inscripcion.findAll({
            include: [
                { model: Alumno, include: [{ model: Persona, attributes: ['nombre', 'apellido'] }] },
                { model: Materia, attributes: ['nombre', 'anio'] }
            ]
        });
    }

    async findByAlumno(alumnoId) {
        return Inscripcion.findAll({
            where: { alumnoId },
            include: [
                { model: Materia, attributes: ['id', 'nombre', 'anio'] }
            ]
        });
    }

    async findByAlumnoAndMateria(alumnoId, materiaId) {
        return Inscripcion.findOne({
            where: { alumnoId, materiaId }
        });
    }

    async remove(id) {
        return Inscripcion.destroy({ where: { id } });
    }
}
