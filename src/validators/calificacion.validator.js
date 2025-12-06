import Joi from 'joi';

export const crearCalificacionSchema = Joi.object({
    nota: Joi.number().min(0).max(10).required(),
    fechaRegistro: Joi.date().default(Date.now),
    observaciones: Joi.string().optional(),
    estado: Joi.string().valid('aprobado', 'desaprobado', 'ausente').optional(),
    alumnoId: Joi.number().integer().required(),
    evaluacionId: Joi.number().integer().required()
});

export const actualizarCalificacionSchema = Joi.object({
    nota: Joi.number().min(0).max(10),
    fechaRegistro: Joi.date(),
    observaciones: Joi.string(),
    estado: Joi.string().valid('aprobado', 'desaprobado', 'ausente'),
    alumnoId: Joi.number().integer(),
    evaluacionId: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
