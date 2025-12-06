import { CarreraService } from '../services/carrera.service.js';

const service = new CarreraService();

export const listarCarreras = async (req, res) => {
    try {
        const data = await service.listar();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerCarrera = async (req, res) => {
    try {
        const data = await service.obtener(Number(req.params.id));
        if (!data) return res.status(404).json({ error: 'Carrera no encontrada' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearCarrera = async (req, res) => {
    try {
        const data = await service.crear(req.body);
        res.status(201).json(data);
    } catch (error) {
        if (error.message.includes('existe') || error.message.includes('Facultad')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const actualizarCarrera = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Carrera no encontrada' });
        res.json(data);
    } catch (error) {
        if (error.message.includes('existe') || error.message.includes('Facultad')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const eliminarCarrera = async (req, res) => {
    try {
        const success = await service.eliminar(Number(req.params.id));
        if (!success) return res.status(404).json({ error: 'Carrera no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
