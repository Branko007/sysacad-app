import { PlanService } from '../services/plan.service.js';

const service = new PlanService();

export const listarPlanes = async (req, res) => {
    try {
        const data = await service.listar();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPlan = async (req, res) => {
    try {
        const data = await service.obtener(Number(req.params.id));
        if (!data) return res.status(404).json({ error: 'Plan no encontrado' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearPlan = async (req, res) => {
    try {
        const data = await service.crear(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarPlan = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Plan no encontrado' });
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarPlan = async (req, res) => {
    try {
        const success = await service.eliminar(Number(req.params.id));
        if (!success) return res.status(404).json({ error: 'Plan no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
