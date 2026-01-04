require('dotenv').config();
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    connectionLimit: 5, // Connection pooling is handled by the driver
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
