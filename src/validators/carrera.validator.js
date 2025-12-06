import Joi from 'joi';

export const crearCarreraSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    codigo: Joi.string().min(1).max(20).required(),
    duracionAnios: Joi.number().integer().min(1).max(10).required(),
    titulo: Joi.string().min(3).max(100).required(),
    nivel: Joi.string().valid('grado', 'pregrado', 'posgrado').required(),
    estado: Joi.string().valid('activa', 'inactiva').default('activa'),
    facultadId: Joi.number().integer().required()
});

export const actualizarCarreraSchema = Joi.object({
    nombre: Joi.string().min(3).max(100),
    codigo: Joi.string().min(1).max(20),
    duracionAnios: Joi.number().integer().min(1).max(10),
    titulo: Joi.string().min(3).max(100),
    nivel: Joi.string().valid('grado', 'pregrado', 'posgrado'),
    estado: Joi.string().valid('activa', 'inactiva'),
    facultadId: Joi.number().integer()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
