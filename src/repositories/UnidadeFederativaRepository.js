const BaseRepository = require("./BaseRepository");

class PrismaUnidadeFederativaRepository extends BaseRepository {

    constructor() {
        super("unidadeFederativa", "UnidadeFederativaRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
                cidades: true,
            }
        });
    }

    /**
     * Busca a unidade federativa pela descrição
     * @param {string} descricao - Descrição da unidade federativa
     * @returns {Promise<object|null>} Unidade Federativa encontrada ou null
     */
    async findOneByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao.toUpperCase());
    }

    /**
     * Busca a unidade federativa pela descrição (busca parcial)
     * @param {string} descricao - Descrição da unidade federativa
     * @returns {Promise<Array>} Lista de Unidades Federativas
     */
    async findAllByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
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
