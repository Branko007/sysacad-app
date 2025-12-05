import { Router } from 'express';
import {
    getCargos,
    createCargo,
    getCategorias,
    createCategoria,
    getTiposDedicacion,
    createTipoDedicacion,
    getGrupos,
    createGrupo
} from '../controllers/gestion.controller.js';

const router = Router();

router.get('/cargos', getCargos);
router.post('/cargos', createCargo);

router.get('/categorias', getCategorias);
router.post('/categorias', createCategoria);

router.get('/dedicaciones', getTiposDedicacion);
router.post('/dedicaciones', createTipoDedicacion);

router.get('/grupos', getGrupos);
router.post('/grupos', createGrupo);

export default router;
