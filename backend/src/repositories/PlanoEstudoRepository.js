const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaPlanoEstudoRepository extends BaseRepository {

    constructor() {
        super("planoEstudo", "PlanoEstudoRepository.js", {
            defaultOrderBy: "titulo",
            orderDirection: "asc",
            includeRelations: {
                usuario: true,
                disciplinas: true,
                sessoesEstudo: true,
                revisoes: true,
                blocosEstudo: true,
            }
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
        const query = {
            titulo: {
                contains: titulo,
            },
        };

        try {
            return await this.findMany(query);
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
     * Busca todos os planos de estudo de um usuário específico
     * @param {number} usuarioId - ID do usuário
     * @returns {Promise<Array>} Lista de planos de estudo do usuário
     */
    async findManyByUsuarioId(usuarioId) {
        const query = {
            where: { usuarioId },
            orderBy: { [this.defaultOrderBy]: this.orderDirection },
            include: {
                disciplinas: true,
                sessoesEstudo: true,
                revisoes: true
            }
        };

        try {
            return await this.model.findMany(query);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por usuarioId`, {
                error: error.message,
                usuarioId,
                file: this.repositoryName,
            });
            throw error;
        }
    }

}

module.exports = new PrismaPlanoEstudoRepository();
