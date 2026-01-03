const BaseRepository = require("./BaseRepository");

class PrismaSituacaoUsuarioRepository extends BaseRepository {

    constructor() {
        super("situacaoUsuario", "SituacaoUsuarioRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca situação de usuário por descrição
     * @param {string} descricao - Descrição da situação do usuário (Ativo, Inativo, Bloqueado)
     * @returns {Promise<object|null>} Situação encontrada ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca situações de usuário por descrição (busca parcial)
     * @param {string} descricao - Descrição da situação do usuário (Ativo, Inativo, Bloqueado)
     * @returns {Promise<Array>} Lista de situações
     */
    async findManyByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
    }

}

module.exports = new PrismaSituacaoUsuarioRepository();
