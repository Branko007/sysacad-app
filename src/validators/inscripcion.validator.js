import Joi from 'joi';

export const inscribirSchema = Joi.object({
    alumnoId: Joi.number().integer().required(),
    materiaId: Joi.number().integer().required(),
    cicloLectivo: Joi.number().integer().required(),
    periodo: Joi.string().optional(),
    observaciones: Joi.string().optional()
});

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
