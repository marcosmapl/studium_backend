const BaseController = require("./BaseController");
const repository = require("../repositories/GrupoUsuarioRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class GrupoUsuarioController extends BaseController {

    constructor() {
        super(repository, "grupo de usuário", {
            entityNamePlural: "grupos de usuário",
            requiredFields: ["grupo"]
        });
    }

    /**
     * Busca grupo de usuário por nome
     */
    async findByGrupo(req, res, next) {
        try {
            const { grupo } = req.params;
            const grupoDecodificado = decodeURIComponent(grupo);

            logger.info("Buscando grupos de usuário por nome", {
                grupo: grupoDecodificado,
                route: req.originalUrl,
            });

            const grupoEncontrado = await this.repository.findByGrupo(
                grupoDecodificado
            );

            if (!grupoEncontrado) {
                logger.info("Nenhum grupo de usuário encontrado com o nome", {
                    grupo: grupoDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse nome`
                });
            }

            return res.json(grupoEncontrado);
        } catch (error) {
            logger.error("Erro ao buscar grupo de usuário por nome", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new GrupoUsuarioController();

module.exports = {
    createGrupoUsuario: controller.create.bind(controller),
    findAllGrupoUsuario: controller.findAll.bind(controller),
    findGrupoUsuarioById: controller.findById.bind(controller),
    findGrupoUsuarioByGrupo: controller.findByGrupo.bind(controller),
    updateGrupoUsuario: controller.update.bind(controller),
    deleteGrupoUsuario: controller.delete.bind(controller)
};
