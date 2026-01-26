const BaseController = require("./BaseController");
const repository = require("../repositories/BlocoEstudoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class BlocoEstudoController extends BaseController {

    constructor() {
        super(repository, "bloco de estudo", {
            entityNamePlural: "blocos de estudo",
            requiredFields: ["diaSemana", "ordem", "totalHorasPlanejadas", "planoEstudoId", "disciplinaId"]
        });
    }

    /**
     * Cria um novo bloco de estudo com validação de constraint única
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
                            ordem: req.body.ordem,
                            diaSemana: req.body.diaSemana,
                            planoEstudoId: req.body.planoEstudoId,
                            disciplinaId: req.body.disciplinaId,
                        }
                    );
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe um dia de estudo para ${diaSemanaTexto} neste plano de estudo e disciplina.`,
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
                    if (campo.includes("plano")) {
                        mensagem = "Plano de estudo não encontrado";
                    }
                    if (campo.includes("disciplina")) {
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
     * Busca todos os blocos de estudo para um plano de estudo e disciplina
     */
    async findManyByDisciplinaPlano(req, res, next) {
        try {
            const { planoEstudoId, disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} para um plano de estudo e disciplina`, {
                planoEstudoId: parseInt(planoEstudoId),
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const blocos = await this.repository.findManyByDisciplinaPlano(planoEstudoId, disciplinaId);

            if (!blocos || blocos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para este plano de estudo e disciplina.`, {
                    planoEstudoId: parseInt(planoEstudoId),
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado para este plano de estudo e disciplina.`,
                });
            }

            return res.json(blocos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por planejamento`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

}

const controller = new BlocoEstudoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByDisciplinaPlano: controller.findManyByDisciplinaPlano.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
