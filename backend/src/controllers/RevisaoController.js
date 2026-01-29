const BaseController = require("./BaseController");
const repository = require("../repositories/RevisaoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class RevisaoController extends BaseController {

    constructor() {
        super(repository, "revisão", {
            entityNamePlural: "revisões",
            requiredFields: ["numero", "dataProgramada", "planoEstudoId", "disciplinaId", "topicoId", "situacaoRevisao"]
        });
    }

    /**
     * Cria uma nova revisão
     * Sobrescreve o método do BaseController para tratar erros específicos
     */
    async create(req, res, next) {
        try {
            const data = req.body;

            // Validação dos campos obrigatórios
            if (this.requiredFields && this.requiredFields.length > 0) {
                const camposFaltando = this.requiredFields.filter(
                    (field) => data[field] === undefined || data[field] === null || data[field] === ""
                );

                if (camposFaltando.length > 0) {
                    logger.warn(
                        `Campos obrigatórios ausentes ao criar ${this.entityName}`,
                        {
                            route: req.originalUrl,
                            method: req.method,
                            missingFields: camposFaltando,
                        }
                    );
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: `Campos obrigatórios ausentes: ${camposFaltando.join(", ")}`,
                    });
                }
            }

            const resultado = await this.repository.create(data);

            logger.info(`${this.entityName} criado(a) com sucesso`, {
                id: resultado.id,
                route: req.originalUrl,
            });

            return res.status(HttpStatus.CREATED).json(resultado);
        } catch (error) {
            // Tratamento específico para violação de constraint única (P2002)
            if (error.code === "P2002") {
                logger.warn(`Tentativa de criar ${this.entityName} duplicado(a)`, {
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.CONFLICT).json({
                    error: `Já existe uma revisão com este número para este tópico.`,
                });
            }

            // Tratamento para foreign key não encontrada (P2003)
            if (error.code === "P2003") {
                const campo = error.meta?.field_name || "relacionado";
                logger.warn(
                    `Registro relacionado não encontrado ao criar ${this.entityName}`,
                    {
                        error: error.message,
                        meta: error.meta,
                        field_name: campo,
                    }
                );

                let mensagem = "Registro relacionado não encontrado";
                if (campo.includes("plano")) {
                    mensagem = "Plano de estudo não encontrado";
                } else if (campo.includes("disciplina")) {
                    mensagem = "Disciplina não encontrada";
                } else if (campo.includes("topico")) {
                    mensagem = "Tópico não encontrado";
                }

                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: mensagem,
                });
            }

            // Log do erro e passa para o middleware de erro
            logger.error(`Erro ao criar ${this.entityName}`, {
                error: error.message,
                data: req.body,
                file: "BaseRepository.js",
                line: 47,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões de um plano de estudo
     */
    async findManyByPlanoEstudoId(req, res, next) {
        try {
            const { planoEstudoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do plano de estudo`, {
                planoEstudoId: parseInt(planoEstudoId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByPlanoEstudoId(planoEstudoId);

            // Retorna array vazio se não houver revisões (não é erro)
            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este plano de estudo`, {
                    planoEstudoId: parseInt(planoEstudoId),
                    route: req.originalUrl,
                });
            }

            return res.json(revisoes || []);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por plano de estudo`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões de uma disciplina
     */
    async findManyByDisciplinaId(req, res, next) {
        try {
            const { disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} da disciplina`, {
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByDisciplinaId(disciplinaId);

            // Retorna array vazio se não houver revisões (não é erro)
            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para esta disciplina`, {
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
            }

            return res.json(revisoes || []);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por disciplina`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as revisões de um tópico
     */
    async findManyByTopicoId(req, res, next) {
        try {
            const { topicoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do tópico`, {
                topicoId: parseInt(topicoId),
                route: req.originalUrl,
            });

            const revisoes = await this.repository.findManyByTopicoId(topicoId);

            // Retorna array vazio se não houver revisões (não é erro)
            if (!revisoes || revisoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este tópico`, {
                    topicoId: parseInt(topicoId),
                    route: req.originalUrl,
                });
            }

            return res.json(revisoes || []);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por tópico`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new RevisaoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByPlanoEstudoId: controller.findManyByPlanoEstudoId.bind(controller),
    findManyByDisciplinaId: controller.findManyByDisciplinaId.bind(controller),
    findManyByTopicoId: controller.findManyByTopicoId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
