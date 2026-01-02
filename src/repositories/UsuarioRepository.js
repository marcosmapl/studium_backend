const BaseRepository = require("./BaseRepository");

class PrismaUsuarioRepository extends BaseRepository {

    constructor() {
        super("usuario", "UsuarioRepository.js", {
            defaultOrderBy: "nome",
            orderDirection: "asc"
        });
    }

    /**
     * Busca usuário por username
     * @param {string} username - Username do usuário
     * @returns {Promise<object|null>} Usuário encontrado ou null
     */
    async findByUsername(username) {
        return await this.findByUniqueField("username", username);
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
     * Busca usuários por nome (busca parcial)
     * @param {string} nome - Nome para buscar
     * @returns {Promise<Array>} Lista de usuários
     */
    async findByNome(nome) {
        return await this.findMany({
            nome: {
                contains: nome,
            },
        });
    }
}

module.exports = new PrismaUsuarioRepository();
