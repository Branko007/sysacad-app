import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, registrarAsistenciaSchema, actualizarAsistenciaSchema } from '../validators/asistencia.validator.js';
import {
    listarAsistencias, obtenerAsistencia, registrarAsistencia, actualizarAsistencia, eliminarAsistencia
} from '../controllers/asistencia.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarAsistencias));
router.get('/:id', asyncHandler(obtenerAsistencia));
router.post('/', validate(registrarAsistenciaSchema), asyncHandler(registrarAsistencia));
router.put('/:id', validate(actualizarAsistenciaSchema), asyncHandler(actualizarAsistencia));
router.delete('/:id', asyncHandler(eliminarAsistencia));

export default router;
