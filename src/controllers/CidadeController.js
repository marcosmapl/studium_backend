const BaseController = require("./BaseController");
const repository = require("../repositories/CidadeRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");
const { Prisma } = require("@prisma/client");

class CidadeController extends BaseController {

    constructor() {
        super(repository, "cidade", {
            entityNamePlural: "cidades",
            requiredFields: ["descricao", "unidadeFederativaId"]
        });
    }

    /**
     * Sobrescreve o método create para tratar melhor a constraint única composta
     */
    async create(req, res, next) {
        try {
            const { descricao, unidadeFederativaId } = req.body;

            // Validação de campos obrigatórios
            const missingFields = this.requiredFields.filter((field) => !req.body[field]);

            if (missingFields.length > 0) {
                logger.warn(`Campos obrigatórios ausentes ao criar ${this.entityName}`, {
                    route: req.originalUrl,
                    method: "POST",
                    missingFields,
                    file: "BaseController.js",
                    line: 54,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Campos obrigatórios ausentes",
                    missingFields,
                });
            }

            const cidade = await this.repository.create({
                descricao,
                unidadeFederativaId: parseInt(unidadeFederativaId),
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
                        descricao: req.body.descricao,
                        unidadeFederativaId: req.body.unidadeFederativaId,
                    });
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe uma cidade com o nome "${req.body.descricao}" nesta unidade federativa`,
                    });
                }
                if (error.code === "P2003") {
                    logger.warn("Unidade federativa não encontrada ao criar cidade", {
                        route: req.originalUrl,
                        unidadeFederativaId: req.body.unidadeFederativaId,
                    });
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: "Unidade federativa não encontrada",
                    });
                }
            }
            next(error);
        }
    }

    /**
     * Busca cidade por descrição e Unidade Federativa
     */
    async findByDescricaoAndUF(req, res, next) {
        try {
            const { descricao, unidadeFederativaId } = req.params;
            const descricaoDecodificado = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição e UF`, {
                descricao: descricaoDecodificado,
                unidadeFederativaId,
                route: req.originalUrl,
            });

            const cidade = await this.repository.findByDescricaoAndUF(
                descricaoDecodificado,
                unidadeFederativaId
            );

            if (!cidade) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição e UF`, {
                    descricao: descricaoDecodificado,
                    unidadeFederativaId,
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
                logger.info(`Não foram encontradas ${this.entityName} essa descrição parcial`, {
                    descricao: descricaoDecodificado,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontradas ${this.entityName} essa descrição parcial`
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
            const { unidadeFederativaId } = req.params;

            logger.info(`Buscando ${this.entityNamePlural} por Unidade Federativa`, {
                unidadeFederativaId,
                route: req.originalUrl,
            });

            const cidades = await this.repository.findManyByUnidadeFederativa(
                Number(unidadeFederativaId)
            );

            if (!cidades || cidades.length === 0) {
                logger.info(`Não foram encontradas ${this.entityName} para essa Unidade Federativa`, {
                    unidadeFederativaId,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Não foram encontradas ${this.entityName} para essa Unidade Federativaa`
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
}

const controller = new CidadeController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findByDescricaoAndUF: controller.findByDescricaoAndUF.bind(controller),
    findManyByDescricao: controller.findManyByDescricao.bind(controller),
    findManyByUnidadeFederativa: controller.findManyByUnidadeFederativa.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
