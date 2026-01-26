const BaseRepository = require("./BaseRepository");
const logger = require("../config/logger");

class PrismaCidadeRepository extends BaseRepository {

    constructor() {
        super("cidade", "CidadeRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca cidade por descrição e Unidade Federativa (constraint única composta)
     * @param {string} descricao - Descrição da cidade
     * @param {number} unidadeFederativa - Unidade Federativa
     * @returns {Promise<object|null>} Cidade encontrada ou null
     */
    async findByDescricaoAndUF(descricao, unidadeFederativa) {
        try {
            return await this.model.findFirst({
                where: {
                    descricao: descricao,
                    unidadeFederativa: unidadeFederativa
                },
                orderBy: { [this.defaultOrderBy]: this.orderDirection },
                include: this.includeRelations
            });
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por descrição e UF`, {
                error: error.message,
                stack: error.stack,
                descricao,
                unidadeFederativa,
                file: this.repositoryName,
            });

            throw error;
        }
    }

    /**
     * Busca cidades por descrição (busca parcial)
     * @param {string} descricao - Descrição da cidade para buscar
     * @returns {Promise<Array>} Lista de cidades encontradas
    */
    async findManyByDescricao(descricao) {
        const whereClause = {
            descricao: {
                contains: descricao,
            },
        };

        return await this.findMany(whereClause);
    }

    /**
     * Busca todas as cidades de uma Unidade Federativa
     * @param {number} unidadeFederativa - Unidade Federativa
     * @returns {Promise<Array>} Lista de cidades encontradas
    */
    async findManyByUnidadeFederativa(unidadeFederativa) {
        const query = {
            unidadeFederativa: unidadeFederativa,
        };

        return await this.findMany(query);
    }

}

module.exports = new PrismaCidadeRepository();
