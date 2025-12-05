import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import usuariosRouter from './routes/usuarios.routes.js';
import analiticosRouter from './routes/analiticos.routes.js';
import personasRouter from './routes/personas.routes.js';
import alumnosRouter from './routes/alumnos.routes.js';
import authRouter from './routes/auth.routes.js';
import profesoresRouter from './routes/profesores.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/personas', personasRouter);
app.use('/api/alumnos', alumnosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/profesores', profesoresRouter);
app.use('/api/analiticos', analiticosRouter);

app.get('/', (_req, res) => res.send('Sistema Académico en funcionamiento'));

// Manejo básico de errores
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
