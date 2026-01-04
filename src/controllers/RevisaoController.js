const BaseController = require("./BaseController");
const repository = require("../repositories/RevisaoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class RevisaoController extends BaseController {

    constructor() {
        super(repository, "revisão", {
            entityNamePlural: "revisões",
            requiredFields: ["numero", "dataProgramada", "desempenho", "categoriaRevisaoId", "situacaoRevisaoId", "planoEstudoId", "disciplinaId", "topicoId"]
        });
    }

    /**
     * Busca todas as revisões por categoria
     */
    async findManyByCategoriaRevisaoId(req, res, next) {
        try {
            const { categoriaRevisaoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por categoria de revisão`, {
                categoriaRevisaoId: parseInt(categoriaRevisaoId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByCategoriaRevisaoId(categoriaRevisaoId);

            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta categoria`, {
                    categoriaRevisaoId: parseInt(categoriaRevisaoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para esta categoria`
                });
            }

            return res.json(revisoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por categoria de revisão`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões por situação
     */
    async findManyBySituacaoRevisaoId(req, res, next) {
        try {
            const { situacaoRevisaoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por situação de revisão`, {
                situacaoRevisaoId: parseInt(situacaoRevisaoId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyBySituacaoRevisaoId(situacaoRevisaoId);

            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta situação`, {
                    situacaoRevisaoId: parseInt(situacaoRevisaoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para esta situação`
                });
            }

            return res.json(revisoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por situação de revisão`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões de um plano de estudo
     */
    async findManyByPlanoEstudoId(req, res, next) {
        try {
            const { planoEstudoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do plano de estudo`, {
                planoEstudoId: parseInt(planoEstudoId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByPlanoEstudoId(planoEstudoId);

            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este plano de estudo`, {
                    planoEstudoId: parseInt(planoEstudoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este plano de estudo`
                });
            }

            return res.json(revisoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por plano de estudo`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões de uma disciplina
     */
    async findManyByDisciplinaId(req, res, next) {
        try {
            const { disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} da disciplina`, {
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByDisciplinaId(disciplinaId);

            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta disciplina`, {
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para esta disciplina`
                });
            }

            return res.json(revisoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por disciplina`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões de um tópico
     */
    async findManyByTopicoId(req, res, next) {
        try {
            const { topicoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do tópico`, {
                topicoId: parseInt(topicoId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByTopicoId(topicoId);

            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este tópico`, {
                    topicoId: parseInt(topicoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este tópico`
                });
            }

            return res.json(revisoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por tópico`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new RevisaoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByCategoriaRevisaoId: controller.findManyByCategoriaRevisaoId.bind(controller),
    findManyBySituacaoRevisaoId: controller.findManyBySituacaoRevisaoId.bind(controller),
    findManyByPlanoEstudoId: controller.findManyByPlanoEstudoId.bind(controller),
    findManyByDisciplinaId: controller.findManyByDisciplinaId.bind(controller),
    findManyByTopicoId: controller.findManyByTopicoId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
