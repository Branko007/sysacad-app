import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearMateriaSchema, actualizarMateriaSchema } from '../validators/materia.validator.js';
import {
    listarMaterias, obtenerMateria, crearMateria, actualizarMateria, eliminarMateria
} from '../controllers/materia.controller.js';

const router = Router();

// Protegemos todas las rutas con autenticación
router.use(authenticateToken);

router.get('/', asyncHandler(listarMaterias));
router.get('/:id', asyncHandler(obtenerMateria));
router.post('/', validate(crearMateriaSchema), asyncHandler(crearMateria));
router.put('/:id', validate(actualizarMateriaSchema), asyncHandler(actualizarMateria));
router.delete('/:id', asyncHandler(eliminarMateria));

export default router;
