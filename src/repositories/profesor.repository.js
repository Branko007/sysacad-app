import Profesor from '../models/Profesor.js';
import Persona from '../models/Persona.js';
import sequelize from '../config/db.js';

export class ProfesorRepository {
    async findAll() {
        return Profesor.findAll({
            include: [{ model: Persona, required: true }]
        });
    }

    async findById(id) {
        return Profesor.findByPk(id, {
            include: [{ model: Persona, required: true }]
        });
    }

    async findByLegajo(legajo) {
        return Profesor.findOne({
            where: { legajo },
            include: [{ model: Persona, required: true }]
        });
    }

    async create(profesorData, personaData) {
        const t = await sequelize.transaction();

        try {
            const persona = await Persona.create(personaData, { transaction: t });
            const profesor = await Profesor.create({
                ...profesorData,
                personaId: persona.id
            }, { transaction: t });

            await t.commit();

            return this.findById(profesor.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async update(id, profesorData, personaData) {
        const t = await sequelize.transaction();

        try {
            const profesor = await Profesor.findByPk(id);
            if (!profesor) throw new Error('Profesor no encontrado');

            await profesor.update(profesorData, { transaction: t });

            const persona = await Persona.findByPk(profesor.personaId);
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
            const profesor = await Profesor.findByPk(id);
            if (!profesor) return 0;

            const personaId = profesor.personaId;

            await profesor.destroy({ transaction: t });
            await Persona.destroy({ where: { id: personaId }, transaction: t });

            await t.commit();
            return 1;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}
