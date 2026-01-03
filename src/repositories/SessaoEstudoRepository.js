const BaseRepository = require("./BaseRepository");

class PrismaSessaoEstudoRepository extends BaseRepository {

    constructor() {
        super("sessaoEstudo", "SessaoEstudoRepository.js", {
            defaultOrderBy: "dataInicio",
            orderDirection: "desc",
            includeRelations: {
                planoEstudo: true,
                disciplina: true,
                topico: true,
                categoriaSessao: true,
                situacaoSessao: true,
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
     * Busca todas as sessões de estudo por categoria
     * @param {number} categoriaSessaoId - ID da categoria de sessão
     * @returns {Promise<Array>} Lista de sessões de estudo da categoria
     */
    async findManyByCategoriaSessaoId(categoriaSessaoId) {
        return await this.findMany({
            categoriaSessaoId: parseInt(categoriaSessaoId),
        });
    }

    /**
     * Busca todas as sessões de estudo por situação
     * @param {number} situacaoSessaoId - ID da situação de sessão
     * @returns {Promise<Array>} Lista de sessões de estudo da situação
     */
    async findManyBySituacaoSessaoId(situacaoSessaoId) {
        return await this.findMany({
            situacaoSessaoId: parseInt(situacaoSessaoId),
        });
    }

}

module.exports = new PrismaSessaoEstudoRepository();
