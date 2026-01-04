const BaseController = require("./BaseController");
const AlocacaoHorarioRepository = require("../repositories/AlocacaoHorarioRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

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
   * Cria uma nova alocação de horário com validações
   */
  async create(req, res, next) {
    try {
      const { horasAlocadas, ordem } = req.body;

      // Validações de valores
      if (horasAlocadas !== undefined && horasAlocadas <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "horasAlocadas deve ser maior que 0",
        });
      }

      if (ordem !== undefined && ordem <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "ordem deve ser maior que 0",
        });
      }

      // Chama o método create da classe base
      return await super.create(req, res, next);
    } catch (error) {
      // Tratamento específico para violação de constraint única
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          logger.warn(
            `Tentativa de criar ${this.entityName} duplicado(a)`,
            {
              error: error.message,
              meta: error.meta,
              diaEstudoId: req.body.diaEstudoId,
              disciplinaCronogramaId: req.body.disciplinaCronogramaId,
            }
          );
          return res.status(HttpStatus.CONFLICT).json({
            error: `Já existe uma alocação de horário para esta combinação de dia de estudo e disciplina de planejamento`,
          });
        }

        // Tratamento para foreign key não encontrada
        if (error.code === "P2003") {
          const campo = error.meta?.field_name || "relacionado";
          logger.warn(
            `Registro relacionado não encontrado ao criar ${this.entityName}`,
            {
              error: error.message,
              meta: error.meta,
            }
          );

          let mensagem = "Registro relacionado não encontrado";
          if (campo.includes("dia_estudo")) {
            mensagem = "Dia de estudo não encontrado";
          } else if (campo.includes("disciplina_cronograma")) {
            mensagem = "Disciplina de planejamento não encontrada";
          }

          return res.status(HttpStatus.BAD_REQUEST).json({
            error: mensagem,
          });
        }
      }

      logger.error(`Erro ao criar ${this.entityName}`, {
        error: error.message,
        stack: error.stack,
      });
      next(error);
    }
  }

  /**
   * Atualiza uma alocação de horário com validações
   */
  async update(req, res) {
    try {
      const { horasAlocadas, ordem } = req.body;

      // Validações de valores
      if (horasAlocadas !== undefined && horasAlocadas <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "horasAlocadas deve ser maior que 0",
        });
      }

      if (ordem !== undefined && ordem <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "ordem deve ser maior que 0",
        });
      }

      // Chama o método update da classe base
      return await super.update(req, res);
    } catch (error) {
      logger.error(`Erro ao atualizar ${this.entityName}`, {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
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
