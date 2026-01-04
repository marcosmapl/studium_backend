const BaseRepository = require("./BaseRepository");

class PrismaDisciplinaPlanejamentoRepository extends BaseRepository {

    constructor() {
        super("disciplinaPlanejamento", "DisciplinaPlanejamentoRepository.js", {
            defaultOrderBy: "importancia",
            orderDirection: "desc",
            includeRelations: {
                planejamento: true,
                disciplina: true,
                alocacoes: true,
            }
        });
    }

    /**
     * Busca todas as disciplinas de um planejamento
     * @param {number} planejamentoId - ID do planejamento
     * @returns {Promise<Array>} Lista de disciplinas do planejamento
     */
    async findManyByPlanejamentoId(planejamentoId) {
        return await this.findMany({
            planejamentoId: parseInt(planejamentoId),
        });
    }

    /**
     * Busca todos os planejamentos de uma disciplina
     * @param {number} disciplinaId - ID da disciplina
     * @returns {Promise<Array>} Lista de planejamentos da disciplina
     */
    async findManyByDisciplinaId(disciplinaId) {
        return await this.findMany({
            disciplinaId: parseInt(disciplinaId),
        });
    }
}

module.exports = PrismaDisciplinaPlanejamentoRepository;
