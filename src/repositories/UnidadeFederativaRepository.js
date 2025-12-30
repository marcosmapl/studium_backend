const BaseRepository = require("./BaseRepository");

class PrismaUnidadeFederativaRepository extends BaseRepository {

    constructor() {
        super("unidade_federativa", "UnidadeFederativaRepository.js", {
            defaultOrderBy: "uf",
            orderDirection: "asc"
        });
    }

    /**
     * Busca a Unidade Federativa por descrição
     * @param {string} uf - Unidade Federativa
     * @returns {Promise<object|null>} Unidade Federativa encontrado ou null
     */
    async findByUnidadeFederativa(uf) {
        return await this.findByUniqueField("uf", uf.toUpperCase());
    }
}

module.exports = new PrismaUnidadeFederativaRepository();
