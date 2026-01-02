const BaseRepository = require("./BaseRepository");

class PrismaGeneroUsuarioRepository extends BaseRepository {

    constructor() {
        super("generoUsuario", "GeneroUsuarioRepository.js", {
            defaultOrderBy: "genero",
            orderDirection: "asc",
            includeRelations: {
                usuarios: true,
            }
        });
    }

    /**
     * Busca gênero por nome
     * @param {string} genero - Nome do gênero
     * @returns {Promise<object|null>} Gênero encontrado ou null
     */
    async findByGenero(genero) {
        return await this.findByUniqueField("genero", genero);
    }

    /**
     * Busca gêneros por nome (busca parcial)
     * @param {string} genero - Nome do gênero para buscar
     * @returns {Promise<Array>} Lista de gêneros
     */
    async findByGeneroParcial(genero) {
        return await this.findMany({
            genero: {
                contains: genero,
            },
        });
    }
}

module.exports = new PrismaGeneroUsuarioRepository();
