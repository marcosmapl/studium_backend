const BaseController = require("./BaseController");
const repository = require("../repositories/TopicoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class TopicoController extends BaseController {

    constructor() {
        super(repository, "tópico", {
            entityNamePlural: "tópicos",
            requiredFields: ["titulo", "ordem", "disciplinaId", "situacaoId"]
        });
    }

    /**
     * Busca tópico por título
     */
    async findUniqueByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityName} por título`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const topico = await this.repository.findUniqueByTitulo(
                tituloDecodificado
            );

            if (!topico) {
                logger.info(`Nenhum ${this.entityName} encontrado com esse título`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse título`
                });
            }

            return res.json(topico);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por título`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca tópicos por título (busca parcial)
     */
    async findManyByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityNamePlural} por título parcial`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const topicos = await this.repository.findManyByTitulo(
                tituloDecodificado
            );

            if (!topicos || topicos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado com esse padrão`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse padrão`
                });
            }

            return res.json(topicos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por título parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todos os tópicos de uma disciplina
     */
    async findManyByDisciplinaId(req, res, next) {
        try {
            const { disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} da disciplina`, {
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const topicos = await this.repository.findManyByDisciplinaId(disciplinaId);

            if (!topicos || topicos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para esta disciplina`, {
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado para esta disciplina`
                });
            }

            return res.json(topicos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por disciplina`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todos os tópicos por situação
     */
    async findManyBySituacaoId(req, res, next) {
        try {
            const { situacaoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por situação`, {
                situacaoId: parseInt(situacaoId),
                route: req.originalUrl,
            });

            const topicos = await this.repository.findManyBySituacaoId(situacaoId);

            if (!topicos || topicos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para esta situação`, {
                    situacaoId: parseInt(situacaoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado para esta situação`
                });
            }

            return res.json(topicos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por situação`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new TopicoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByTitulo: controller.findUniqueByTitulo.bind(controller),
    findManyByTitulo: controller.findManyByTitulo.bind(controller),
    findManyByDisciplinaId: controller.findManyByDisciplinaId.bind(controller),
    findManyBySituacaoId: controller.findManyBySituacaoId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
