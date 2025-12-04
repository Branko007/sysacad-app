// src/tests/routes/auth.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// ⚠️ Mockear el modelo y bcrypt ANTES de importarlos en la ruta
jest.unstable_mockModule('../../models/Usuario.js', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.unstable_mockModule('bcrypt', () => ({
  __esModule: true,
  default: { compare: jest.fn() },
}));

// Importar los módulos mockeados y la ruta (con top-level await en ESM)
const { default: Usuario } = await import('../../models/Usuario.js');
const { default: bcrypt } = await import('bcrypt');
const { default: authRouter } = await import('../../routes/auth.routes.js');

describe('POST /auth/login', () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
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
    Usuario.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'noexiste@example.com', password: 'x' });

    expect(Usuario.findOne).toHaveBeenCalledWith({
      where: { email: 'noexiste@example.com' },
      attributes: ['id', 'nombre', 'email', 'password', 'rol'],
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Credenciales inválidas/i);
  });

  test('401 si la contraseña es inválida', async () => {
    Usuario.findOne.mockResolvedValue({
      id: 1, nombre: 'Branko', email: 'branko@example.com', password: 'hash', rol: 'admin',
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
    Usuario.findOne.mockResolvedValue({
      id: 1, nombre: 'Branko', email: 'branko@example.com', password: 'hash', rol: 'admin',
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
