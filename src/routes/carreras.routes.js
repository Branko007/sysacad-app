import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearCarreraSchema, actualizarCarreraSchema } from '../validators/carrera.validator.js';
import {
    listarCarreras, obtenerCarrera, crearCarrera, actualizarCarrera, eliminarCarrera
} from '../controllers/carrera.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarCarreras));
router.get('/:id', asyncHandler(obtenerCarrera));
router.post('/', validate(crearCarreraSchema), asyncHandler(crearCarrera));
router.put('/:id', validate(actualizarCarreraSchema), asyncHandler(actualizarCarrera));
router.delete('/:id', asyncHandler(eliminarCarrera));

export default router;
