const BaseRepository = require("./BaseRepository");

class PrismaPlanoEstudoRepository extends BaseRepository {

    constructor() {
        super("planoEstudo", "PlanoEstudoRepository.js", {
            defaultOrderBy: "titulo",
            orderDirection: "asc"
        });
    }

    /**
     * Busca plano de estudo por título (primeiro encontrado)
     * @param {string} titulo - Título do plano de estudo
     * @returns {Promise<object|null>} Plano de estudo encontrado ou null
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
            const logger = require("../config/logger");
            logger.error(`Erro ao buscar ${this.modelName} por titulo`, {
                error: error.message,
                titulo,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Busca plano de estudo por título (busca parcial)
     * @param {string} titulo - Título do plano de estudo
     * @returns {Promise<Array>} Lista de planos de estudo encontrados
     */
    async findManyByTitulo(titulo) {
        return await this.findMany({
            titulo: {
                contains: titulo,
            },
        });
    }

}

module.exports = new PrismaPlanoEstudoRepository();
