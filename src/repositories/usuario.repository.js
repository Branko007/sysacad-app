// src/repositories/usuario.repository.js
import Usuario from '../models/Usuario.js';

export class UsuarioRepository {
  async findAll() {
    return Usuario.findAll();
  }

  async findById(id) {
    return Usuario.findByPk(id);
  }

  async findByEmail(email) {
    return Usuario.findOne({ where: { email } });
  }

  async create({ nombre, email, password, rol }) {
    return Usuario.create({ nombre, email, password, rol });
  }

  async update(id, data) {
    const user = await Usuario.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async remove(id) {
    return Usuario.destroy({ where: { id } });
  }
}
