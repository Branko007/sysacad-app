import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { UsuarioEntity } from '../entities/usuario.entity.js';
import { PersonaRepository } from '../repositories/persona.repository.js';

export class UsuarioService {
  constructor(repo = new UsuarioRepository(), personaRepo = new PersonaRepository()) {
    this.repo = repo;
    this.personaRepo = personaRepo;
  }

  async listar() {
    console.log('Service: listar called');
    try {
      const rows = await this.repo.findAll();
      console.log('Service: rows found:', rows);
      return rows.map(UsuarioEntity.fromModel).map(u => u.toJSON());
    } catch (error) {
      console.error('Service: listar error:', error);
      throw error;
    }
  }

  async obtener(id) {
    const row = await this.repo.findById(id);
    return row ? UsuarioEntity.fromModel(row).toJSON() : null;
  }

  async crear(data) {
    // Validar unicidad de documento y email en Persona
    const existsDoc = await this.personaRepo.findByDocumento(data.nroDocumento);
    if (existsDoc) throw new Error('El documento ya está registrado');

    const existsEmail = await this.personaRepo.findByEmail(data.email);
    if (existsEmail) throw new Error('El email ya está registrado');

    // Validar unicidad de nombreUsuario (si aplica)
    // En este diseño simplificado asumimos que el email es único para login, 
    // pero si nombreUsuario es único también deberíamos validarlo.

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const personaData = {
      apellido: data.apellido,
      nombre: data.nombre,
      nroDocumento: data.nroDocumento,
      tipoDocumento: data.tipoDocumento,
      fechaNacimiento: data.fechaNacimiento,
      genero: data.genero,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email
    };

    const usuarioData = {
      nombreUsuario: data.nombreUsuario || data.email, // Fallback si no envían nombreUsuario
      password: hashedPassword,
      rol: data.rol
    };

    const created = await this.repo.create(usuarioData, personaData);
    return UsuarioEntity.fromModel(created).toJSON();
  }

  async actualizar(id, data) {
    const personaData = {
      apellido: data.apellido,
      nombre: data.nombre,
      nroDocumento: data.nroDocumento,
      tipoDocumento: data.tipoDocumento,
      fechaNacimiento: data.fechaNacimiento,
      genero: data.genero,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email
    };

    const usuarioData = {
      nombreUsuario: data.nombreUsuario,
      rol: data.rol
    };

    if (data.password) {
      usuarioData.password = await bcrypt.hash(data.password, 10);
    }

    // Limpiar undefined
    Object.keys(personaData).forEach(key => personaData[key] === undefined && delete personaData[key]);
    Object.keys(usuarioData).forEach(key => usuarioData[key] === undefined && delete usuarioData[key]);

    const updated = await this.repo.update(id, usuarioData, personaData);
    return updated ? UsuarioEntity.fromModel(updated).toJSON() : null;
  }

  async eliminar(id) {
    const result = await this.repo.remove(id);
    return result > 0;
  }
}
