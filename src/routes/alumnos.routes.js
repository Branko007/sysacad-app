import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  listarAlumnos, obtenerAlumno, crearAlumno, actualizarAlumno, eliminarAlumno
} from '../controllers/alumno.controller.js';
import { validate, crearAlumnoSchema, actualizarAlumnoSchema } from '../validators/alumno.validator.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarAlumnos));
router.get('/:id', asyncHandler(obtenerAlumno));
router.post('/', validate(crearAlumnoSchema), asyncHandler(crearAlumno));
router.put('/:id', validate(actualizarAlumnoSchema), asyncHandler(actualizarAlumno));
router.delete('/:id', asyncHandler(eliminarAlumno));

export default router;
