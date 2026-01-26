const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaSessaoEstudoRepository extends BaseRepository {

    constructor() {
        super("sessaoEstudo", "SessaoEstudoRepository.js", {
            defaultOrderBy: "dataInicio",
            orderDirection: "desc",
            includeRelations: {
                planoEstudo: true,
                disciplina: true,
                topico: true,
                blocoEstudo: true,
            }
        });
    }

    /**
     * Busca todas as sessões de estudo de um plano
     * @param {number} planoEstudoId - ID do plano de estudo
     * @returns {Promise<Array>} Lista de sessões de estudo do plano
     */
    async findManyByPlanoEstudoId(planoEstudoId) {
        return await this.findMany({
            planoEstudoId: parseInt(planoEstudoId),
        });
    }

    /**
     * Busca todas as sessões de estudo de uma disciplina
     * @param {number} disciplinaId - ID da disciplina
     * @returns {Promise<Array>} Lista de sessões de estudo da disciplina
     */
    async findManyByDisciplinaId(disciplinaId) {
        return await this.findMany({
            disciplinaId: parseInt(disciplinaId),
        });
    }

    /**
     * Busca todas as sessões de estudo de um tópico
     * @param {number} topicoId - ID do tópico
     * @returns {Promise<Array>} Lista de sessões de estudo do tópico
     */
    async findManyByTopicoId(topicoId) {
        return await this.findMany({
            topicoId: parseInt(topicoId),
        });
    }

    /**
     * Busca todas as sessões de estudo por bloco de estudo
     * @param {number} blocoEstudoId - ID do bloco de estudo
     * @returns {Promise<Array>} Lista de sessões de estudo do bloco de estudo
     */
    async findManyByBlocoEstudoId(blocoEstudoId) {
        return await this.findMany({
            blocoEstudoId: parseInt(blocoEstudoId),
        });
    }

    /**
     * Busca todas as sessões de estudo por categoria
     * @param {string} categoriaSessao - Categoria da sessão (enum)
     * @returns {Promise<Array>} Lista de sessões de estudo da categoria
     */
    async findManyByCategoriaSessao(categoriaSessao) {
        return await this.findMany({
            categoriaSessao: categoriaSessao,
        });
    }

    /**
     * Busca todas as sessões de estudo por situação
     * @param {string} situacaoSessao - Situação da sessão (enum)
     * @returns {Promise<Array>} Lista de sessões de estudo da situação
     */
    async findManyBySituacaoSessao(situacaoSessao) {
        return await this.findMany({
            situacaoSessao: situacaoSessao,
        });
    }

}

module.exports = new PrismaSessaoEstudoRepository();
