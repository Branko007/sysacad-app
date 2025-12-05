import Usuario from '../models/Usuario.js';
import Persona from '../models/Persona.js';
import sequelize from '../config/db.js';

export class UsuarioRepository {
  async findAll() {
    return Usuario.findAll({
      include: [{ model: Persona, required: true }]
    });
  }

  async findById(id) {
    return Usuario.findByPk(id, {
      include: [{ model: Persona, required: true }]
    });
  }

  async findByEmail(email) {
    // Buscar usuario a través de la persona por email
    return Usuario.findOne({
      include: [{
        model: Persona,
        where: { email },
        required: true
      }]
    });
  }

  async create(usuarioData, personaData) {
    const t = await sequelize.transaction();

    try {
      const persona = await Persona.create(personaData, { transaction: t });
      const usuario = await Usuario.create({
        ...usuarioData,
        personaId: persona.id
      }, { transaction: t });

      await t.commit();
      return this.findById(usuario.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(id, usuarioData, personaData) {
    const t = await sequelize.transaction();

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) throw new Error('Usuario no encontrado');

      await usuario.update(usuarioData, { transaction: t });

      const persona = await Persona.findByPk(usuario.personaId);
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
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return 0;

      const personaId = usuario.personaId;

      await usuario.destroy({ transaction: t });
      await Persona.destroy({ where: { id: personaId }, transaction: t });

      await t.commit();
      return 1;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
