const BaseRepository = require("./BaseRepository");

class PrismaCidadeRepository extends BaseRepository {

    constructor() {
        super("cidade", "CidadeRepository.js", {
            defaultOrderBy: "cidade",
            orderDirection: "asc"
        });
    }

    /**
     * Busca a cidade pelo nome da cidade
     * @param {string} cidade - nome da cidade
     * @returns {Promise<object|null>} Cidade encontrado ou null
     */
    async findByCidade(cidade) {
        return await this.findByUniqueField("cidade", cidade.toUpperCase());
    }
}

module.exports = new PrismaCidadeRepository();
