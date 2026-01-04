const BaseController = require("./BaseController");
const DisciplinaPlanejamentoRepository = require("../repositories/DisciplinaPlanejamentoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class DisciplinaPlanejamentoController extends BaseController {

    constructor() {
        super(new DisciplinaPlanejamentoRepository(), "disciplina de planejamento", {
            entityNamePlural: "disciplinas de planejamento",
            requiredFields: ["importancia", "conhecimento", "horasSemanais", "planejamentoId", "disciplinaId"]
        });
    }

    /**
     * Cria uma nova disciplina de planejamento com validação de constraint única
     */
    async create(req, res, next) {
        try {
            const data = req.body;

            logger.info(`Criando novo ${this.entityName}`, {
                data,
                route: req.originalUrl,
            });

            // Validação de campos obrigatórios
            if (this.requiredFields && this.requiredFields.length > 0) {
                const camposFaltando = this.requiredFields.filter(
                    (field) => !data[field]
                );

                if (camposFaltando.length > 0) {
                    logger.warn(
                        `Campos obrigatórios ausentes ao criar ${this.entityName}`,
                        { camposFaltando }
                    );
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: `Campos obrigatórios ausentes: ${camposFaltando.join(", ")}`,
                    });
                }
            }

            const resultado = await this.repository.create(data);

            logger.info(`${this.entityName} criado com sucesso`, {
                id: resultado.id,
                route: req.originalUrl,
            });

            return res.status(HttpStatus.CREATED).json(resultado);
        } catch (error) {
            // Tratamento específico para violação de constraint única
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    logger.warn(
                        `Tentativa de criar ${this.entityName} duplicado(a)`,
                        {
                            error: error.message,
                            meta: error.meta,
                            planejamentoId: req.body.planejamentoId,
                            disciplinaId: req.body.disciplinaId,
                        }
                    );
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe uma disciplina de planejamento para esta combinação de planejamento e disciplina`,
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
                    if (campo.includes("planejamento")) {
                        mensagem = "Planejamento não encontrado";
                    } else if (campo.includes("disciplina")) {
                        mensagem = "Disciplina não encontrada";
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
