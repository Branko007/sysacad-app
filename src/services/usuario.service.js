import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { UsuarioEntity } from '../entities/usuario.entity.js';

export class UsuarioService {
  constructor(repo = new UsuarioRepository()) {
    this.repo = repo;
  }

  async listar() {
    const rows = await this.repo.findAll();
    return rows.map(UsuarioEntity.fromModel).map(u => u.toJSON());
  }

  async obtener(id) {
    const row = await this.repo.findById(id);
    return row ? UsuarioEntity.fromModel(row).toJSON() : null;
  }

  async crear({ nombre, email, password, rol }) {
    const exists = await this.repo.findByEmail(email);
    if (exists) throw new Error('El email ya está registrado');

    const hashed = await bcrypt.hash(password, 10);
    const created = await this.repo.create({ nombre, email, password: hashed, rol });
    return UsuarioEntity.fromModel(created).toJSON();
  }

  async actualizar(id, { nombre, email, password, rol }) {
    const data = { nombre, email, rol };
    if (password) data.password = await bcrypt.hash(password, 10);
    const updated = await this.repo.update(id, data);
    return updated ? UsuarioEntity.fromModel(updated).toJSON() : null;
  }

  async eliminar(id) {
    await this.repo.remove(id);
    return true;
  }
}
