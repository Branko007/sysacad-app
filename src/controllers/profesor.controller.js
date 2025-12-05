import { ProfesorService } from '../services/profesor.service.js';

const service = new ProfesorService();

export const listarProfesores = async (req, res) => {
    const data = await service.listar();
    res.json(data);
};

export const obtenerProfesor = async (req, res) => {
    const data = await service.obtener(req.params.id);
    if (!data) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json(data);
};

export const crearProfesor = async (req, res) => {
    try {
        const data = await service.crear(req.body);
        res.status(201).json(data);
    } catch (error) {
        if (error.message.includes('ya está registrado')) {
            return res.status(409).json({ error: error.message });
        }
        throw error;
    }
};

export const actualizarProfesor = async (req, res) => {
    const data = await service.actualizar(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json(data);
};

export const eliminarProfesor = async (req, res) => {
    const result = await service.eliminar(req.params.id);
    if (!result) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.status(204).send();
};
