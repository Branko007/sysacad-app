import { PersonaEntity } from './persona.entity.js';

export class AlumnoEntity extends PersonaEntity {
  constructor(data) {
    super(data); // Inicializa los datos de Persona
    this.alumnoId = data.alumnoId || data.id; // ID específico de la tabla alumnos si es necesario distinguir
    this.nroLegajo = data.nroLegajo;
    this.fechaIngreso = data.fechaIngreso;
    this.regularidad = data.regularidad;
    this.cohorte = data.cohorte;
  }

  static fromModel(modelInstance) {
    // Si viene de un include, los datos de persona están en modelInstance.Persona
    const personaData = modelInstance.Persona ? modelInstance.Persona.toJSON() : modelInstance;

    // Combinamos los datos
    const combinedData = {
      ...personaData,
      alumnoId: modelInstance.id,
      nroLegajo: modelInstance.nroLegajo,
      fechaIngreso: modelInstance.fechaIngreso,
      regularidad: modelInstance.regularidad,
      cohorte: modelInstance.cohorte
    };

    return new AlumnoEntity(combinedData);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      nroLegajo: this.nroLegajo,
      fechaIngreso: this.fechaIngreso,
      regularidad: this.regularidad,
      cohorte: this.cohorte
    };
  }
}