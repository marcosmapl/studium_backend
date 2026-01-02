const BaseRepository = require("./BaseRepository");

class PrismaCidadeRepository extends BaseRepository {

    constructor() {
        super("cidade", "CidadeRepository.js", {
            defaultOrderBy: "cidade",
            orderDirection: "asc"
        });
    }

    /**
     * Busca cidade por nome
     * @param {string} nomeCidade - Nome da cidade
     * @returns {Promise<object|null>} Cidade encontrada ou null
     */
    async findByNome(nomeCidade) {
        return await this.findByUniqueField("cidade", nomeCidade);
    }

    /**
     * Busca cidades por nome (busca parcial)
     * @param {string} nomeCidade - Nome da cidade para buscar
     * @returns {Promise<Array>} Lista de cidades
     */
    async findByNomeParcial(nomeCidade) {
        return await this.findMany({
            cidade: {
                contains: nomeCidade,
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
