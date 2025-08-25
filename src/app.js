import express from 'express';
import morgan from 'morgan';

const app = express();

// Middlewares
app.use(express.json()); // Soporte para JSON en body
app.use(morgan('dev')); // Logging de peticiones

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Sistema Académico en funcionamiento');
});


import sequelize from './config/db.js';
import { QueryTypes } from 'sequelize';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos OK');

    const users = await sequelize.query('SELECT * FROM "usuarios";', {
      type: QueryTypes.SELECT,
    });
    console.log('📋 Usuarios en la tabla:');
    console.log(users);
  } catch (err) {
    console.error('❌ Error al conectar o consultar la DB:', err.message);
  }
})();

export default app;


