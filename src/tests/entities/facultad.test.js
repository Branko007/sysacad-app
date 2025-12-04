// src/tests/entities/facultad.entity.test.js
import { FacultadEntity } from '../../entities/facultad.entity.js';

describe('FacultadEntity', () => {
  const mockFacultad = { id: 10, nombre: 'Facultad de Ingeniería' };

  test('debe crearse correctamente desde el constructor', () => {
    const facultad = new FacultadEntity(mockFacultad);

    expect(facultad.id).toBe(10);
    expect(facultad.nombre).toBe('Facultad de Ingeniería');
  });

  test('debe serializar correctamente a JSON', () => {
    const facultad = new FacultadEntity(mockFacultad);

    expect(facultad.toJSON()).toEqual({
      id: 10,
      nombre: 'Facultad de Ingeniería',
    });
  });

  test('debe crearse desde un modelo Sequelize simulado con fromModel()', () => {
    const modelInstance = { id: 20, nombre: 'Facultad de Ciencias Económicas' };
    const facultad = FacultadEntity.fromModel(modelInstance);

    expect(facultad).toBeInstanceOf(FacultadEntity);
    expect(facultad.id).toBe(20);
    expect(facultad.nombre).toBe('Facultad de Ciencias Económicas');
  });
});
