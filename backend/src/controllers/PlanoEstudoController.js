const BaseController = require("./BaseController");
const repository = require("../repositories/PlanoEstudoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class PlanoEstudoController extends BaseController {

    constructor() {
        super(repository, "plano de estudo", {
            entityNamePlural: "planos de estudo",
            requiredFields: ["titulo", "usuarioId", "situacaoId"]
        });
    }

    /**
     * Cria um novo plano de estudo com validação de constraint única
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
                        error: `Já existe um plano de estudo com o título "${titulo}" para este usuário`,
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
                    if (campo.includes("usuario")) {
                        mensagem = "Usuário não encontrado";
                    } else if (campo.includes("situacao")) {
                        mensagem = "Situação não encontrada";
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
     * Busca plano de estudo por título
     */
    async findUniqueByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityName} por título`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const grupoEncontrado = await this.repository.findUniqueByTitulo(
                tituloDecodificado
            );

            if (!grupoEncontrado) {
                logger.info("Nenhum plano de estudo encontrado com esse título", {
                    info: tituloDecodificado,
                    titulo: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com esse título`
                });
            }

            return res.json(grupoEncontrado);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por título`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca planos de estudo por título (busca parcial)
     */
    async findManyByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityNamePlural} por título parcial`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const planos = await this.repository.findManyByTitulo(
                tituloDecodificado
            );

            if (!planos || planos.length === 0) {
                logger.info(`Não foram encontrados ${this.entityNamePlural} com esse padrão`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontrados ${this.entityNamePlural} com esse padrão`
                });
            }

            return res.json(planos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por título parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca planos de estudo por ID de usuário
     */
    async findManyByUsuarioId(req, res, next) {
        try {
            const { usuarioId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por ID de usuário`, {
                usuarioId: usuarioId,
                route: req.originalUrl,
            });

            const planos = await this.repository.findManyByUsuarioId(
                usuarioId
            );

            if (!planos || planos.length === 0) {
                logger.info(`Não foram encontrados ${this.entityNamePlural} para esse ID de usuário`, {
                    usuarioId: usuarioId,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontrados ${this.entityNamePlural} para esse ID de usuário`
                });
            }

            return res.json(planos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por ID de usuário`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new PlanoEstudoController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByTitulo: controller.findUniqueByTitulo.bind(controller),
    findManyByTitulo: controller.findManyByTitulo.bind(controller),
    findManyByUsuarioId: controller.findManyByUsuarioId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
