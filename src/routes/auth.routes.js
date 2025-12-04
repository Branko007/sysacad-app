// src/routes/auth.routes.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { env } from '../config/env.js';



const router = Router();

router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  // Normalizar email
  email = String(email).trim().toLowerCase();

  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({
      where: { email },
      attributes: ['id', 'nombre', 'email', 'password', 'rol'],
    });

    // No revelar si falló email o password
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Verificar contraseña hasheada
    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    console.log(`Usuario ${usuario.email} autenticado correctamente`);
    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      env.jwt.secret,
      { expiresIn: '1h', issuer: 'sysacad' }
    );

    // Enviar token en cookie httpOnly
    res.cookie('jwtSysacad', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true si servís por HTTPS en prod
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    return res.status(200).json({ mensaje: 'Login exitoso' });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('jwtSysacad', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  return res.status(200).json({ mensaje: 'Logout exitoso' });
});

export default router;
