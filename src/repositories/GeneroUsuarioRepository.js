const BaseRepository = require("./BaseRepository");

class PrismaGeneroUsuarioRepository extends BaseRepository {

    constructor() {
        super("genero_usuario", "GeneroUsuarioRepository.js", {
            defaultOrderBy: "genero",
            orderDirection: "asc"
        });
    }

    /**
     * Busca o gênero de usuaário pela descrição
     * @param {string} genero - descriçaõ
     * @returns {Promise<object|null>} Gênero encontrado ou null
     */
    async findByGenero(genero) {
        return await this.findByUniqueField("genero", genero.toUpperCase());
    }
}

module.exports = new PrismaGeneroUsuarioRepository();
