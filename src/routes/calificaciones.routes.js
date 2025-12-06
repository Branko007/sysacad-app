import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearCalificacionSchema, actualizarCalificacionSchema } from '../validators/calificacion.validator.js';
import {
    listarCalificaciones, obtenerCalificacion, crearCalificacion, actualizarCalificacion, eliminarCalificacion
} from '../controllers/calificacion.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarCalificaciones));
router.get('/:id', asyncHandler(obtenerCalificacion));
router.post('/', validate(crearCalificacionSchema), asyncHandler(crearCalificacion));
router.put('/:id', validate(actualizarCalificacionSchema), asyncHandler(actualizarCalificacion));
router.delete('/:id', asyncHandler(eliminarCalificacion));

export default router;
