import { InscripcionService } from '../services/inscripcion.service.js';

const service = new InscripcionService();

export const inscribir = async (req, res) => {
    try {
        const data = await service.inscribir(req.body);
        res.status(201).json(data);
    } catch (error) {
        if (error.message.includes('no encontrado') || error.message.includes('ya está inscripto')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const listarPorAlumno = async (req, res) => {
    try {
        const data = await service.listarPorAlumno(Number(req.params.id));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelarInscripcion = async (req, res) => {
    const success = await service.cancelar(Number(req.params.id));
    if (!success) return res.status(404).json({ error: 'Inscripción no encontrada' });
    res.status(204).send();
};
