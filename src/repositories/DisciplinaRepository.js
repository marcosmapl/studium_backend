const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaDisciplinaRepository extends BaseRepository {

    constructor() {
        super("disciplina", "DisciplinaRepository.js", {
            defaultOrderBy: "titulo",
            orderDirection: "asc"
        });
    }

    /**
     * Busca disciplina por título (primeira encontrada)
     * @param {string} titulo - Título da disciplina
     * @returns {Promise<object|null>} Disciplina encontrada ou null
     */
    async findUniqueByTitulo(titulo) {
        const query = {
            where: { titulo: titulo },
        };

        if (this.includeRelations) {
            query.include = this.includeRelations;
        }

        try {
            return await this.model.findFirst(query);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por titulo`, {
                error: error.message,
                titulo,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Busca disciplinas por título (busca parcial)
     * @param {string} titulo - Título da disciplina
     * @returns {Promise<Array>} Lista de disciplinas encontradas
     */
    async findManyByTitulo(titulo) {
        return await this.findMany({
            titulo: {
                contains: titulo,
            },
        });
    }

    /**
     * Busca todas as disciplinas de um plano de estudo
     * @param {number} planoId - ID do plano de estudo
     * @returns {Promise<Array>} Lista de disciplinas do plano
     */
    async findManyByPlanoId(planoId) {
        return await this.findMany({
            planoId: parseInt(planoId),
        });
    }

}

module.exports = new PrismaDisciplinaRepository();
