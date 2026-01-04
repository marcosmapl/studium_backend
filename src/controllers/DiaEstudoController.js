const BaseController = require("./BaseController");
const DiaEstudoRepository = require("../repositories/DiaEstudoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class DiaEstudoController extends BaseController {

    constructor() {
        super(new DiaEstudoRepository(), "dia de estudo", {
            entityNamePlural: "dias de estudo",
            requiredFields: ["diaSemana", "horasPlanejadas", "planejamentoId"]
        });
    }

    /**
     * Busca todos os dias de estudo de um planejamento
     */
    async findManyByPlanejamentoId(req, res, next) {
        try {
            const { planejamentoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do planejamento`, {
                planejamentoId: parseInt(planejamentoId),
                route: req.originalUrl,
            });

            const dias = await this.repository.findManyByPlanejamentoId(planejamentoId);

            if (!dias || dias.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para este planejamento`, {
                    planejamentoId: parseInt(planejamentoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado para este planejamento`
                });
            }

            return res.json(dias);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por planejamento`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca dias de estudo por dia da semana
     */
    async findManyByDiaSemana(req, res, next) {
        try {
            const { diaSemana } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do dia da semana`, {
                diaSemana: parseInt(diaSemana),
                route: req.originalUrl,
            });

            const dias = await this.repository.findManyByDiaSemana(diaSemana);

            if (!dias || dias.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para este dia da semana`, {
                    diaSemana: parseInt(diaSemana),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado para este dia da semana`
                });
            }

            return res.json(dias);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por dia da semana`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new DiaEstudoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByPlanejamentoId: controller.findManyByPlanejamentoId.bind(controller),
    findManyByDiaSemana: controller.findManyByDiaSemana.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
