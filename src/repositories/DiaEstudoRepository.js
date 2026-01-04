const BaseRepository = require("./BaseRepository");

class PrismaDiaEstudoRepository extends BaseRepository {

    constructor() {
        super("diaEstudo", "DiaEstudoRepository.js", {
            defaultOrderBy: "diaSemana",
            orderDirection: "asc",
            includeRelations: {
                planejamento: true,
                alocacoes: true,
            }
        });
    }

    /**
     * Busca todos os dias de estudo de um planejamento
     * @param {number} planejamentoId - ID do planejamento
     * @returns {Promise<Array>} Lista de dias de estudo do planejamento
     */
    async findManyByPlanejamentoId(planejamentoId) {
        return await this.findMany({
            planejamentoId: parseInt(planejamentoId),
        });
    }

    /**
     * Busca dias de estudo por dia da semana
     * @param {number} diaSemana - Dia da semana (0-6)
     * @returns {Promise<Array>} Lista de dias de estudo do dia da semana
     */
    async findManyByDiaSemana(diaSemana) {
        return await this.findMany({
            diaSemana: parseInt(diaSemana),
        });
    }
}

module.exports = PrismaDiaEstudoRepository;
