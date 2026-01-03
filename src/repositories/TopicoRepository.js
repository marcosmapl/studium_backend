const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaTopicoRepository extends BaseRepository {

    constructor() {
        super("topico", "TopicoRepository.js", {
            defaultOrderBy: "ordem",
            orderDirection: "asc",
            includeRelations: {
                disciplina: true,
                situacao: true,
            }
        });
    }

    /**
     * Busca tópico por título (primeira encontrada)
     * @param {string} titulo - Título do tópico
     * @returns {Promise<object|null>} Tópico encontrado ou null
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
     * Busca tópicos por título (busca parcial)
     * @param {string} titulo - Título do tópico
     * @returns {Promise<Array>} Lista de tópicos encontrados
     */
    async findManyByTitulo(titulo) {
        return await this.findMany({
            titulo: {
                contains: titulo,
            },
        });
    }

    /**
     * Busca todos os tópicos de uma disciplina
     * @param {number} disciplinaId - ID da disciplina
     * @returns {Promise<Array>} Lista de tópicos da disciplina
     */
    async findManyByDisciplinaId(disciplinaId) {
        return await this.findMany({
            disciplinaId: parseInt(disciplinaId),
        });
    }

    /**
     * Busca todos os tópicos por situação
     * @param {number} situacaoId - ID da situação
     * @returns {Promise<Array>} Lista de tópicos da situação
     */
    async findManyBySituacaoId(situacaoId) {
        return await this.findMany({
            situacaoId: parseInt(situacaoId),
        });
    }

}

module.exports = new PrismaTopicoRepository();
