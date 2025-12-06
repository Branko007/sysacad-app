import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearFacultadSchema, actualizarFacultadSchema } from '../validators/facultad.validator.js';
import {
  listarFacultades, obtenerFacultad, crearFacultad, actualizarFacultad, eliminarFacultad
} from '../controllers/facultad.controller.js';

const router = Router();

// Protegemos todas las rutas con autenticación
router.use(authenticateToken);

router.get('/', asyncHandler(listarFacultades));
router.get('/:id', asyncHandler(obtenerFacultad));
router.post('/', validate(crearFacultadSchema), asyncHandler(crearFacultad));
router.put('/:id', validate(actualizarFacultadSchema), asyncHandler(actualizarFacultad));
router.delete('/:id', asyncHandler(eliminarFacultad));

export default router;