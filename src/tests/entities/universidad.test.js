// src/tests/entities/universidad.entity.test.js
import { UniversidadEntity } from '../../entities/universidad.entity.js';

describe('UniversidadEntity', () => {
  const mockUniversidad = { id: 100, nombre: 'Universidad Nacional de Cuyo' };

  test('debe crearse correctamente desde el constructor', () => {
    const uni = new UniversidadEntity(mockUniversidad);

    expect(uni.id).toBe(100);
    expect(uni.nombre).toBe('Universidad Nacional de Cuyo');
  });

  test('debe serializar correctamente a JSON', () => {
    const uni = new UniversidadEntity(mockUniversidad);

    expect(uni.toJSON()).toEqual({
      id: 100,
      nombre: 'Universidad Nacional de Cuyo',
    });
  });

  test('debe crearse desde un modelo Sequelize simulado con fromModel()', () => {
    const modelInstance = { id: 200, nombre: 'Universidad Tecnológica Nacional' };
    const uni = UniversidadEntity.fromModel(modelInstance);

    expect(uni).toBeInstanceOf(UniversidadEntity);
    expect(uni.id).toBe(200);
    expect(uni.nombre).toBe('Universidad Tecnológica Nacional');
  });
});
