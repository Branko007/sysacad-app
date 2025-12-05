import { Router } from 'express';
import { listarProfesores, obtenerProfesor, crearProfesor, actualizarProfesor, eliminarProfesor } from '../controllers/profesor.controller.js';
import { validate, crearProfesorSchema, actualizarProfesorSchema } from '../validators/profesor.validator.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listarProfesores);
router.get('/:id', obtenerProfesor);
router.post('/', authorize(['admin']), validate(crearProfesorSchema), crearProfesor);
router.put('/:id', authorize(['admin']), validate(actualizarProfesorSchema), actualizarProfesor);
router.delete('/:id', authorize(['admin']), eliminarProfesor);

export default router;
