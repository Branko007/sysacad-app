import Joi from 'joi';

export const crearPersonaSchema = Joi.object({
    apellido: Joi.string().min(2).max(80).required(),
    nombre: Joi.string().min(2).max(80).required(),
    nroDocumento: Joi.string().min(7).max(15).required(),
    tipoDocumento: Joi.string().valid('dni', 'libretaCivica', 'libretaEnrolamiento', 'pasaporte').required(),
    fechaNacimiento: Joi.date().iso().required(),
    genero: Joi.string().allow(null, ''),
    direccion: Joi.string().allow(null, ''),
    telefono: Joi.string().allow(null, ''),
    email: Joi.string().email().required()
});

export const actualizarPersonaSchema = Joi.object({
    apellido: Joi.string().min(2).max(80),
    nombre: Joi.string().min(2).max(80),
    nroDocumento: Joi.string().min(7).max(15),
    tipoDocumento: Joi.string().valid('dni', 'libretaCivica', 'libretaEnrolamiento', 'pasaporte'),
    fechaNacimiento: Joi.date().iso(),
    genero: Joi.string().allow(null, ''),
    direccion: Joi.string().allow(null, ''),
    telefono: Joi.string().allow(null, ''),
    email: Joi.string().email()
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) return res.status(400).json({ error: 'Validación', details: error.details.map(d => d.message) });
        req.body = value;
        next();
    };
}
