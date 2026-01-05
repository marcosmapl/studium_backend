require('dotenv').config();
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');

// Singleton pattern para evitar múltiplas instâncias
let prismaInstance = null;

function getPrismaClient() {
    if (!prismaInstance) {
        const adapter = new PrismaMariaDb({
            host: process.env.DATABASE_HOST || 'localhost',
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port: parseInt(process.env.DATABASE_PORT) || 3306,
            connectionLimit: 10, // Increased pool size for tests
        });

        prismaInstance = new PrismaClient({
            adapter,
            log: process.env.NODE_ENV === 'test' ? [] : ['error', 'warn'],
        });
    }
    return prismaInstance;
}

module.exports = getPrismaClient();
