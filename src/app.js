// src/app.js
import express from 'express';
import morgan from 'morgan';
import usuariosRouter from './routes/usuarios.routes.js';
import analiticosRouter from './routes/analiticos.routes.js';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/analiticos', analiticosRouter);

app.get('/', (_req, res) => res.send('Sistema Académico en funcionamiento'));

// Manejo básico de errores
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
