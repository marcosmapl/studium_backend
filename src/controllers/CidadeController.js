const BaseController = require("./BaseController");
const repository = require("../repositories/CidadeRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class CidadeController extends BaseController {

    constructor() {
        super(repository, "cidade", {
            entityNamePlural: "cidades",
            requiredFields: ["cidade", "unidadeFederativaId"]
        });
    }

    /**
     * Busca cidades por nome (busca parcial)
     */
    async findByCidade(req, res, next) {
        try {
            const { nome: cidade } = req.params;
            const cidadeDecodificado = decodeURIComponent(cidade);

            logger.info("Buscando cidade por nome da cidade", {
                nome: cidadeDecodificado,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findByCidade(
                cidadeDecodificado
            );

            if (!cidade) {
                logger.info("Nenhuma cidade encontrada com o nome", {
                    nome: cidadeDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse nome`
                });
            }

            return res.json(cidade);
        } catch (error) {
            logger.error("Erro ao buscar cidade por nome", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca cidades de uma Unidade Federativa
     */
    async findByUnidadeFederativa(req, res, next) {
        try {
            const { unidadeFederativaId } = req.params;

            logger.info("Buscando cidades por Unidade Federativa", {
                unidadeFederativaId,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findByUnidadeFederativa(
                Number(unidadeFederativaId)
            );

            if (!cidades || cidades.length === 0) {
                logger.info("Nenhuma cidade encontrada para a Unidade Federativa", {
                    unidadeFederativaId,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para essa Unidade Federativa`
                });
            }

            return res.json(cidades);

        } catch (error) {
            logger.error("Erro ao buscar cidades por Unidade Federativa", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new CidadeController();

module.exports = {
    createCidade: controller.create.bind(controller),
    findAllCidades: controller.findAll.bind(controller),
    findCidadeById: controller.findById.bind(controller),
    findCidadeByCidade: controller.findByCidade.bind(controller),
    findCidadesByUnidadeFederativa: controller.findByUnidadeFederativa.bind(controller),
    updateCidade: controller.update.bind(controller),
    deleteCidade: controller.delete.bind(controller)
};
