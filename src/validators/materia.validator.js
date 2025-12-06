import Joi from 'joi';

export const crearMateriaSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    anio: Joi.number().integer().min(1).max(6).required(),
    planId: Joi.number().integer().required(),
    especialidadId: Joi.number().integer().required()
});

export const actualizarMateriaSchema = Joi.object({
    nombre: Joi.string().min(3).max(100),
    anio: Joi.number().integer().min(1).max(6),
    planId: Joi.number().integer(),
    especialidadId: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
