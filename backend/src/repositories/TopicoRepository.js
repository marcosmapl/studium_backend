const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaTopicoRepository extends BaseRepository {

    constructor() {
        super("topico", "TopicoRepository.js", {
            defaultOrderBy: "ordem",
            orderDirection: "asc",
            includeRelations: {
                disciplina: true,
                sessoesEstudo: true,
                revisoes: true,
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
        const query = {
            titulo: {
                contains: titulo,
            },
        }

        return await this.findMany(query);
    }

    /**
     * Busca todos os tópicos de uma disciplina
     * @param {number} disciplinaId - ID da disciplina
     * @returns {Promise<Array>} Lista de tópicos da disciplina
     */
    async findManyByDisciplinaId(disciplinaId) {
        const query = {
            disciplinaId: parseInt(disciplinaId),
        }

        return await this.findMany(query);
    }

    /**
     * Busca todos os tópicos de um plano de estudo
     * @param {number} planoEstudoId - ID do plano de estudo
     * @returns {Promise<Array>} Lista de tópicos do plano de estudo
     */
    async findManyByPlanoEstudoId(planoEstudoId) {
        try {
            const topicos = await this.model.findMany({
                where: {
                    disciplina: {
                        is: {
                            planoId: parseInt(planoEstudoId)
                        }
                    }
                },
                include: {
                    disciplina: true
                },
                orderBy: {
                    ordem: this.orderDirection
                }
            });

            return topicos;
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por plano de estudo`, {
                error: error.message,
                planoEstudoId,
                file: this.repositoryName,
            });
            throw error;
        }
    }

}

module.exports = new PrismaTopicoRepository();
