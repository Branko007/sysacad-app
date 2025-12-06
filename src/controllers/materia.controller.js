import { MateriaService } from '../services/materia.service.js';

const service = new MateriaService();

export const listarMaterias = async (req, res) => {
    const data = await service.listar();
    res.json(data);
};

export const obtenerMateria = async (req, res) => {
    const data = await service.obtener(Number(req.params.id));
    if (!data) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(data);
};

export const crearMateria = async (req, res) => {
    try {
        const data = await service.crear(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarMateria = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Materia no encontrada' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarMateria = async (req, res) => {
    const success = await service.eliminar(Number(req.params.id));
    if (!success) return res.status(404).json({ error: 'Materia no encontrada' });
    res.status(204).send();
};
