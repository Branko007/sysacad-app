import Asistencia from '../models/Asistencia.js';
import Alumno from '../models/Alumno.js';
import Clase from '../models/Clase.js';
import Persona from '../models/Persona.js';

export class AsistenciaRepository {
    async findAll() {
        return Asistencia.findAll({
            include: [
                {
                    model: Alumno,
                    include: [{ model: Persona, attributes: ['nombre', 'apellido', 'dni'] }]
                },
                { model: Clase, attributes: ['fecha', 'tema'] }
            ]
        });
    }

    async findById(id) {
        return Asistencia.findByPk(id, {
            include: [
                {
                    model: Alumno,
                    include: [{ model: Persona, attributes: ['nombre', 'apellido', 'dni'] }]
                },
                { model: Clase, attributes: ['fecha', 'tema'] }
            ]
        });
    }

    async findByClase(claseId) {
        return Asistencia.findAll({
            where: { claseId },
            include: [
                {
                    model: Alumno,
                    include: [{ model: Persona, attributes: ['nombre', 'apellido', 'dni'] }]
                }
            ]
        });
    }

    async findByAlumno(alumnoId) {
        return Asistencia.findAll({ where: { alumnoId }, include: [Clase] });
    }

    async canRegister(claseId, alumnoId) {
        const existing = await Asistencia.findOne({ where: { claseId, alumnoId } });
        return !existing;
    }

    async create(data) {
        return Asistencia.create(data);
    }

    async update(id, data) {
        const asistencia = await Asistencia.findByPk(id);
        if (!asistencia) return null;
        return asistencia.update(data);
    }

    async remove(id) {
        return Asistencia.destroy({ where: { id } });
    }
}
