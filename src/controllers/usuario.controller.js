import { UsuarioService } from '../services/usuario.service.js';

const service = new UsuarioService();

export const listarUsuarios = async (req, res) => {
  const data = await service.listar();
  res.json(data);
};

export const obtenerUsuario = async (req, res) => {
  const data = await service.obtener(Number(req.params.id));
  if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(data);
};

export const crearUsuario = async (req, res) => {
  const data = await service.crear(req.body);
  res.status(201).json(data);
};

export const actualizarUsuario = async (req, res) => {
  const data = await service.actualizar(Number(req.params.id), req.body);
  if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(data);
};

export const eliminarUsuario = async (req, res) => {
  await service.eliminar(Number(req.params.id));
  res.status(204).send();
};
