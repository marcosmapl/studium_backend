const BaseController = require("./BaseController");
const DiaEstudoRepository = require("../repositories/DiaEstudoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class DiaEstudoController extends BaseController {

    constructor() {
        super(new DiaEstudoRepository(), "dia de estudo", {
            entityNamePlural: "dias de estudo",
            requiredFields: ["diaSemana", "horasPlanejadas", "planejamentoId"]
        });
    }

    /**
     * Cria um novo dia de estudo com validação de constraint única
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
                    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                    const diaSemanaTexto = diasSemana[req.body.diaSemana] || req.body.diaSemana;
                    logger.warn(
                        `Tentativa de criar ${this.entityName} duplicado(a)`,
                        {
                            error: error.message,
                            meta: error.meta,
                            diaSemana: req.body.diaSemana,
                            planejamentoId: req.body.planejamentoId,
                        }
                    );
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe um dia de estudo para ${diaSemanaTexto} neste planejamento`,
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
