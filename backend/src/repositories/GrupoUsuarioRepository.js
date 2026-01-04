const BaseRepository = require("./BaseRepository");

class PrismaGrupoUsuarioRepository extends BaseRepository {

    constructor() {
        super("grupoUsuario", "GrupoUsuarioRepository.js", {
            defaultOrderBy: "descricao",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca grupo de usuário por descrição
     * @param {string} descricao - Descrição do grupo de usuário
     * @returns {Promise<object|null>} Grupo de usuário encontrado ou null
     */
    async findUniqueByDescricao(descricao) {
        return await this.findByUniqueField("descricao", descricao);
    }

    /**
     * Busca grupos de usuário por descrição (busca parcial)
     * @param {string} descricao - Descrição do grupo de usuário para buscar
     * @returns {Promise<Array>} Lista de grupos de usuários
     */
    async findManyByDescricao(descricao) {
        return await this.findMany({
            descricao: {
                contains: descricao,
            },
        });
    }
}

module.exports = new PrismaGrupoUsuarioRepository();
