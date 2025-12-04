import { AlumnoEntity } from '../../entities/alumno.entity.js';

describe('AlumnoEntity', () => {
  const mockAlumno = {
    nroLegajo: '7185',
    apellido: 'Almeira',
    nombre: 'Branko',
    // facultad: 'UTN San Rafael', // Removed as it is not in the entity definition
    fechaIngreso: '2023-01-01',
    regularidad: true,
    cohorte: 2023
  };

  test('se crea correctamente desde el constructor', () => {
    const alumno = new AlumnoEntity(mockAlumno);

    expect(alumno.nroLegajo).toBe('7185');
    expect(alumno.apellido).toBe('Almeira');
    expect(alumno.nombre).toBe('Branko');
    // expect(alumno.facultad).toBe('UTN San Rafael');
  });

  test('devuelve el nombre completo', () => {
    const alumno = new AlumnoEntity(mockAlumno);

    expect(alumno.getNombreCompleto()).toBe('Almeira, Branko');
  });
});
