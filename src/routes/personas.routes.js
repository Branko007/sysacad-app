import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
    listarPersonas, obtenerPersona, crearPersona, actualizarPersona, eliminarPersona
} from '../controllers/persona.controller.js';
import { validate, crearPersonaSchema, actualizarPersonaSchema } from '../validators/persona.validator.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarPersonas));
router.get('/:id', asyncHandler(obtenerPersona));
router.post('/', validate(crearPersonaSchema), asyncHandler(crearPersona));
router.put('/:id', validate(actualizarPersonaSchema), asyncHandler(actualizarPersona));
router.delete('/:id', asyncHandler(eliminarPersona));

export default router;
