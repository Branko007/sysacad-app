import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearEvaluacionSchema, actualizarEvaluacionSchema } from '../validators/evaluacion.validator.js';
import {
    listarEvaluaciones, obtenerEvaluacion, crearEvaluacion, actualizarEvaluacion, eliminarEvaluacion
} from '../controllers/evaluacion.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarEvaluaciones));
router.get('/:id', asyncHandler(obtenerEvaluacion));
router.post('/', validate(crearEvaluacionSchema), asyncHandler(crearEvaluacion));
router.put('/:id', validate(actualizarEvaluacionSchema), asyncHandler(actualizarEvaluacion));
router.delete('/:id', asyncHandler(eliminarEvaluacion));

export default router;
