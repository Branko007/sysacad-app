import { UsuarioService } from '../services/usuario.service.js';

const service = new UsuarioService();

export const listarUsuarios = async (req, res) => {
  console.log('Controller: listarUsuarios called');
  console.log('Controller: service instance:', service);
  try {
    const data = await service.listar();
    console.log('Controller: listarUsuarios data:', data);
    res.json(data);
  } catch (error) {
    console.log('Controller: listarUsuarios error (LOG):', error);
    console.error('Controller: listarUsuarios error:', error);
    throw error;
  }
};

export const obtenerUsuario = async (req, res) => {
  const data = await service.obtener(Number(req.params.id));
  if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(data);
};

export const crearUsuario = async (req, res) => {
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

export const actualizarUsuario = async (req, res) => {
  try {
    const data = await service.actualizar(Number(req.params.id), req.body);
    if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(data);
  } catch (error) {
    if (error.message.includes('registrado')) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }
};

export const eliminarUsuario = async (req, res) => {
  await service.eliminar(Number(req.params.id));
  res.status(204).send();
};
