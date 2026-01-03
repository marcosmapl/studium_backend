const BaseRepository = require("./BaseRepository");

class PrismaGeneroUsuarioRepository extends BaseRepository {

    constructor() {
        super("generoUsuario", "GeneroUsuarioRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca gênero por descrição
     * @param {string} descricao - Descrição do gênero
     * @returns {Promise<object|null>} Gênero encontrado ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca gêneros por descrição (busca parcial)
     * @param {string} descricao - Descrição do gênero para buscar
     * @returns {Promise<Array>} Lista de gêneros
     */
    async findManyByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
    }
}

module.exports = new PrismaGeneroUsuarioRepository();
