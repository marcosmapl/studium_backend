const BaseRepository = require("./BaseRepository");

class PrismaUnidadeFederativaRepository extends BaseRepository {

    constructor() {
        super("unidadeFederativa", "UnidadeFederativaRepository.js", {
            defaultOrderBy: "nome",
            orderDirection: "asc"
        });
    }

    /**
     * Busca a cidade pelo nome da cidade
     * @param {string} nome - nome da cidade
     * @returns {Promise<object|null>} Cidade encontrado ou null
     */
    async findByNome(nome) {
        return await this.findByUniqueField("nome", nome.toUpperCase());
    }

    /**
     * Busca a cidade pelo nome da cidade
     * @param {string} sigla - nome da cidade
     * @returns {Promise<object|null>} Cidade encontrado ou null
     */
    async findBySigla(sigla) {
        return await this.findByUniqueField("sigla", sigla.toUpperCase());
    }
}

module.exports = new PrismaUnidadeFederativaRepository();
