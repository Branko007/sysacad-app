import Joi from 'joi';
import { crearPersonaSchema, actualizarPersonaSchema } from './persona.validator.js';

// Extender el esquema de persona
export const crearUsuarioSchema = crearPersonaSchema.keys({
  nombreUsuario: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).required(),
  rol: Joi.string().valid('admin', 'profesor', 'alumno').required()
});

export const actualizarUsuarioSchema = actualizarPersonaSchema.keys({
  nombreUsuario: Joi.string().min(3).max(50),
  password: Joi.string().min(8),
  rol: Joi.string().valid('admin', 'profesor', 'alumno')
}).min(1);

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
    req.body = value;
    next();
  };
}
