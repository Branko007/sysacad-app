export class MateriaEntity {
    constructor({ id, nombre, especialidadId, planId, anio }) {
      this.id = id;
      this.nombre = nombre;
      this.especialidadId = especialidadId;
      this.planId = planId;
      this.anio = anio;
    }
  
    // Fábrica desde modelo (Sequelize u objeto con mismas props)
    static fromModel(modelInstance) {
      const { id, nombre, especialidadId, planId, anio } = modelInstance;
      return new MateriaEntity({ id, nombre, especialidadId, planId, anio });
    }
  
    // Serialización para respuesta JSON
    toJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
        especialidadId: this.especialidadId,
        planId: this.planId,
        anio: this.anio,
      };
    }
  }
  