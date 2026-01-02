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

const prismaBase = new PrismaClient({ adapter });

/**
 * Converte BigInt para Number recursivamente
 */
function convertBigIntToNumber(obj) {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'bigint') {
        return Number(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToNumber(item));
    }
    
    if (obj instanceof Date) {
        return obj;
    }
    
    if (typeof obj === 'object') {
        const converted = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                converted[key] = convertBigIntToNumber(obj[key]);
            }
        }
        return converted;
    }
    
    return obj;
}

// Estender o Prisma Client para converter BigInt automaticamente
const prisma = prismaBase.$extends({
    name: 'bigIntToNumber',
    query: {
        $allModels: {
            async $allOperations({ operation, model, args, query }) {
                const result = await query(args);
                return convertBigIntToNumber(result);
            },
        },
    },
});

// Adicionar métodos do prismaBase ao prisma estendido para manter compatibilidade
prisma.$disconnect = prismaBase.$disconnect.bind(prismaBase);
prisma.$connect = prismaBase.$connect.bind(prismaBase);

module.exports = prisma;
