import Joi from 'joi';
import { crearPersonaSchema, actualizarPersonaSchema } from './persona.validator.js';

// Extender el esquema de persona
export const crearProfesorSchema = crearPersonaSchema.keys({
    legajo: Joi.number().integer().required(),
    fechaIngreso: Joi.date().iso().required(),
    especialidad: Joi.string().allow(null, ''),
    antigüedad: Joi.number().integer().allow(null)
});

export const actualizarProfesorSchema = actualizarPersonaSchema.keys({
    legajo: Joi.number().integer(),
    fechaIngreso: Joi.date().iso(),
    especialidad: Joi.string().allow(null, ''),
    antigüedad: Joi.number().integer().allow(null)
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
