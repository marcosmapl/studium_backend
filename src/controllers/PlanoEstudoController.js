const BaseController = require("./BaseController");
const repository = require("../repositories/PlanoEstudoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class PlanoEstudoController extends BaseController {

    constructor() {
        super(repository, "plano de estudo", {
            entityNamePlural: "planos de estudo",
            requiredFields: ["titulo", "usuarioId", "situacaoId"]
        });
    }

    /**
     * Busca plano de estudo por título
     */
    async findUniqueByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityName} por título`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const grupoEncontrado = await this.repository.findUniqueByTitulo(
                tituloDecodificado
            );

            if (!grupoEncontrado) {
                logger.info("Nenhum plano de estudo encontrado com esse título", {
                    info: tituloDecodificado,
                    titulo: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse título`
                });
            }

            return res.json(grupoEncontrado);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por título`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca plano de estudo por título (busca parcial)
     */
    async findManyByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityNamePlural} por título parcial`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const planos = await this.repository.findManyByTitulo(
                tituloDecodificado
            );

            if (!planos || planos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado com esse padrão`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse padrão`
                });
            }

            return res.json(planos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por título parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new PlanoEstudoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByTitulo: controller.findUniqueByTitulo.bind(controller),
    findManyByTitulo: controller.findManyByTitulo.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
