import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import gestionRoutes from './routes/gestion.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/gestion', gestionRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Gestion Service' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Gestion Service',
        endpoints: {
            health: '/health',
            cargos: '/api/gestion/cargos',
            categorias: '/api/gestion/categorias',
            dedicaciones: '/api/gestion/dedicaciones',
            grupos: '/api/gestion/grupos'
        }
    });
});

const startServer = async () => {
    try {
        await sequelize.sync({ force: false }); // Set force: true to drop tables on restart
        console.log('Database connected and synced');
        app.listen(port, () => {
            console.log(`Gestion Service running on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
