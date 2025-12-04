import Joi from 'joi';
import { crearPersonaSchema, actualizarPersonaSchema } from './persona.validator.js';

// Extender el esquema de persona
export const crearAlumnoSchema = crearPersonaSchema.keys({
    nroLegajo: Joi.number().integer().required(),
    fechaIngreso: Joi.date().iso().required(),
    regularidad: Joi.boolean().default(true),
    cohorte: Joi.number().integer().required()
});

export const actualizarAlumnoSchema = actualizarPersonaSchema.keys({
    nroLegajo: Joi.number().integer(),
    fechaIngreso: Joi.date().iso(),
    regularidad: Joi.boolean(),
    cohorte: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
