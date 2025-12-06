import Calificacion from '../models/Calificacion.js';
import Alumno from '../models/Alumno.js';
import Evaluacion from '../models/Evaluacion.js';
import Persona from '../models/Persona.js';

export class CalificacionRepository {
    async findAll() {
        return Calificacion.findAll({
            include: [
                {
                    model: Alumno,
                    include: [{ model: Persona, attributes: ['nombre', 'apellido', 'dni'] }]
                },
                { model: Evaluacion, attributes: ['fecha', 'tipo', 'descripcion'] }
            ]
        });
    }

    async findById(id) {
        return Calificacion.findByPk(id, {
            include: [
                {
                    model: Alumno,
                    include: [{ model: Persona, attributes: ['nombre', 'apellido', 'dni'] }]
                },
                { model: Evaluacion, attributes: ['fecha', 'tipo', 'descripcion'] }
            ]
        });
    }

    async findByAlumnoAndEvaluacion(alumnoId, evaluacionId) {
        return Calificacion.findOne({ where: { alumnoId, evaluacionId } });
    }

    async create(data) {
        return Calificacion.create(data);
    }

    async update(id, data) {
        const calificacion = await Calificacion.findByPk(id);
        if (!calificacion) return null;
        return calificacion.update(data);
    }

    async remove(id) {
        return Calificacion.destroy({ where: { id } });
    }
}
