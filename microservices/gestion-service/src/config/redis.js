import { createClient } from 'redis';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Validar y obtener configuración
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

console.log(`📦 Configurando Redis: ${redisHost}:${redisPort}`);

const redisClient = createClient({
    socket: {
        host: redisHost,
        port: redisPort
    }
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
    console.log(`✅ Redis Client Connected to ${redisHost}:${redisPort}`);
});

redisClient.on('ready', () => {
    console.log('🚀 Redis Client Ready');
});

redisClient.on('reconnecting', () => {
    console.log('🔄 Redis Client Reconnecting...');
});

try {
    await redisClient.connect();
} catch (error) {
    console.error('❌ Failed to connect to Redis:', error.message);
    console.error('⚠️  Cache will not be available. Check REDIS_HOST and REDIS_PORT in .env');
}

export default redisClient;
