const BaseRepository = require("./BaseRepository");

class PrismaUsuarioRepository extends BaseRepository {

    constructor() {
        super("usuario", "UsuarioRepository.js", {
            defaultOrderBy: "nomeFuncionario",
            orderDirection: "asc"
        });
    }

    /**
     * Busca usuário por nome de usuário
     * @param {string} nomeUsuario - Nome de usuário
     * @returns {Promise<object|null>} Usuário encontrado ou null
     */
    async findByNomeUsuario(nomeUsuario) {
        return await this.findByUniqueField("nomeUsuario", nomeUsuario);
    }

    /**
     * Busca usuário por email
     * @param {string} email - Email do usuário
     * @returns {Promise<object|null>} Usuário encontrado ou null
     */
    async findByEmail(email) {
        return await this.findByUniqueField("email", email);
    }

    /**
     * Busca usuários por nome de funcionário (busca parcial)
     * @param {string} nomeFuncionario - Nome para buscar
     * @returns {Promise<Array>} Lista de usuários
     */
    async findByNomeFuncionario(nomeFuncionario) {
        return await this.findMany({
            nomeFuncionario: {
                contains: nomeFuncionario,
            },
        });
    }

    /**
     * Atualiza tentativas de login
     * @param {number} id - ID do usuário
     * @param {number} tentativasRestantes - Número de tentativas restantes
     * @returns {Promise<object>} Usuário atualizado
     */
    async updateLoginAttempts(id, tentativasRestantes) {
        return await this.update(id, { tentativasRestantes });
    }

    /**
     * Atualiza data do último acesso e reseta tentativas
     * @param {number} id - ID do usuário
     * @returns {Promise<object>} Usuário atualizado
     */
    async updateUltimoAcesso(id) {
        return await this.update(id, {
            dataUltimoAcesso: new Date(),
            tentativasRestantes: 5,
        });
    }
}

module.exports = new PrismaUsuarioRepository();
