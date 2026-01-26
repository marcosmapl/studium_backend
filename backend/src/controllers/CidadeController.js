const BaseController = require("./BaseController");
const repository = require("../repositories/CidadeRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class CidadeController extends BaseController {

    constructor() {
        super(repository, "cidade", {
            entityNamePlural: "cidades",
            requiredFields: ["descricao", "unidadeFederativa"]
        });
    }

    /**
     * Sobrescreve o método create para tratar melhor a constraint única composta
     */
    async create(req, res, next) {
        const { descricao, unidadeFederativa } = req.body;
        const descricaoDecodificado = decodeURIComponent(descricao);

        try {
            // Validação de campos obrigatórios
            const missingFields = this.requiredFields.filter((field) => !req.body[field]);

            if (missingFields.length > 0) {
                logger.warn(`Campos obrigatórios ausentes ao criar ${this.entityName}`, {
                    route: req.originalUrl,
                    missingFields,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Campos obrigatórios ausentes",
                    missingFields,
                });
            }

            const cidade = await this.repository.create({
                descricao: descricaoDecodificado,
                unidadeFederativa: unidadeFederativa,
            });

            logger.info(`${this.entityName} criado(a) com sucesso`, {
                id: cidade.id,
                route: req.originalUrl,
            });

            return res.status(HttpStatus.CREATED).json(cidade);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    logger.warn(`Tentativa de criar ${this.entityName} duplicada`, {
                        route: req.originalUrl,
                        descricao: descricaoDecodificado,
                        unidadeFederativa: req.body.unidadeFederativa,
                    });
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe uma cidade com o nome "${req.body.descricao}" nesta unidade federativa`,
                    });
                }
            }
            next(error);
        }
    }

    /**
     * Busca cidades por descrição (busca parcial)
     */
    async findManyByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificado = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificado,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findManyByDescricao(
                descricaoDecodificado
            );

            if (!cidades || cidades.length === 0) {
                logger.info(`Não foram encontradas ${this.entityNamePlural} com essa descrição parcial`, {
                    descricao: descricaoDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontradas ${this.entityNamePlural} com essa descrição parcial`
                });
            }

            return res.json(cidades);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por descrição parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca cidades de uma Unidade Federativa
     */
    async findManyByUnidadeFederativa(req, res, next) {
        try {
            const { unidadeFederativa } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por Unidade Federativa`, {
                unidadeFederativa,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findManyByUnidadeFederativa(
                unidadeFederativa
            );

            if (!cidades || cidades.length === 0) {
                logger.info(`Não foram encontradas ${this.entityNamePlural} para essa Unidade Federativa`, {
                    unidadeFederativa,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontradas ${this.entityNamePlural} para essa Unidade Federativa`
                });
            }

            return res.json(cidades);

        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por Unidade Federativa`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca cidade por descrição e Unidade Federativa
     */
    async findByDescricaoAndUF(req, res, next) {
        try {
            const { descricao, unidadeFederativa } = req.params;
            const descricaoDecodificado = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição e UF`, {
                descricao: descricaoDecodificado,
                unidadeFederativa,
                route: req.originalUrl,
            });

            const cidade = await this.repository.findByDescricaoAndUF(
                descricaoDecodificado,
                unidadeFederativa
            );

            if (!cidade) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição e UF`, {
                    descricao: descricaoDecodificado,
                    unidadeFederativa,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa descrição e UF`
                });
            }

            return res.json(cidade);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por descrição e UF`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new CidadeController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findManyByDescricao: controller.findManyByDescricao.bind(controller),
    findManyByUnidadeFederativa: controller.findManyByUnidadeFederativa.bind(controller),
    findByDescricaoAndUF: controller.findByDescricaoAndUF.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
