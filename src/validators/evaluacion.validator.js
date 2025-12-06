import Joi from 'joi';

export const crearEvaluacionSchema = Joi.object({
    fecha: Joi.date().required(),
    tipo: Joi.string().valid('parcial', 'final', 'recuperatorio', 'tp').required(),
    descripcion: Joi.string().max(255).required(),
    ponderacion: Joi.number().min(0).max(10).optional(),
    materiaId: Joi.number().integer().required()
});

export const actualizarEvaluacionSchema = Joi.object({
    fecha: Joi.date(),
    tipo: Joi.string().valid('parcial', 'final', 'recuperatorio', 'tp'),
    descripcion: Joi.string().max(255),
    ponderacion: Joi.number().min(0).max(10),
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
