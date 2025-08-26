export class FacultadEntity {
    constructor({ id, nombre }) {
      this.id = id;
      this.nombre = nombre;
    }
  
    // Fábrica desde modelo Sequelize (o cualquier objeto con las props necesarias)
    static fromModel(modelInstance) {
      const { id, nombre } = modelInstance;
      return new FacultadEntity({ id, nombre });
    }
  
    // Serialización para respuesta JSON
    toJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
      };
    }
  }