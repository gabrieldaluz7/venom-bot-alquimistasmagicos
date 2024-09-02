const mysql = require('mysql2/promise');
require('dotenv').config(); // Para usar variáveis de ambiente

let pool;

const createPool = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'alquimistasmagicos_bot_whats',
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10, // Padrão para 10 conexões
            waitForConnections: true,
            queueLimit: 0, // Ilimitado por padrão
        });
    }
    return pool;
};

module.exports = createPool;