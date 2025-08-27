export class AlumnoEntity {
    constructor({ legajo, apellido, nombre, facultad }) {
      this.legajo = legajo;
      this.apellido = apellido;
      this.nombre = nombre;
      this.facultad = facultad;
    }
  
    // Ejemplo de comportamiento propio de la entidad
    getNombreCompleto() {
      return `${this.apellido}, ${this.nombre}`;
    }
  }
  