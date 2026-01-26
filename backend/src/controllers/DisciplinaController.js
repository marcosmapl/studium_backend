const BaseController = require("./BaseController");
const repository = require("../repositories/DisciplinaRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class DisciplinaController extends BaseController {

    constructor() {
        super(repository, "disciplina", {
            entityNamePlural: "disciplinas",
            requiredFields: ["titulo", "planoId"]
        });
    }

    /**
     * Sobrescreve o método create para tratar melhor a constraint única composta
     */
    async create(req, res, next) {
        try {
            // Validação de campos obrigatórios
            const missingFields = this.requiredFields.filter((field) => !req.body[field]);

            if (missingFields.length > 0) {
                logger.warn(`Campos obrigatórios ausentes ao criar ${this.entityName}`, {
                    route: req.originalUrl,
                    method: "POST",
                    missingFields,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Campos obrigatórios ausentes",
                    missingFields,
                });
            }

            const { titulo, cor, concluido, importancia, conhecimento, horasSemanais, planoId } = req.body;

            const disciplina = await this.repository.create({
                titulo,
                cor,
                concluido: concluido !== undefined ? concluido : false,
                importancia: importancia !== undefined ? parseInt(importancia) : 1,
                conhecimento: conhecimento !== undefined ? parseInt(conhecimento) : 0,
                horasSemanais: horasSemanais !== undefined ? parseFloat(horasSemanais) : 0.0,
                planoId: parseInt(planoId),
            });

            logger.info(`${this.entityName} criado(a) com sucesso`, {
                id: disciplina.id,
                route: req.originalUrl,
            });

            return res.status(HttpStatus.CREATED).json(disciplina);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    logger.warn(`Tentativa de criar ${this.entityName} duplicada`, {
                        route: req.originalUrl,
                        titulo: req.body.titulo,
                        planoId: req.body.planoId,
                    });
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe uma disciplina com o título "${req.body.titulo}" neste plano de estudo`,
                    });
                }
                if (error.code === "P2003") {
                    logger.warn("Plano de estudo não encontrado ao criar disciplina", {
                        route: req.originalUrl,
                        planoId: req.body.planoId,
                    });
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: "Plano de estudo não encontrado",
                    });
                }
            }
            next(error);
        }
    }

    /**
     * Busca disciplina por título
     */
    async findUniqueByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityName} por título`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const disciplina = await this.repository.findUniqueByTitulo(
                tituloDecodificado
            );

            if (!disciplina) {
                logger.info(`Nenhuma ${this.entityName} encontrada com esse título`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse título`
                });
            }

            return res.json(disciplina);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por título`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca disciplinas por título (busca parcial)
     */
    async findManyByTitulo(req, res, next) {
        try {
            const { titulo } = req.params;
            const tituloDecodificado = decodeURIComponent(titulo);

            logger.info(`Buscando ${this.entityNamePlural} por título parcial`, {
                titulo: tituloDecodificado,
                route: req.originalUrl,
            });

            const disciplinas = await this.repository.findManyByTitulo(
                tituloDecodificado
            );

            if (!disciplinas || disciplinas.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada com esse padrão`, {
                    titulo: tituloDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse padrão`
                });
            }

            return res.json(disciplinas);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por título parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca todas as disciplinas de um plano de estudo
     */
    async findManyByPlanoId(req, res, next) {
        try {
            const { planoId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} do plano de estudo`, {
                planoId: parseInt(planoId),
                route: req.originalUrl,
            });

            const disciplinas = await this.repository.findManyByPlanoId(parseInt(planoId));

            if (!disciplinas || disciplinas.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada para este plano de estudo`, {
                    planoId: parseInt(planoId),
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada para este plano de estudo`
                });
            }

            return res.json(disciplinas);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por plano de estudo`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new DisciplinaController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByTitulo: controller.findUniqueByTitulo.bind(controller),
    findManyByTitulo: controller.findManyByTitulo.bind(controller),
    findManyByPlanoId: controller.findManyByPlanoId.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
