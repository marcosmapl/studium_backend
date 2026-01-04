const BaseController = require("./BaseController");
const DisciplinaPlanejamentoRepository = require("../repositories/DisciplinaPlanejamentoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class DisciplinaPlanejamentoController extends BaseController {

    constructor() {
        super(new DisciplinaPlanejamentoRepository(), "disciplina de planejamento", {
            entityNamePlural: "disciplinas de planejamento",
            requiredFields: ["importancia", "conhecimento", "prioridade", "horasSemanais", "percentualCarga", "planejamentoId", "disciplinaId"]
        });
    }

    /**
     * Busca todas as disciplinas de um planejamento
     */
    async findManyByPlanejamentoId(req, res, next) {
        try {
            const { planejamentoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do planejamento`, {
                planejamentoId: parseInt(planejamentoId),
                route: req.originalUrl,
            });

            const disciplinas = await this.repository.findManyByPlanejamentoId(planejamentoId);

            if (!disciplinas || disciplinas.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este planejamento`, {
                    planejamentoId: parseInt(planejamentoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este planejamento`
                });
            }

            return res.json(disciplinas);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por planejamento`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todos os planejamentos de uma disciplina
     */
    async findManyByDisciplinaId(req, res, next) {
        try {
            const { disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} da disciplina`, {
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const planejamentos = await this.repository.findManyByDisciplinaId(disciplinaId);

            if (!planejamentos || planejamentos.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta disciplina`, {
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para esta disciplina`
                });
            }

            return res.json(planejamentos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por disciplina`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new DisciplinaPlanejamentoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByPlanejamentoId: controller.findManyByPlanejamentoId.bind(controller),
    findManyByDisciplinaId: controller.findManyByDisciplinaId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
