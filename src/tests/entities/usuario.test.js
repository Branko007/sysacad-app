// src/tests/entities/usuario.entity.test.js
import { UsuarioEntity } from '../../entities/usuario.entity.js';

describe('UsuarioEntity', () => {
  const mockUser = { id: 1, nombre: 'Branko', email: 'branko@utn.edu.ar', rol: 'admin' };

  test('debe crearse correctamente desde el constructor', () => {
    const usuario = new UsuarioEntity(mockUser);

    expect(usuario.id).toBe(1);
    expect(usuario.nombre).toBe('Branko');
    expect(usuario.email).toBe('branko@utn.edu.ar');
    expect(usuario.rol).toBe('admin');
  });

  test('debe serializar correctamente a JSON', () => {
    const usuario = new UsuarioEntity(mockUser);

    expect(usuario.toJSON()).toEqual({
      id: 1,
      nombre: 'Branko',
      email: 'branko@utn.edu.ar',
      rol: 'admin',
    });
  });

  test('debe crearse desde un modelo Sequelize simulado con fromModel()', () => {
    const modelInstance = { id: 2, nombre: 'Gabriel', email: 'gabriel@utn.edu.ar', rol: 'profesor' };
    const usuario = UsuarioEntity.fromModel(modelInstance);

    expect(usuario).toBeInstanceOf(UsuarioEntity);
    expect(usuario.id).toBe(2);
    expect(usuario.rol).toBe('profesor');
  });
});
