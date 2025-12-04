import Persona from '../models/Persona.js';

export class PersonaRepository {
    async findAll() {
        return Persona.findAll();
    }

    async findById(id) {
        return Persona.findByPk(id);
    }

    async findByDocumento(nroDocumento) {
        return Persona.findOne({ where: { nroDocumento } });
    }

    async findByEmail(email) {
        return Persona.findOne({ where: { email } });
    }

    async create(data) {
        return Persona.create(data);
    }

    async update(id, data) {
        const persona = await Persona.findByPk(id);
        if (!persona) return null;
        return persona.update(data);
    }

    async remove(id) {
        return Persona.destroy({ where: { id } });
    }
}
