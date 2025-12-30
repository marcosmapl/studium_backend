const BaseRepository = require("./BaseRepository");

class PrismaCategoriaAtendimentoRepository extends BaseRepository {
    
    constructor() {
        super("categoriaAtendimento", "CategoriaAtendimentoRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc"
        });
    }

    /**
     * Busca categoria de atendimento por descrição
     * @param {string} descricao - Descrição da categoria
     * @returns {Promise<object|null>} Categoria encontrada ou null
     */
    async findByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }
}

module.exports = new PrismaCategoriaAtendimentoRepository();
