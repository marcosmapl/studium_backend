const BaseRepository = require("./BaseRepository");

class PrismaSituacaoRevisaoRepository extends BaseRepository {

    constructor() {
        super("situacaoRevisao", "SituacaoRevisaoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                revisoes: true,
            }
        });
    }

    /**
     * Busca situação de revisão por descrição
     * @param {string} descricao - Descrição da situação de revisão
     * @returns {Promise<object|null>} Situação encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca situações de revisão por descrição (busca parcial)
     * @param {string} descricao - Descrição da situação de revisão
     * @returns {Promise<Array>} Lista de situações
     */
    async findManyByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
    }

}

module.exports = new PrismaSituacaoRevisaoRepository();
