import { PersonaEntity } from './persona.entity.js';

export class UsuarioEntity extends PersonaEntity {
  constructor(data) {
    super(data);
    this.usuarioId = data.usuarioId || data.id;
    this.nombreUsuario = data.nombreUsuario;
    this.rol = data.rol;
    // Password usually not exposed in entity, but kept if needed for internal logic (careful with toJSON)
  }

  static fromModel(modelInstance) {
    const personaData = modelInstance.Persona ? modelInstance.Persona.toJSON() : modelInstance;

    const combinedData = {
      ...personaData,
      usuarioId: modelInstance.id,
      nombreUsuario: modelInstance.nombreUsuario,
      rol: modelInstance.rol
    };

    return new UsuarioEntity(combinedData);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      id: this.usuarioId, // Sobrescribimos el id de Persona con el de Usuario
      nombreUsuario: this.nombreUsuario,
      rol: this.rol
    };
  }
}