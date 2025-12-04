// src/entities/usuario.entity.js
export class UsuarioEntity {
    constructor({ id, nombre, email, rol }) {
      this.id = id;
      this.nombre = nombre;
      this.email = email;
      this.rol = rol;
    }
  
    // Fábrica desde modelo Sequelize
    static fromModel(modelInstance) {
      const { id, nombre, email, rol } = modelInstance;
      return new UsuarioEntity({ id, nombre, email, rol });
    }
  
    // Serialización para respuesta
    toJSON() {
      return { id: this.id, nombre: this.nombre, email: this.email, rol: this.rol };
    }
  }
  