import sequelize from '../config/db.js';
import '../models/Persona.js'; // Importar el modelo para que Sequelize lo reconozca
import '../models/Alumno.js';
import '../models/Usuario.js';

const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');

        // sync({ force: true }) BORRA las tablas y las crea de nuevo. Úsalo con cuidado.
        // sync({ alter: true }) intenta modificar las tablas existentes para que coincidan con el modelo.
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    } finally {
        await sequelize.close();
    }
};

syncDB();
