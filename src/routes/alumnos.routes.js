
import { Router } from 'express';
import { AlumnoEntity } from '../entities/alumno.entity.js';

const router = Router();


router.get('/alumnos/:legajo', (req, res) => {
  const { legajo } = req.params;

  // Datos hardcodeados 
  const alumnos = [
    new AlumnoEntity({ legajo: '7185', apellido: 'Almeira',  nombre: 'Branko',  facultad: 'UTN San Rafael' }),
    new AlumnoEntity({ legajo: '7662', apellido: 'Fede',  nombre: 'Sosa', facultad: 'UTN San Rafael' }),
  ];

  const alumno = alumnos.find(a => a.legajo === legajo);

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  res.json(alumno);
});

export default router;
