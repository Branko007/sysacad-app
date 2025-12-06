import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validate, crearPlanSchema, actualizarPlanSchema } from '../validators/plan.validator.js';
import {
    listarPlanes, obtenerPlan, crearPlan, actualizarPlan, eliminarPlan
} from '../controllers/plan.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', asyncHandler(listarPlanes));
router.get('/:id', asyncHandler(obtenerPlan));
router.post('/', validate(crearPlanSchema), asyncHandler(crearPlan));
router.put('/:id', validate(actualizarPlanSchema), asyncHandler(actualizarPlan));
router.delete('/:id', asyncHandler(eliminarPlan));

export default router;
