import { AlumnoService } from '../services/alumno.service.js';

const service = new AlumnoService();

export const listarAlumnos = async (req, res) => {
    const data = await service.listar();
    res.json(data);
};

export const obtenerAlumno = async (req, res) => {
    const data = await service.obtener(Number(req.params.id));
    if (!data) return res.status(404).json({ error: 'Alumno no encontrado' });
    res.json(data);
};

export const crearAlumno = async (req, res) => {
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

export const actualizarAlumno = async (req, res) => {
    try {
        const data = await service.actualizar(Number(req.params.id), req.body);
        if (!data) return res.status(404).json({ error: 'Alumno no encontrado' });
        res.json(data);
    } catch (error) {
        if (error.message.includes('registrado')) {
            return res.status(400).json({ error: error.message });
        }
        throw error;
    }
};

export const eliminarAlumno = async (req, res) => {
    await service.eliminar(Number(req.params.id));
    res.status(204).send();
};
