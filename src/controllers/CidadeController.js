const BaseController = require("./BaseController");
const repository = require("../repositories/CidadeRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class CidadeController extends BaseController {

    constructor() {
        super(repository, "cidade", {
            entityNamePlural: "cidades",
            requiredFields: ["descricao", "unidadeFederativaId"]
        });
    }

    /**
     * Busca cidade por descrição exata
     */
    async findUniqueByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificado = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição exata`, {
                nome: descricaoDecodificado,
                route: req.originalUrl,
            });

            const cidade = await this.repository.findUniqueByDescricao(
                descricaoDecodificado
            );

            if (!cidade) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição`, {
                    descricao: descricaoDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa descrição`
                });
            }

            return res.json(cidade);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por descrição`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca cidades por descrição (busca parcial)
     */
    async findManyByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificado = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificado,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findManyByDescricao(
                descricaoDecodificado
            );

            if (!cidades || cidades.length === 0) {
                logger.info(`Não foram encontradas ${this.entityName} essa descrição parcial`, {
                    descricao: descricaoDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontradas ${this.entityName} essa descrição parcial`
                });
            }

            return res.json(cidades);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por descrição parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca cidades de uma Unidade Federativa
     */
    async findManyByUnidadeFederativa(req, res, next) {
        try {
            const { unidadeFederativaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por Unidade Federativa`, {
                unidadeFederativaId,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findManyByUnidadeFederativa(
                Number(unidadeFederativaId)
            );

            if (!cidades || cidades.length === 0) {
                logger.info(`Não foram encontradas ${this.entityName} para essa Unidade Federativa`, {
                    unidadeFederativaId,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontradas ${this.entityName} para essa Unidade Federativaa`
                });
            }

            return res.json(cidades);

        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por Unidade Federativa`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new CidadeController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByDescricao: controller.findUniqueByDescricao.bind(controller),
    findManyByDescricao: controller.findManyByDescricao.bind(controller),
    findManyByUnidadeFederativa: controller.findManyByUnidadeFederativa.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
