const BaseRepository = require("./BaseRepository");

class PrismaPlanejamentoRepository extends BaseRepository {

    constructor() {
        super("planejamento", "PlanejamentoRepository.js", {
            defaultOrderBy: "createdAt",
            orderDirection: "desc",
            includeRelations: {
                planoEstudo: true,
                diasEstudo: true,
                disciplinasPlanejamento: {
                    include: {
                        disciplina: true,
                    },
                },
            }
        });
    }

    /**
     * Busca todos os planejamentos de um plano de estudo específico
     * @param {number} planoEstudoId - ID do plano de estudo
     * @returns {Promise<Array>} Lista de planejamentos
     */
    async findManyByPlanoEstudoId(planoEstudoId) {
        return await this.findMany({
            planoEstudoId: parseInt(planoEstudoId),
        });
    }

    /**
     * Busca planejamentos ativos
     * @returns {Promise<Array>} Lista de planejamentos ativos
     */
    async findManyByAtivo() {
        return await this.findMany({
            ativo: true,
        });
    }
}

module.exports = PrismaPlanejamentoRepository;
