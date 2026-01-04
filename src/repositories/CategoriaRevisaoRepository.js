const BaseRepository = require("./BaseRepository");

class PrismaCategoriaRevisaoRepository extends BaseRepository {

    constructor() {
        super("categoriaRevisao", "CategoriaRevisaoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                revisoes: true,
            }
        });
    }

    /**
     * Busca categoria de revisão por descrição
     * @param {string} descricao - Descrição da categoria de revisão
     * @returns {Promise<object|null>} Categoria encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca categorias de revisão por descrição (busca parcial)
     * @param {string} descricao - Descrição da categoria de revisão
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

module.exports = new PrismaCategoriaRevisaoRepository();
