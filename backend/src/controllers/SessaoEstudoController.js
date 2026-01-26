const BaseController = require("./BaseController");
const repository = require("../repositories/SessaoEstudoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class SessaoEstudoController extends BaseController {

    constructor() {
        super(repository, "sessão de estudo", {
            entityNamePlural: "sessões de estudo",
            requiredFields: ["dataInicio", "planoEstudoId", "disciplinaId", "topicoId", "blocoEstudoId"]
        });
    }

    /**
     * Busca todas as sessões de estudo de um plano
     */
    async findManyByPlanoEstudoId(req, res, next) {
        try {
            const { planoEstudoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do plano de estudo`, {
                planoEstudoId: parseInt(planoEstudoId),
                route: req.originalUrl,
            });

            const sessoes = await this.repository.findManyByPlanoEstudoId(planoEstudoId);

            if (!sessoes || sessoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este plano de estudo`, {
                    planoEstudoId: parseInt(planoEstudoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este plano de estudo`
                });
            }

            return res.json(sessoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por plano de estudo`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as sessões de estudo de uma disciplina
     */
    async findManyByDisciplinaId(req, res, next) {
        try {
            const { disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} da disciplina`, {
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const sessoes = await this.repository.findManyByDisciplinaId(disciplinaId);

            if (!sessoes || sessoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta disciplina`, {
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para esta disciplina`
                });
            }

            return res.json(sessoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por disciplina`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as sessões de estudo de um tópico
     */
    async findManyByTopicoId(req, res, next) {
        try {
            const { topicoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do tópico`, {
                topicoId: parseInt(topicoId),
                route: req.originalUrl,
            });

            const sessoes = await this.repository.findManyByTopicoId(topicoId);

            if (!sessoes || sessoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este tópico`, {
                    topicoId: parseInt(topicoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este tópico`
                });
            }

            return res.json(sessoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por tópico`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as sessões de estudo por categoria
     */
    async findManyByBlocoEstudoId(req, res, next) {
        try {
            const { blocoEstudoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por bloco de estudo`, {
                blocoEstudoId: parseInt(blocoEstudoId),
                route: req.originalUrl,
            });

            const sessoes = await this.repository.findManyByBlocoEstudoId(blocoEstudoId);

            if (!sessoes || sessoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este bloco de estudo`, {
                    blocoEstudoId: parseInt(blocoEstudoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este bloco de estudo`
                });
            }

            return res.json(sessoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por bloco de estudo`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as sessões de estudo por situação
     */
    async findManyBySituacaoSessaoId(req, res, next) {
        try {
            const { situacaoSessaoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por situação de sessão`, {
                situacaoSessaoId: parseInt(situacaoSessaoId),
                route: req.originalUrl,
            });

            const sessoes = await this.repository.findManyBySituacaoSessaoId(situacaoSessaoId);

            if (!sessoes || sessoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta situação`, {
                    situacaoSessaoId: parseInt(situacaoSessaoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para esta situação`
                });
            }

            return res.json(sessoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por situação de sessão`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new SessaoEstudoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByPlanoEstudoId: controller.findManyByPlanoEstudoId.bind(controller),
    findManyByDisciplinaId: controller.findManyByDisciplinaId.bind(controller),
    findManyByTopicoId: controller.findManyByTopicoId.bind(controller),
    findManyByCategoriaSessaoId: controller.findManyByCategoriaSessaoId.bind(controller),
    findManyBySituacaoSessaoId: controller.findManyBySituacaoSessaoId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
