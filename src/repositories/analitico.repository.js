export class AnaliticoRepository {
    async fetchAnaliticoData(alumnoId) {
      // TODO: Reemplazar por consultas reales con Sequelize
      if (!alumnoId) return null;
  
      // Simulación de datos
      const alumno = { id: alumnoId, nombre: 'Juan Pérez', dni: '30.123.456', legajo: 'UTN-2025-001', carrera: 'Ingeniería en Sistemas' };
      const materias = [
        { codigo: 'MAT101', nombre: 'Álgebra', fecha: '2025-03-20', nota: 8, estado: 'Aprobada' },
        { codigo: 'PROG1', nombre: 'Programación I', fecha: '2025-07-10', nota: 9, estado: 'Aprobada' },
        { codigo: 'FIS101', nombre: 'Física I', fecha: '2025-07-25', nota: 6, estado: 'Aprobada' },
        { codigo: 'COMDAT', nombre: 'Comunicaciones de Datos', fecha: '2025-08-12', nota: null, estado: 'En curso' },
      ];
  
      return { alumno, materias };
    }
  }