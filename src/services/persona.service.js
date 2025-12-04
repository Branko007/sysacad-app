import { PersonaRepository } from '../repositories/persona.repository.js';
import { PersonaEntity } from '../entities/persona.entity.js';

export class PersonaService {
    constructor(repo = new PersonaRepository()) {
        this.repo = repo;
    }

    async listar() {
        const rows = await this.repo.findAll();
        return rows.map(PersonaEntity.fromModel).map(p => p.toJSON());
    }

    async obtener(id) {
        const row = await this.repo.findById(id);
        return row ? PersonaEntity.fromModel(row).toJSON() : null;
    }

    async crear(data) {
        const existsDoc = await this.repo.findByDocumento(data.nroDocumento);
        if (existsDoc) throw new Error('El documento ya está registrado');

        const existsEmail = await this.repo.findByEmail(data.email);
        if (existsEmail) throw new Error('El email ya está registrado');

        const created = await this.repo.create(data);
        return PersonaEntity.fromModel(created).toJSON();
    }

    async actualizar(id, data) {
        // Check if email or document is being changed and if it conflicts
        if (data.nroDocumento) {
            const existsDoc = await this.repo.findByDocumento(data.nroDocumento);
            if (existsDoc && existsDoc.id !== id) throw new Error('El documento ya está registrado por otra persona');
        }
        if (data.email) {
            const existsEmail = await this.repo.findByEmail(data.email);
            if (existsEmail && existsEmail.id !== id) throw new Error('El email ya está registrado por otra persona');
        }

        const updated = await this.repo.update(id, data);
        return updated ? PersonaEntity.fromModel(updated).toJSON() : null;
    }

    async eliminar(id) {
        await this.repo.remove(id);
        return true;
    }
}
