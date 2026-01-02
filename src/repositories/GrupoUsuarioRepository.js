const BaseRepository = require("./BaseRepository");

class PrismaGrupoUsuarioRepository extends BaseRepository {

    constructor() {
        super("grupoUsuario", "GrupoUsuarioRepository.js", {
            defaultOrderBy: "grupo",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca grupo de usuário por nome
     * @param {string} grupo - Nome do grupo de usuário
     * @returns {Promise<object|null>} Grupo de usuário encontrado ou null
     */
    async findByGrupo(grupo) {
        return await this.findByUniqueField("grupo", grupo);
    }

    /**
     * Busca grupos de usuário por nome (busca parcial)
     * @param {string} grupo - Nome do grupo de usuário para buscar
     * @returns {Promise<Array>} Lista de grupos de usuários
     */
    async findByGrupoParcial(grupo) {
        return await this.findMany({
            grupo: {
                contains: grupo,
            },
        });
    }
}

module.exports = new PrismaGrupoUsuarioRepository();
