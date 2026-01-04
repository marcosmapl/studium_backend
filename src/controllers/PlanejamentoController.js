const BaseController = require("./BaseController");
const PlanejamentoRepository = require("../repositories/PlanejamentoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class PlanejamentoController extends BaseController {

    constructor() {
        super(new PlanejamentoRepository(), "planejamento", {
            entityNamePlural: "planejamentos",
            requiredFields: ["dataInicio", "ativo", "totalHorasSemana", "quantidadeDias", "planoEstudoId"]
        });
    }

    /**
     * Busca todos os planejamentos de um plano de estudo
     */
    async findManyByPlanoEstudoId(req, res, next) {
        try {
            const { planoEstudoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do plano de estudo`, {
                planoEstudoId: parseInt(planoEstudoId),
                route: req.originalUrl,
            });

            const planejamentos = await this.repository.findManyByPlanoEstudoId(planoEstudoId);

            if (!planejamentos || planejamentos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para este plano de estudo`, {
                    planoEstudoId: parseInt(planoEstudoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado para este plano de estudo`
                });
            }

            return res.json(planejamentos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por plano de estudo`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca planejamentos ativos
     */
    async findManyByAtivo(req, res, next) {
        try {
            logger.info(`Buscando ${this.entityNamePlural} ativos`, {
                route: req.originalUrl,
            });

            const planejamentos = await this.repository.findManyByAtivo();

            if (!planejamentos || planejamentos.length === 0) {
                logger.info(`Nenhum ${this.entityName} ativo encontrado`, {
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} ativo encontrado`
                });
            }

            return res.json(planejamentos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} ativos`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

module.exports = PlanejamentoController;
