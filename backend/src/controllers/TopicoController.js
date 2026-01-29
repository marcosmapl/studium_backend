const BaseController = require("./BaseController");
const repository = require("../repositories/TopicoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class TopicoController extends BaseController {

    constructor() {
        super(repository, "tópico", {
            entityNamePlural: "tópicos",
            requiredFields: ["titulo", "ordem", "disciplinaId"]
        });
    }

    /**
     * Cria um novo tópico com validação de constraint única
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
                    const titulo = req.body.titulo;
                    logger.warn(
                        `Tentativa de criar ${this.entityName} duplicado(a)`,
                        {
                            error: error.message,
                            meta: error.meta,
                            titulo,
                        }
                    );
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe um tópico com o título "${titulo}" nesta disciplina`,
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
     * Busca tópico por título
     */
    async findUniqueByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityName} por título`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const topico = await this.repository.findUniqueByTitulo(
                tituloDecodificado
            );

            if (!topico) {
                logger.info(`Nenhum ${this.entityName} encontrado com esse título`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse título`
                });
            }

            return res.json(topico);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por título`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca tópicos por título (busca parcial)
     */
    async findManyByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityNamePlural} por título parcial`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const topicos = await this.repository.findManyByTitulo(
                tituloDecodificado
            );

            // Retorna array vazio se não houver tópicos (não é erro)
            if (!topicos || topicos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado com esse padrão`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
            }

            return res.json(topicos || []);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por título parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todos os tópicos de uma disciplina
     */
    async findManyByDisciplinaId(req, res, next) {
        try {
            const { disciplinaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} da disciplina`, {
                disciplinaId: parseInt(disciplinaId),
                route: req.originalUrl,
            });

            const topicos = await this.repository.findManyByDisciplinaId(disciplinaId);

            // Retorna array vazio se não houver tópicos (não é erro)
            if (!topicos || topicos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado para esta disciplina`, {
                    disciplinaId: parseInt(disciplinaId),
                    route: req.originalUrl,
                });
            }

            return res.json(topicos || []);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por disciplina`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }


}

const controller = new TopicoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByTitulo: controller.findUniqueByTitulo.bind(controller),
    findManyByTitulo: controller.findManyByTitulo.bind(controller),
    findManyByDisciplinaId: controller.findManyByDisciplinaId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
