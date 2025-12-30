const BaseRepository = require("./BaseRepository");

class PrismaGrupoUsuarioRepository extends BaseRepository {
    
  constructor() {
    super("grupoUsuario", "GrupoUsuarioRepository.js", {
      defaultOrderBy: "nome",
      orderDirection: "asc",
      includeRelations: {
        usuarios: true,
      }
    });
  }
}

module.exports = new PrismaGrupoUsuarioRepository();
