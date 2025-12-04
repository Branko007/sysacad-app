import { PersonaService } from '../services/persona.service.js';

const service = new PersonaService();

export const listarPersonas = async (req, res) => {
    const data = await service.listar();
    res.json(data);
};

export const obtenerPersona = async (req, res) => {
    const data = await service.obtener(Number(req.params.id));
    if (!data) return res.status(404).json({ error: 'Persona no encontrada' });
    res.json(data);
};

export const crearPersona = async (req, res) => {
    try {
        const data = await service.crear(req.body);
        res.status(201).json(data);
    } catch (error) {
        if (error.message.includes('registrado')) {
            return res.status(400).json({ error: error.message });
        }
        throw error;
    }
};

export const actualizarPersona = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Persona no encontrada' });
        res.json(data);
    } catch (error) {
        if (error.message.includes('registrado')) {
            return res.status(400).json({ error: error.message });
        }
        throw error;
    }
};

export const eliminarPersona = async (req, res) => {
    await service.eliminar(Number(req.params.id));
    res.status(204).send();
};
