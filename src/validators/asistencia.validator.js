import Joi from 'joi';

export const registrarAsistenciaSchema = Joi.object({
    presente: Joi.boolean().default(false),
    justificada: Joi.boolean().default(false),
    observaciones: Joi.string().optional(),
    claseId: Joi.number().integer().required(),
    alumnoId: Joi.number().integer().required()
});

export const actualizarAsistenciaSchema = Joi.object({
    presente: Joi.boolean(),
    justificada: Joi.boolean(),
    observaciones: Joi.string(),
    claseId: Joi.number().integer(),
    alumnoId: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
