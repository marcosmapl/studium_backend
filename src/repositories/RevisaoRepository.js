const BaseRepository = require("./BaseRepository");

class PrismaRevisaoRepository extends BaseRepository {

    constructor() {
        super("revisao", "RevisaoRepository.js", {
            defaultOrderBy: "dataProgramada",
            orderDirection: "desc",
            includeRelations: {
                categoriaRevisao: true,
                situacaoRevisao: true,
                planoEstudo: true,
                disciplina: true,
                topico: true,
            }
        });
    }

    /**
     * Busca todas as revisões por categoria
     * @param {number} categoriaRevisaoId - ID da categoria de revisão
     * @returns {Promise<Array>} Lista de revisões da categoria
     */
    async findManyByCategoriaRevisaoId(categoriaRevisaoId) {
        return await this.findMany({
            categoriaRevisaoId: parseInt(categoriaRevisaoId),
        });
    }

    /**
     * Busca todas as revisões por situação
     * @param {number} situacaoRevisaoId - ID da situação de revisão
     * @returns {Promise<Array>} Lista de revisões da situação
     */
    async findManyBySituacaoRevisaoId(situacaoRevisaoId) {
        return await this.findMany({
            situacaoRevisaoId: parseInt(situacaoRevisaoId),
        });
    }

    /**
     * Busca todas as revisões de um plano de estudo
     * @param {number} planoEstudoId - ID do plano de estudo
     * @returns {Promise<Array>} Lista de revisões do plano
     */
    async findManyByPlanoEstudoId(planoEstudoId) {
        return await this.findMany({
            planoEstudoId: parseInt(planoEstudoId),
        });
    }

    /**
     * Busca todas as revisões de uma disciplina
     * @param {number} disciplinaId - ID da disciplina
     * @returns {Promise<Array>} Lista de revisões da disciplina
     */
    async findManyByDisciplinaId(disciplinaId) {
        return await this.findMany({
            disciplinaId: parseInt(disciplinaId),
        });
    }

    /**
     * Busca todas as revisões de um tópico
     * @param {number} topicoId - ID do tópico
     * @returns {Promise<Array>} Lista de revisões do tópico
     */
    async findManyByTopicoId(topicoId) {
        return await this.findMany({
            topicoId: parseInt(topicoId),
        });
    }

}

module.exports = new PrismaRevisaoRepository();
