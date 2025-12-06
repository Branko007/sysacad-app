import Inscripcion from '../models/Inscripcion.js';
import Materia from '../models/Materia.js';
import Alumno from '../models/Alumno.js';

export class InscripcionRepository {
    async create(data) {
        return Inscripcion.create(data);
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
