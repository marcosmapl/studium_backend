const BaseController = require("./BaseController");
const repository = require("../repositories/GeneroUsuarioRepository");
const logger = require("../config/logger");

class GeneroUsuarioController extends BaseController {

    constructor() {
        super(repository, "gênero de usuário", {
            entityNamePlural: "gêneros de usuário",
            requiredFields: ["genero"]
        });
    }

    /**
     * Busca gêneros por nome (busca parcial)
     */
    async findByGenero(req, res, next) {
        try {
            const { genero } = req.params;
            const generoDecodificado = decodeURIComponent(genero);

            logger.info("Buscando gênero por nome", {
                genero: generoDecodificado,
                route: req.originalUrl,
            });

            const generos = await this.repository.findByGeneroParcial(
                generoDecodificado
            );

            if (!generos || generos.length === 0) {
                logger.info("Nenhum gênero encontrado com o nome", {
                    genero: generoDecodificado,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `Nenhum ${this.entityName} encontrado com esse nome`
                });
            }

            return res.json(generos);
        } catch (error) {
            logger.error("Erro ao buscar gênero por nome", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new GeneroUsuarioController();

module.exports = {
    createGeneroUsuario: controller.create.bind(controller),
    findAllGenerosUsuario: controller.findAll.bind(controller),
    findGeneroUsuarioById: controller.findById.bind(controller),
    findGeneroUsuarioByGenero: controller.findByGenero.bind(controller),
    updateGeneroUsuario: controller.update.bind(controller),
    deleteGeneroUsuario: controller.delete.bind(controller)
};
