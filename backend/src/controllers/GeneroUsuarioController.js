const BaseController = require("./BaseController");
const repository = require("../repositories/GeneroUsuarioRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class GeneroUsuarioController extends BaseController {

    constructor() {
        super(repository, "gênero de usuário", {
            entityNamePlural: "gêneros de usuário",
            requiredFields: ["descricao"]
        });
    }

    /**
     * Busca gênero por descrição exata
     */
    async findUniqueByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição exata`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const genero = await this.repository.findUniqueByDescricao(
                descricaoDecodificada
            );

            if (!genero) {
                logger.info(`Nenhum ${this.entityName} encontrado com essa descrição`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com essa descrição`
                });
            }

            return res.json(genero);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por descrição`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca gêneros por descrição (busca parcial)
     */
    async findManyByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const generos = await this.repository.findManyByDescricao(
                descricaoDecodificada
            );

            if (!generos || generos.length === 0) {
                logger.info(`Nenhum ${this.entityName} encontrado com essa descrição parcial`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhum ${this.entityName} encontrado com essa descrição parcial`
                });
            }

            return res.json(generos);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por descrição parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new GeneroUsuarioController();

module.exports = {
    create: controller.create.bind(controller),
    findAll: controller.findAll.bind(controller),
    findById: controller.findById.bind(controller),
    findUniqueByDescricao: controller.findUniqueByDescricao.bind(controller),
    findManyByDescricao: controller.findManyByDescricao.bind(controller),
    update: controller.update.bind(controller),
    delete: controller.delete.bind(controller)
};
