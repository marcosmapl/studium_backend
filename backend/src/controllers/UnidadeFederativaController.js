const BaseController = require("./BaseController");
const repository = require("../repositories/UnidadeFederativaRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class UnidadeFederativaController extends BaseController {

    constructor() {
        super(repository, "unidade federativa", {
            entityNamePlural: "unidades federativas",
            requiredFields: ["descricao", "sigla"]
        });
    }

    /**
     * Busca unidade federativa por descrição exata
     */
    async findOneByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição exata`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const unidadeFederativa = await this.repository.findOneByDescricao(
                descricaoDecodificada
            );

            if (!unidadeFederativa) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa descrição`
                });
            }

            return res.json(unidadeFederativa);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por descrição`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca unidades federativas por descrição (busca parcial)
     */
    async findAllByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const unidadesFederativas = await this.repository.findAllByDescricao(
                descricaoDecodificada
            );

            if (!unidadesFederativas || unidadesFederativas.length === 0) {
                logger.info(`Não foram encontradas ${this.entityNamePlural} com esse padrão`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.OK).json([]);
            }

            return res.json(unidadesFederativas);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por descrição parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca unidades federativas por sigla
     */
    async findBySigla(req, res, next) {
        try {
            const { sigla } = req.params;
            const siglaDecodificada = decodeURIComponent(sigla);

            logger.info(`Buscando ${this.entityName} por sigla`, {
                sigla: siglaDecodificada,
                route: req.originalUrl,
            });

            const unidadesFederativas = await this.repository.findBySigla(
                siglaDecodificada
            );

            if (!unidadesFederativas || unidadesFederativas.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa sigla`, {
                    sigla: siglaDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa sigla`
                });
            }

            return res.json(unidadesFederativas);

        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por sigla`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new UnidadeFederativaController();

module.exports = {
    createUnidadeFederativa: controller.create.bind(controller),
    findAllUnidadesFederativas: controller.findAll.bind(controller),
    findUnidadeFederativaById: controller.findById.bind(controller),
    findUnidadeFederativaByDescricao: controller.findOneByDescricao.bind(controller),
    findUnidadesFederativasByDescricao: controller.findAllByDescricao.bind(controller),
    findUnidadeFederativaBySigla: controller.findBySigla.bind(controller),
    updateUnidadeFederativa: controller.update.bind(controller),
    deleteUnidadeFederativa: controller.delete.bind(controller)
};
