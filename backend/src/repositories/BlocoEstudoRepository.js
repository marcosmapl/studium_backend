const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaBlocoEstudoRepository extends BaseRepository {

    constructor() {
        super("blocoEstudo", "BlocoEstudoRepository.js", {
            defaultOrderBy: "diaSemana",
            orderDirection: "asc",
            includeRelations: {
                disciplina: true,
                planoEstudo: true,
            }
        });
    }

    /**
     * Busca todos os blocos de estudo pelo ID do plano de estudo e da disciplina
     * @param {number} planoEstudoId - ID do plano de estudo
     * @param {number} disciplinaId - ID da disciplina
     * @returns {Promise<Array>} Lista de blocos de estudo encontrados
     */
    async findManyByDisciplinaPlano(planoEstudoId, disciplinaId) {
        const whereClause = {
            planoEstudoId: parseInt(planoEstudoId),
            disciplinaId: parseInt(disciplinaId),
        };

        try {
            return await this.findMany(whereClause);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por disciplinaId e planoId`, {
                error: error.message,
                planoEstudoId,
                disciplinaId,
                file: this.repositoryName,
            });

            throw error;
        }
    }

    /**
     * Busca todos os blocos de estudo pelo ID do plano de estudo
     * @param {number} planoEstudoId - ID do plano de estudo
     * @returns {Promise<Array>} Lista de blocos de estudo encontrados
     */
    async findManyByPlanoId(planoEstudoId) {
        const whereClause = {
            planoEstudoId: parseInt(planoEstudoId),
        };

        try {
            return await this.findMany(whereClause);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por planoEstudoId`, {
                error: error.message,
                planoEstudoId,
                file: this.repositoryName,
            });

            throw error;
        }
    }

}

module.exports = new PrismaBlocoEstudoRepository();
