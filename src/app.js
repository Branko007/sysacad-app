import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import usuariosRouter from './routes/usuarios.routes.js';
import analiticosRouter from './routes/analiticos.routes.js';
import personasRouter from './routes/personas.routes.js';
import alumnosRouter from './routes/alumnos.routes.js';
import authRouter from './routes/auth.routes.js';
import profesoresRouter from './routes/profesores.routes.js';
import facultadesRouter from './routes/facultades.routes.js';
import materiasRouter from './routes/materias.routes.js';
import inscripcionesRouter from './routes/inscripciones.routes.js';
import carrerasRouter from './routes/carreras.routes.js';
import planesRouter from './routes/planes.routes.js';
import evaluacionesRouter from './routes/evaluaciones.routes.js';
import calificacionesRouter from './routes/calificaciones.routes.js';

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
app.use('/api/facultades', facultadesRouter);
app.use('/api/materias', materiasRouter);
app.use('/api/inscripciones', inscripcionesRouter);
app.use('/api/carreras', carrerasRouter);
app.use('/api/planes', planesRouter);
app.use('/api/evaluaciones', evaluacionesRouter);
app.use('/api/calificaciones', calificacionesRouter);

app.get('/', (_req, res) => res.send('Sistema Académico en funcionamiento'));

// Manejo básico de errores
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
