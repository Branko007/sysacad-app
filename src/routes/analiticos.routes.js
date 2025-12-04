// src/routes/analiticos.routes.js
import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { generarAnaliticoPDF } from '../controllers/analitico.controller.js';

const router = Router();

// Opción “bonita” con sufijo .pdf (GET /api/analiticos/123.pdf)
router.get('/:alumnoId.pdf', asyncHandler(generarAnaliticoPDF));

// Alternativa simple (GET /api/analiticos/123?format=pdf)
// router.get('/:alumnoId', asyncHandler(generarAnaliticoPDF));

export default router;
