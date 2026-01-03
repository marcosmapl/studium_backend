const BaseController = require("./BaseController");
const repository = require("../repositories/GrupoUsuarioRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class GrupoUsuarioController extends BaseController {

    constructor() {
        super(repository, "grupo de usuário", {
            entityNamePlural: "grupos de usuário",
            requiredFields: ["descricao"]
        });
    }

    /**
     * Busca grupo de usuário por descrição
     */
    async findUniqueByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const grupoEncontrado = await this.repository.findUniqueByDescricao(
                descricaoDecodificada
            );

            if (!grupoEncontrado) {
                logger.info("Nenhum grupo de usuário encontrado com essa descrição", {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com essa descrição`
                });
            }

            return res.json(grupoEncontrado);
        } catch (error) {
            logger.error("Erro ao buscar grupo de usuário por descrição", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca grupo de usuário por descrição (busca parcial)
     */
    async findManyByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const grupos = await this.repository.findManyByDescricao(
                descricaoDecodificada
            );

            if (!grupos || grupos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado com esse padrão`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse padrão`
                });
            }

            return res.json(grupos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por nome parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new GrupoUsuarioController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByDescricao: controller.findUniqueByDescricao.bind(controller),
    findManyByDescricao: controller.findManyByDescricao.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
