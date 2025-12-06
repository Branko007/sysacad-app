import Joi from 'joi';

export const crearPlanSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    codigo: Joi.string().min(1).max(20).required(),
    fechaInicio: Joi.date().required(),
    fechaFin: Joi.date().greater(Joi.ref('fechaInicio')).required(),
    resolucion: Joi.string().optional(),
    activo: Joi.boolean().default(true),
    carreraId: Joi.number().integer().required()
});

export const actualizarPlanSchema = Joi.object({
    nombre: Joi.string().min(3).max(100),
    codigo: Joi.string().min(1).max(20),
    fechaInicio: Joi.date(),
    fechaFin: Joi.date(),
    resolucion: Joi.string(),
    activo: Joi.boolean(),
    carreraId: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
