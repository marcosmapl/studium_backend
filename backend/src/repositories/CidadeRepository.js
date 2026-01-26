const BaseRepository = require("./BaseRepository");

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
                include: this.includeRelations
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca cidades por descrição (busca parcial)
     * @param {string} descricao - Descrição da cidade para buscar
     * @returns {Promise<Array>} Lista de cidades
     */
    async findManyByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
    }

    /**
     * Busca todas as cidades de uma Unidade Federativa
     * @param {number} unidadeFederativa - Unidade Federativa
     * @returns {Promise<Array>} Lista de cidades da UF
     */
    async findManyByUnidadeFederativa(unidadeFederativa) {
        return await this.findMany({
            unidadeFederativa: unidadeFederativa,
        });
    }

}

module.exports = new PrismaCidadeRepository();
