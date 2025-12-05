// src/tests/routes/auth.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mockear el repositorio
jest.unstable_mockModule('../../repositories/usuario.repository.js', () => ({
  UsuarioRepository: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn(),
  })),
}));

jest.unstable_mockModule('bcrypt', () => ({
  __esModule: true,
  default: { compare: jest.fn() },
}));

// Importar los módulos mockeados y la ruta
const { UsuarioRepository } = await import('../../repositories/usuario.repository.js');
const { default: bcrypt } = await import('bcrypt');
const { default: authRouter } = await import('../../routes/auth.routes.js');

describe('POST /auth/login', () => {
  let app;
  let mockFindByEmail;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
  });

  beforeEach(() => {
    // Obtener la función mockeada de la instancia del repositorio
    mockFindByEmail = jest.fn();
    UsuarioRepository.mockImplementation(() => ({
      findByEmail: mockFindByEmail
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('400 si faltan email o password', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/obligatorios/i);
  });

  test('401 si el usuario no existe', async () => {
    mockFindByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'noexiste@example.com', password: 'x' });

    expect(mockFindByEmail).toHaveBeenCalledWith('noexiste@example.com');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Credenciales inválidas/i);
  });

  test('401 si la contraseña es inválida', async () => {
    mockFindByEmail.mockResolvedValue({
      id: 1,
      password: 'hash',
      rol: 'admin',
      Persona: { email: 'branko@example.com' }
    });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'branko@example.com', password: 'malapass' });

    expect(bcrypt.compare).toHaveBeenCalledWith('malapass', 'hash');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Credenciales inválidas/i);
  });

  test('200 y setea cookie cuando el login es exitoso', async () => {
    mockFindByEmail.mockResolvedValue({
      id: 1,
      password: 'hash',
      rol: 'admin',
      Persona: { email: 'branko@example.com' }
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'branko@example.com', password: 'correcta' });

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toMatch(/Login exitoso/i);

    const cookies = res.headers['set-cookie'] || [];
    expect(cookies.length).toBeGreaterThan(0);
    expect(cookies[0]).toMatch(/jwtSysacad=/);
    expect(cookies[0]).toMatch(/HttpOnly/);
  });
});
