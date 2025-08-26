export class UniversidadEntity {
    constructor({ id, nombre }) {
      this.id = id;
      this.nombre = nombre;
    }
  
    // Fábrica desde modelo Sequelize u objeto plano
    static fromModel(modelInstance) {
      const { id, nombre } = modelInstance;
      return new UniversidadEntity({ id, nombre });
    }
  
    // Serialización estándar a JSON
    toJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
      };
    }
  }