import { ClaseService } from '../services/clase.service.js';

const service = new ClaseService();

export const listarClases = async (req, res) => {
    try {
        const data = await service.listar();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerClase = async (req, res) => {
    try {
        const data = await service.obtener(Number(req.params.id));
        if (!data) return res.status(404).json({ error: 'Clase no encontrada' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearClase = async (req, res) => {
    try {
        const data = await service.crear(req.body);
        res.status(201).json(data);
    } catch (error) {
        if (error.message.includes('Materia') || error.message.includes('hora')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const actualizarClase = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Clase no encontrada' });
        res.json(data);
    } catch (error) {
        if (error.message.includes('Materia') || error.message.includes('hora')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const eliminarClase = async (req, res) => {
    try {
        const success = await service.eliminar(Number(req.params.id));
        if (!success) return res.status(404).json({ error: 'Clase no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
