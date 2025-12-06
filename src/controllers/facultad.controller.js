import { FacultadService } from '../services/facultad.service.js';

const service = new FacultadService();

export const listarFacultades = async (req, res) => {
  const data = await service.listar();
  res.json(data);
};

export const obtenerFacultad = async (req, res) => {
  const data = await service.obtener(Number(req.params.id));
  if (!data) return res.status(404).json({ error: 'Facultad no encontrada' });
  res.json(data);
};

export const crearFacultad = async (req, res) => {
  try {
    const data = await service.crear(req.body);
    res.status(201).json(data);
  } catch (error) {
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({ error: error.message });
    }
    throw error;
  }
};

export const actualizarFacultad = async (req, res) => {
  try {
    const data = await service.actualizar(Number(req.params.id), req.body);
    if (!data) return res.status(404).json({ error: 'Facultad no encontrada' });
    res.json(data);
  } catch (error) {
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({ error: error.message });
    }
    throw error;
  }
};

export const eliminarFacultad = async (req, res) => {
  const success = await service.eliminar(Number(req.params.id));
  if (!success) return res.status(404).json({ error: 'Facultad no encontrada' });
  res.status(204).send();
};