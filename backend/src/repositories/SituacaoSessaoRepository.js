const BaseRepository = require("./BaseRepository");

class PrismaSituacaoSessaoRepository extends BaseRepository {

    constructor() {
        super("situacaoSessao", "SituacaoSessaoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                sessoesEstudo: true,
            }
        });
    }

    /**
     * Busca situação de sessão por descrição
     * @param {string} descricao - Descrição da situação de sessão
     * @returns {Promise<object|null>} Situação encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca situações de sessão por descrição (busca parcial)
     * @param {string} descricao - Descrição da situação de sessão
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

module.exports = new PrismaSituacaoSessaoRepository();
