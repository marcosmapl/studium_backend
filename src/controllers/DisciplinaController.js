const BaseController = require("./BaseController");
const repository = require("../repositories/DisciplinaRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class DisciplinaController extends BaseController {

    constructor() {
        super(repository, "disciplina", {
            entityNamePlural: "disciplinas",
            requiredFields: ["titulo", "cor", "planoId"]
        });
    }

    /**
     * Busca disciplina por título
     */
    async findUniqueByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityName} por título`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const disciplina = await this.repository.findUniqueByTitulo(
                tituloDecodificado
            );

            if (!disciplina) {
                logger.info(`Nenhuma ${this.entityName} encontrada com esse título`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse título`
                });
            }

            return res.json(disciplina);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por título`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca disciplinas por título (busca parcial)
     */
    async findManyByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityNamePlural} por título parcial`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const disciplinas = await this.repository.findManyByTitulo(
                tituloDecodificado
            );

            if (!disciplinas || disciplinas.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada com esse padrão`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse padrão`
                });
            }

            return res.json(disciplinas);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por título parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as disciplinas de um plano de estudo
     */
    async findManyByPlanoId(req, res, next) {
        try {
            const { planoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do plano de estudo`, {
                planoId: parseInt(planoId),
                route: req.originalUrl,
            });

            const disciplinas = await this.repository.findManyByPlanoId(planoId);

            if (!disciplinas || disciplinas.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este plano`, {
                    planoId: parseInt(planoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este plano de estudo`
                });
            }

            return res.json(disciplinas);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por plano`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new DisciplinaController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByTitulo: controller.findUniqueByTitulo.bind(controller),
    findManyByTitulo: controller.findManyByTitulo.bind(controller),
    findManyByPlanoId: controller.findManyByPlanoId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
