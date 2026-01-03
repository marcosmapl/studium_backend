const BaseRepository = require("./BaseRepository");

class PrismaCategoriaSessaoRepository extends BaseRepository {

    constructor() {
        super("categoriaSessao", "CategoriaSessaoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                sessoesEstudo: true,
            }
        });
    }

    /**
     * Busca categoria de sessão por descrição
     * @param {string} descricao - Descrição da categoria de sessão
     * @returns {Promise<object|null>} Categoria encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca categorias de sessão por descrição (busca parcial)
     * @param {string} descricao - Descrição da categoria de sessão
     * @returns {Promise<Array>} Lista de categorias
     */
    async findManyByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
    }

}

module.exports = new PrismaCategoriaSessaoRepository();
