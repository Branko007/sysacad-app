import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, inscribirSchema } from '../validators/inscripcion.validator.js';
import {
    inscribir, listarPorAlumno, cancelarInscripcion
} from '../controllers/inscripcion.controller.js';

const router = Router();

// Protegemos todas las rutas con autenticación
router.use(authenticateToken);

router.post('/', validate(inscribirSchema), asyncHandler(inscribir));
router.get('/alumno/:id', asyncHandler(listarPorAlumno));
router.delete('/:id', asyncHandler(cancelarInscripcion));

export default router;
