import Joi from 'joi';

export const crearClaseSchema = Joi.object({
    fecha: Joi.date().required(),
    horaInicio: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    horaFin: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    tema: Joi.string().optional(),
    modalidad: Joi.string().valid('presencial', 'virtual').default('presencial'),
    ubicacion: Joi.string().optional(),
    materiaId: Joi.number().integer().required()
});

export const actualizarClaseSchema = Joi.object({
    fecha: Joi.date(),
    horaInicio: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    horaFin: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    tema: Joi.string(),
    modalidad: Joi.string().valid('presencial', 'virtual'),
    ubicacion: Joi.string(),
    materiaId: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
