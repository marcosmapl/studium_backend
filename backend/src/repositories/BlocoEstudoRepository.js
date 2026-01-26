const BaseRepository = require("./BaseRepository");

class PrismaBlocoEstudoRepository extends BaseRepository {

    constructor() {
        super("bloco", "BlocoEstudoRepository.js", {
            defaultOrderBy: "diaSemana",
            orderDirection: "asc",
            includeRelations: {
                disciplina: true,
                planoEstudo: true,
            }
        });
    }

    /**
     * Busca todos os blocos de estudo de um disciplina-planejamento
     * @param {number} disciplinaPlanejamentoId - ID do registro disciplina-planejamento
     * @returns {Promise<Array>} Lista de blocos de estudo do planejamento
     */
    async findManyByDisciplinaPlanejamento(planejamentoId, disciplinaId) {
        return await this.findMany({
            planejamentoId: parseInt(planejamentoId),
            disciplinaId: parseInt(disciplinaId),
        });
    }

}

module.exports = new PrismaBlocoEstudoRepository();
