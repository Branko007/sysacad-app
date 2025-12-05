import { ProfesorRepository } from '../repositories/profesor.repository.js';
import { ProfesorEntity } from '../entities/profesor.entity.js';
import { PersonaRepository } from '../repositories/persona.repository.js';

export class ProfesorService {
    constructor(repo = new ProfesorRepository(), personaRepo = new PersonaRepository()) {
        this.repo = repo;
        this.personaRepo = personaRepo;
    }

    async listar() {
        const rows = await this.repo.findAll();
        return rows.map(ProfesorEntity.fromModel).map(p => p.toJSON());
    }

    async obtener(id) {
        const row = await this.repo.findById(id);
        return row ? ProfesorEntity.fromModel(row).toJSON() : null;
    }

    async crear(data) {
        // Validar unicidad de documento y email en Persona
        const existsDoc = await this.personaRepo.findByDocumento(data.nroDocumento);
        if (existsDoc) throw new Error('El documento ya está registrado');

        const existsEmail = await this.personaRepo.findByEmail(data.email);
        if (existsEmail) throw new Error('El email ya está registrado');

        // Validar unicidad de legajo
        const existsLegajo = await this.repo.findByLegajo(data.legajo);
        if (existsLegajo) throw new Error('El legajo ya está registrado');

        // Separar datos
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

        const profesorData = {
            legajo: data.legajo,
            fechaIngreso: data.fechaIngreso,
            especialidad: data.especialidad,
            antigüedad: data.antigüedad
        };

        const created = await this.repo.create(profesorData, personaData);
        return ProfesorEntity.fromModel(created).toJSON();
    }

    async actualizar(id, data) {
        // Separar datos
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

        const profesorData = {
            legajo: data.legajo,
            fechaIngreso: data.fechaIngreso,
            especialidad: data.especialidad,
            antigüedad: data.antigüedad
        };

        // Limpiar undefined
        Object.keys(personaData).forEach(key => personaData[key] === undefined && delete personaData[key]);
        Object.keys(profesorData).forEach(key => profesorData[key] === undefined && delete profesorData[key]);

        const updated = await this.repo.update(id, profesorData, personaData);
        return updated ? ProfesorEntity.fromModel(updated).toJSON() : null;
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
