import sequelize from '../config/db.js';
import Usuario from '../models/Usuario.js';
import Persona from '../models/Persona.js';
import bcrypt from 'bcrypt';

const seedUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida.');

        // Hash para password "12345678"
        const password = await bcrypt.hash('12345678', 10);

        const users = [
            {
                nombreUsuario: 'admin',
                rol: 'admin',
                persona: {
                    nombre: 'Admin',
                    apellido: 'Sistema',
                    email: 'admin@sysacad.com',
                    nroDocumento: '11111111',
                    tipoDocumento: 'dni',
                    fechaNacimiento: '1980-01-01'
                }
            },
            {
                nombreUsuario: 'profesor',
                rol: 'profesor',
                persona: {
                    nombre: 'Juan',
                    apellido: 'Perez',
                    email: 'profesor@sysacad.com',
                    nroDocumento: '22222222',
                    tipoDocumento: 'dni',
                    fechaNacimiento: '1975-05-15'
                }
            },
            {
                nombreUsuario: 'alumno',
                rol: 'alumno',
                persona: {
                    nombre: 'Maria',
                    apellido: 'Gomez',
                    email: 'alumno@sysacad.com',
                    nroDocumento: '33333333',
                    tipoDocumento: 'dni',
                    fechaNacimiento: '2000-10-20'
                }
            }
        ];

        for (const u of users) {
            // Verificar si ya existe la persona por email
            let persona = await Persona.findOne({ where: { email: u.persona.email } });

            if (!persona) {
                persona = await Persona.create(u.persona);
                console.log(`Persona creada: ${u.persona.nombre} ${u.persona.apellido}`);
            } else {
                console.log(`Persona ya existe: ${u.persona.email}`);
            }

            // Verificar si ya existe el usuario
            const usuarioExists = await Usuario.findOne({ where: { nombreUsuario: u.nombreUsuario } });

            if (!usuarioExists) {
                await Usuario.create({
                    nombreUsuario: u.nombreUsuario,
                    password: password,
                    rol: u.rol,
                    personaId: persona.id
                });
                console.log(`Usuario creado: ${u.nombreUsuario}`);
            } else {
                console.log(`Usuario ya existe: ${u.nombreUsuario}`);
            }
        }

        console.log('Seed completado exitosamente.');
    } catch (error) {
        console.error('Error en seed:', error);
    } finally {
        await sequelize.close();
    }
};

seedUsers();
