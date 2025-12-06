import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearClaseSchema, actualizarClaseSchema } from '../validators/clase.validator.js';
import {
    listarClases, obtenerClase, crearClase, actualizarClase, eliminarClase
} from '../controllers/clase.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarClases));
router.get('/:id', asyncHandler(obtenerClase));
router.post('/', validate(crearClaseSchema), asyncHandler(crearClase));
router.put('/:id', validate(actualizarClaseSchema), asyncHandler(actualizarClase));
router.delete('/:id', asyncHandler(eliminarClase));

export default router;
