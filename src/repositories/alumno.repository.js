import Alumno from '../models/Alumno.js';
import Persona from '../models/Persona.js';
import sequelize from '../config/db.js';

export class AlumnoRepository {
    async findAll() {
        return Alumno.findAll({
            include: [{ model: Persona, required: true }]
        });
    }

    async findById(id) {
        return Alumno.findByPk(id, {
            include: [{ model: Persona, required: true }]
        });
    }

    async findByLegajo(nroLegajo) {
        return Alumno.findOne({
            where: { nroLegajo },
            include: [{ model: Persona, required: true }]
        });
    }

    async create(alumnoData, personaData) {
        const t = await sequelize.transaction();

        try {
            const persona = await Persona.create(personaData, { transaction: t });
            const alumno = await Alumno.create({
                ...alumnoData,
                personaId: persona.id
            }, { transaction: t });

            await t.commit();

            // Recargar para obtener el objeto completo con la asociación
            return this.findById(alumno.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async update(id, alumnoData, personaData) {
        const t = await sequelize.transaction();

        try {
            const alumno = await Alumno.findByPk(id);
            if (!alumno) throw new Error('Alumno no encontrado');

            await alumno.update(alumnoData, { transaction: t });

            const persona = await Persona.findByPk(alumno.personaId);
            if (personaData && persona) {
                await persona.update(personaData, { transaction: t });
            }

            await t.commit();
            return this.findById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async remove(id) {
        const t = await sequelize.transaction();
        try {
            const alumno = await Alumno.findByPk(id);
            if (!alumno) return 0;

            const personaId = alumno.personaId;

            await alumno.destroy({ transaction: t });
            await Persona.destroy({ where: { id: personaId }, transaction: t });

            await t.commit();
            return 1;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
