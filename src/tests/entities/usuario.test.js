// src/tests/entities/usuario.entity.test.js
import { UsuarioEntity } from '../../entities/usuario.entity.js';

describe('UsuarioEntity', () => {
  const mockUser = {
    id: 1,
    usuarioId: 1,
    nombreUsuario: 'branko123',
    rol: 'admin',
    // Datos de Persona
    apellido: 'Almeira',
    nombre: 'Branko',
    email: 'branko@utn.edu.ar',
    nroDocumento: '12345678',
    tipoDocumento: 'dni',
    fechaNacimiento: '1990-01-01'
  };

  test('debe crearse correctamente desde el constructor', () => {
    const usuario = new UsuarioEntity(mockUser);

    expect(usuario.usuarioId).toBe(1);
    expect(usuario.nombreUsuario).toBe('branko123');
    expect(usuario.rol).toBe('admin');

    // Heredados de Persona
    expect(usuario.apellido).toBe('Almeira');
    expect(usuario.nombre).toBe('Branko');
    expect(usuario.email).toBe('branko@utn.edu.ar');
  });

  test('debe serializar correctamente a JSON', () => {
    const usuario = new UsuarioEntity(mockUser);
    const json = usuario.toJSON();

    expect(json).toMatchObject({
      id: 1,
      nombreUsuario: 'branko123',
      rol: 'admin',
      apellido: 'Almeira',
      nombre: 'Branko',
      email: 'branko@utn.edu.ar'
    });
  });

  test('debe crearse desde un modelo Sequelize simulado con fromModel()', () => {
    const modelInstance = {
      id: 2,
      nombreUsuario: 'gabriel_prof',
      rol: 'profesor',
      Persona: {
        toJSON: () => ({
          id: 10,
          apellido: 'Gabriel',
          nombre: 'Profesor',
          email: 'gabriel@utn.edu.ar'
        })
      }
    };
    const usuario = UsuarioEntity.fromModel(modelInstance);

    expect(usuario).toBeInstanceOf(UsuarioEntity);
    expect(usuario.usuarioId).toBe(2);
    expect(usuario.nombreUsuario).toBe('gabriel_prof');
    expect(usuario.email).toBe('gabriel@utn.edu.ar');
  });
});
