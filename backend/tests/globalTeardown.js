/**
 * Global teardown - executado após todos os testes
 */

module.exports = async () => {
    // Pequeno delay para garantir que todas as conexões sejam fechadas
    await new Promise(resolve => setTimeout(resolve, 500));

    // Forçar desconexão do Prisma
    const prisma = require('../src/orm/prismaClient');
    try {
        await prisma.$disconnect();
    } catch (error) {
        console.error('Erro ao desconectar Prisma no teardown:', error);
    }
};
