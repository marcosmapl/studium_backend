const BaseRepository = require("./BaseRepository");

class PrismaUnidadeFederativaRepository extends BaseRepository {

    constructor() {
        super("unidadeFederativa", "UnidadeFederativaRepository.js", {
            defaultOrderBy: "nome",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
                cidades: true,
            }
        });
    }

    /**
     * Busca a unidade federativa pelo nome
     * @param {string} nome - Nome da unidade federativa
     * @returns {Promise<object|null>} Unidade Federativa encontrada ou null
     */
    async findByNome(nome) {
        return await this.findByUniqueField("nome", nome.toUpperCase());
    }

    /**
     * Busca a unidade federativa pela sigla
     * @param {string} sigla - Sigla da unidade federativa
     * @returns {Promise<object|null>} Unidade federativa encontrada ou null
     */
    async findBySigla(sigla) {
        return await this.findByUniqueField("sigla", sigla.toUpperCase());
    }
}

module.exports = new PrismaUnidadeFederativaRepository();
