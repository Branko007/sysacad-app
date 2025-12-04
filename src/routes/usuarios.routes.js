// src/routes/usuarios.routes.js
import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
    listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario
} from '../controllers/usuario.controller.js';
import { validate, crearUsuarioSchema, actualizarUsuarioSchema } from '../validators/usuario.validator.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarUsuarios));
router.get('/:id', asyncHandler(obtenerUsuario));
router.post('/', validate(crearUsuarioSchema), asyncHandler(crearUsuario));
router.put('/:id', validate(actualizarUsuarioSchema), asyncHandler(actualizarUsuario));
router.delete('/:id', asyncHandler(eliminarUsuario));

export default router;
