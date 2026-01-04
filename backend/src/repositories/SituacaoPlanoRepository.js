const BaseRepository = require("./BaseRepository");

class PrismaSituacaoPlanoRepository extends BaseRepository {

    constructor() {
        super("situacaoPlano", "SituacaoPlanoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                planosEstudo: true,
            }
        });
    }

    /**
     * Busca situação do plano de estudo por descrição
     * @param {string} descricao - Descrição da situação do plano de estudo (Ativo, Arquivado, Concluído, Rascunho)
     * @returns {Promise<object|null>} Situação encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca situações do plano de estudo por descrição (busca parcial)
     * @param {string} descricao - Descrição da situação do plano de estudo (Ativo, Arquivado, Concluído, Rascunho)
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

module.exports = new PrismaSituacaoPlanoRepository();
