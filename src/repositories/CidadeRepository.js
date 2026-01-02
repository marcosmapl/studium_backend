const BaseRepository = require("./BaseRepository");

class PrismaCidadeRepository extends BaseRepository {

    constructor() {
        super("cidade", "CidadeRepository.js", {
            defaultOrderBy: "cidade",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca cidade por nome
     * @param {string} cidade - Nome da cidade
     * @returns {Promise<object|null>} Cidade encontrada ou null
     */
    async findByCidade(cidade) {
        return await this.findByUniqueField("cidade", cidade);
    }

    /**
     * Busca cidades por nome (busca parcial)
     * @param {string} cidade - Nome da cidade para buscar
     * @returns {Promise<Array>} Lista de cidades
     */
    async findByCidadeParcial(cidade) {
        return await this.findMany({
            cidade: {
                contains: cidade,
            },
        });
    }

    /**
     * Busca todas as cidades de uma Unidade Federativa
     * @param {number} unidadeFederativaId - ID da Unidade Federativa
     * @returns {Promise<Array>} Lista de cidades da UF
     */
    async findByUnidadeFederativa(unidadeFederativaId) {
        return await this.findMany({
            unidadeFederativaId: unidadeFederativaId,
        });
    }

}

module.exports = new PrismaCidadeRepository();
