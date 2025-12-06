import { AsistenciaService } from '../services/asistencia.service.js';

const service = new AsistenciaService();

export const listarAsistencias = async (req, res) => {
    try {
        if (req.query.claseId) {
            const data = await service.listarPorClase(Number(req.query.claseId));
            return res.json(data);
        }
        const data = await service.listar();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAsistencia = async (req, res) => {
    try {
        const data = await service.obtener(Number(req.params.id));
        if (!data) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registrarAsistencia = async (req, res) => {
    try {
        const data = await service.registrar(req.body);
        res.status(201).json(data);
    } catch (error) {
        if (error.message.includes('no encontrado') || error.message.includes('no encontrada') || error.message.includes('ya tiene asistencia')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const actualizarAsistencia = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarAsistencia = async (req, res) => {
    try {
        const success = await service.eliminar(Number(req.params.id));
        if (!success) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
