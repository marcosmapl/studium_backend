const BaseController = require("./BaseController");
const AlocacaoHorarioRepository = require("../repositories/AlocacaoHorarioRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class AlocacaoHorarioController extends BaseController {
  constructor() {
    super(new AlocacaoHorarioRepository(), "alocação de horário", {
      requiredFields: [
        "horasAlocadas",
        "ordem",
        "diaEstudoId",
        "disciplinaCronogramaId",
      ],
    });
  }

  /**
   * Busca todas as alocações de horário de um dia de estudo específico
   */
  async findManyByDiaEstudoId(req, res, next) {
    try {
      const { diaEstudoId } = req.params;

      logger.info(`Buscando alocações de horário do dia de estudo`, {
        diaEstudoId: parseInt(diaEstudoId),
        route: req.originalUrl,
      });

      const alocacoes = await this.repository.findManyByDiaEstudoId(
        diaEstudoId
      );

      if (!alocacoes || alocacoes.length === 0) {
        logger.info(`Nenhuma ${this.entityName} encontrada para este dia de estudo`, {
          diaEstudoId: parseInt(diaEstudoId),
          route: req.originalUrl,
        });
        return res.status(HttpStatus.NOT_FOUND).json({
          error: `Nenhuma ${this.entityName} encontrada para este dia de estudo`,
        });
      }

      return res.json(alocacoes);
    } catch (error) {
      logger.error(`Erro ao buscar alocações de horário por dia de estudo`, {
        error: error.message,
        stack: error.stack,
      });

      next(error);
    }
  }

  /**
   * Busca todas as alocações de horário de uma disciplina de planejamento específica
   */
  async findManyByDisciplinaCronogramaId(req, res, next) {
    try {
      const { disciplinaCronogramaId } = req.params;

      logger.info(`Buscando alocações de horário da disciplina de planejamento`, {
        disciplinaCronogramaId: parseInt(disciplinaCronogramaId),
        route: req.originalUrl,
      });

      const alocacoes =
        await this.repository.findManyByDisciplinaCronogramaId(
          disciplinaCronogramaId
        );

      if (!alocacoes || alocacoes.length === 0) {
        logger.info(`Nenhuma ${this.entityName} encontrada para esta disciplina de planejamento`, {
          disciplinaCronogramaId: parseInt(disciplinaCronogramaId),
          route: req.originalUrl,
        });
        return res.status(HttpStatus.NOT_FOUND).json({
          error: `Nenhuma ${this.entityName} encontrada para esta disciplina de planejamento`,
        });
      }

      return res.json(alocacoes);
    } catch (error) {
      logger.error(`Erro ao buscar alocações de horário por disciplina de planejamento`, {
        error: error.message,
        stack: error.stack,
      });

      next(error);
    }
  }
}

module.exports = AlocacaoHorarioController;
