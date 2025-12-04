import { AlumnoRepository } from '../repositories/alumno.repository.js';
import { AlumnoEntity } from '../entities/alumno.entity.js';
import { PersonaRepository } from '../repositories/persona.repository.js';

export class AlumnoService {
    constructor(repo = new AlumnoRepository(), personaRepo = new PersonaRepository()) {
        this.repo = repo;
        this.personaRepo = personaRepo;
    }

    async listar() {
        const rows = await this.repo.findAll();
        return rows.map(AlumnoEntity.fromModel).map(a => a.toJSON());
    }

    async obtener(id) {
        const row = await this.repo.findById(id);
        return row ? AlumnoEntity.fromModel(row).toJSON() : null;
    }

    async crear(data) {
        // Validar unicidad de documento y email en Persona
        const existsDoc = await this.personaRepo.findByDocumento(data.nroDocumento);
        if (existsDoc) throw new Error('El documento ya está registrado');

        const existsEmail = await this.personaRepo.findByEmail(data.email);
        if (existsEmail) throw new Error('El email ya está registrado');

        // Validar unicidad de legajo
        const existsLegajo = await this.repo.findByLegajo(data.nroLegajo);
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

        const alumnoData = {
            nroLegajo: data.nroLegajo,
            fechaIngreso: data.fechaIngreso,
            regularidad: data.regularidad !== undefined ? data.regularidad : true,
            cohorte: data.cohorte
        };

        const created = await this.repo.create(alumnoData, personaData);
        return AlumnoEntity.fromModel(created).toJSON();
    }

    async actualizar(id, data) {
        // Validaciones de unicidad si cambian datos clave (se podría mejorar)

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

        const alumnoData = {
            nroLegajo: data.nroLegajo,
            fechaIngreso: data.fechaIngreso,
            regularidad: data.regularidad,
            cohorte: data.cohorte
        };

        // Limpiar undefined
        Object.keys(personaData).forEach(key => personaData[key] === undefined && delete personaData[key]);
        Object.keys(alumnoData).forEach(key => alumnoData[key] === undefined && delete alumnoData[key]);

        const updated = await this.repo.update(id, alumnoData, personaData);
        return updated ? AlumnoEntity.fromModel(updated).toJSON() : null;
    }

    async eliminar(id) {
        const result = await this.repo.remove(id);
        return result > 0;
    }
}
