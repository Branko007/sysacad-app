// src/validators/usuario.validator.js
import Joi from 'joi';

export const crearUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  rol: Joi.string().valid('admin', 'profesor', 'alumno').required(),
});

export const actualizarUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(80),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  rol: Joi.string().valid('admin', 'profesor', 'alumno'),
}).min(1);

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
    req.body = value;
    next();
  };
}
