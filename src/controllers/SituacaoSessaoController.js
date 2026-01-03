const BaseController = require("./BaseController");
const repository = require("../repositories/SituacaoSessaoRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class SituacaoSessaoController extends BaseController {

    constructor() {
        super(repository, "situação de sessão", {
            entityNamePlural: "situações de sessão",
            requiredFields: ["descricao"]
        });
        
        // Bind de métodos customizados para preservar o contexto
        this.findUniqueByDescricao = this.findUniqueByDescricao.bind(this);
        this.findManyByDescricao = this.findManyByDescricao.bind(this);
    }

    /**
     * Busca situação de sessão por descrição
     */
    async findUniqueByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityName} por descrição`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const situacaoEncontrada = await this.repository.findUniqueByDescricao(
                descricaoDecodificada
            );

            if (!situacaoEncontrada) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa descrição`
                });
            }

            return res.json(situacaoEncontrada);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityName} por descrição`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca situação por descrição (busca parcial)
     */
    async findManyByDescricao(req, res, next) {
        try {
            const { descricao } = req.params;
            const descricaoDecodificada = decodeURIComponent(descricao);

            logger.info(`Buscando ${this.entityNamePlural} por descrição parcial`, {
                descricao: descricaoDecodificada,
                route: req.originalUrl,
            });

            const situacoes = await this.repository.findManyByDescricao(
                descricaoDecodificada
            );

            if (!situacoes || situacoes.length === 0) {
                logger.info(`Nenhuma ${this.entityName} encontrada com essa descrição parcial`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa descrição parcial`
                });
            }

            return res.json(situacoes);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.entityNamePlural} por descrição parcial`, {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

}

module.exports = new SituacaoSessaoController();
