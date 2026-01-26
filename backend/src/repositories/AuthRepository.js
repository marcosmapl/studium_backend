const prisma = require("../orm/prismaClient");

class AuthRepository {
    /**
     * Busca usuário por nome de usuário para autenticação
     * @param {string} username - Nome de usuário
     * @returns {Promise<object|null>} Usuário encontrado ou null
     */
    async findByUsername(username) {
        return await prisma.usuario.findUnique({
            where: { username },
        });
    }

    /**
     * Atualiza data do último acesso
     * @param {number} id - ID do usuário
     * @returns {Promise<object>} Usuário atualizado
     */
    async updateLastAccess(id) {
        return await prisma.usuario.update({
            where: { id },
            data: {
                ultimoAcesso: new Date(),
            },
        });
    }

    /**
     * Busca usuário por ID
     * @param {number} id - ID do usuário
     * @returns {Promise<object|null>} Usuário encontrado ou null
     */
    async findById(id) {
        return await prisma.usuario.findUnique({
            where: { id },
            include: {
                grupoUsuario: {
                    select: {
                        id: true,
                        descricao: true,
                    },
                },
            },
        });
    }
}

module.exports = new AuthRepository();
