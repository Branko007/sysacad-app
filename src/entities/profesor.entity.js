import { PersonaEntity } from './persona.entity.js';

export class ProfesorEntity extends PersonaEntity {
    constructor(data) {
        super(data);
        this.profesorId = data.profesorId || data.id;
        this.legajo = data.legajo;
        this.fechaIngreso = data.fechaIngreso;
        this.especialidad = data.especialidad;
        this.antigüedad = data.antigüedad;
    }

    static fromModel(modelInstance) {
        const personaData = modelInstance.Persona ? modelInstance.Persona.toJSON() : modelInstance;

        const combinedData = {
            ...personaData,
            profesorId: modelInstance.id,
            legajo: modelInstance.legajo,
            fechaIngreso: modelInstance.fechaIngreso,
            especialidad: modelInstance.especialidad,
            antigüedad: modelInstance.antigüedad
        };

        return new ProfesorEntity(combinedData);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            legajo: this.legajo,
            fechaIngreso: this.fechaIngreso,
            especialidad: this.especialidad,
            antigüedad: this.antigüedad
        };
    }
}
