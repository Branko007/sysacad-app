import Joi from 'joi';

export const crearFacultadSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required()
});

export const actualizarFacultadSchema = Joi.object({
  nombre: Joi.string().min(3).max(100)
}).min(1);

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
    req.body = value;
    next();
  };
}