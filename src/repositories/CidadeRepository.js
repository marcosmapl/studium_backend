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
     * Busca cidade por descrição
     * @param {string} descricao - Descrição da cidade
     * @returns {Promise<object|null>} Cidade encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
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
     * @param {number} unidadeFederativaId - ID da Unidade Federativa
     * @returns {Promise<Array>} Lista de cidades da UF
     */
    async findManyByUnidadeFederativa(unidadeFederativaId) {
        return await this.findMany({
            unidadeFederativaId: unidadeFederativaId,
        });
    }

}

module.exports = new PrismaCidadeRepository();
