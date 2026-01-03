const BaseController = require("./BaseController");
const repository = require("../repositories/SituacaoPlanoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class SituacaoPlanoController extends BaseController {

    constructor() {
        super(repository, "situação de plano de estudo", {
            entityNamePlural: "situações de plano de estudo",
            requiredFields: ["descricao"]
        });
    }

    /**
     * Busca situação de usuário por descrição
     */
    async findUniqueByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const situacaoEncontrada = await this.repository.findUniqueByDescricao(
                descricaoDecodificada
            );

            if (!situacaoEncontrada) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse descrição`
                });
            }

            return res.json(situacaoEncontrada);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por descrição`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca situação por descrição (busca parcial)
     */
    async findManyByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const situacoes = await this.repository.findManyByDescricao(
                descricaoDecodificada
            );

            if (!situacoes || situacoes.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrada com essa descrição parcial`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrada com essa descrição parcial`
                });
            }

            return res.json(situacoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por descrição parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new SituacaoPlanoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByDescricao: controller.findUniqueByDescricao.bind(controller),
    findManyByDescricao: controller.findManyByDescricao.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
