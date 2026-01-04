const BaseRepository = require("./BaseRepository");

class PrismaSituacaoTopicoRepository extends BaseRepository {

    constructor() {
        super("situacaoTopico", "SituacaoTopicoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                topicos: true,
            }
        });
    }

    /**
     * Busca situação do tópico por descrição
     * @param {string} descricao - Descrição da situação do tópico
     * @returns {Promise<object|null>} Situação encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca situações do tópico por descrição (busca parcial)
     * @param {string} descricao - Descrição da situação do tópico
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

module.exports = new PrismaSituacaoTopicoRepository();
