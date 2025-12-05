// src/routes/auth.routes.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { env } from '../config/env.js';



const router = Router();

router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    // Usamos el repositorio para buscar, ya que ahora el email está en Persona
    const user = await new UsuarioRepository().findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, rol: user.rol, email: user.Persona.email }, // Usar email de Persona
      env.jwt.secret,
      { expiresIn: '1h' }
    );

    // Enviar token en cookie httpOnly
    res.cookie('jwtSysacad', token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
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
