const BaseController = require("./BaseController");
const repository = require("../repositories/VeiculoRepository");
const logger = require("../config/logger");

class VeiculoController extends BaseController {
    constructor() {
        super(repository, "veículo", {
            entityNamePlural: "veículos",
            requiredFields: [
                "placa",
                "renavam",
                "ano",
                "marca",
                "modelo",
                "categoriaVeiculoId",
                "cor",
                "portas",
                "motorizacao",
                "tipoCombustivelId",
                "tipoTransmissaoId",
                "tipoDirecaoId",
                "kilometragem",
                "situacaoLicenciamentoId",
                "situacaoVeiculoId",
                "estadoVeiculoId",
                "unidadeId",
            ],
        });
    }

    /**
     * Processa dados antes de criar/atualizar
     * Converte campos numéricos para números
     */
    preprocessData(data) {
        const payload = { ...data };

        // Converter campos numéricos
        if (payload.ano !== undefined) payload.ano = Number(payload.ano);
        if (payload.portas !== undefined) payload.portas = Number(payload.portas);
        if (payload.kilometragem !== undefined)
            payload.kilometragem = Number(payload.kilometragem);
        if (payload.unidadeId !== undefined)
            payload.unidadeId = Number(payload.unidadeId);
        if (payload.tipoCombustivelId !== undefined)
            payload.tipoCombustivelId = Number(payload.tipoCombustivelId);
        if (payload.categoriaVeiculoId !== undefined)
            payload.categoriaVeiculoId = Number(payload.categoriaVeiculoId);
        if (payload.tipoTransmissaoId !== undefined)
            payload.tipoTransmissaoId = Number(payload.tipoTransmissaoId);
        if (payload.tipoDirecaoId !== undefined)
            payload.tipoDirecaoId = Number(payload.tipoDirecaoId);
        if (payload.situacaoLicenciamentoId !== undefined)
            payload.situacaoLicenciamentoId = Number(
                payload.situacaoLicenciamentoId
            );
        if (payload.situacaoVeiculoId !== undefined)
            payload.situacaoVeiculoId = Number(payload.situacaoVeiculoId);
        if (payload.estadoVeiculoId !== undefined)
            payload.estadoVeiculoId = Number(payload.estadoVeiculoId);

        return payload;
    }

    /**
     * Valida campos numéricos
     */
    validateNumericFields(payload, req, res) {
        // Validar campos numéricos principais
        if (
            payload.ano !== undefined &&
            !Number.isInteger(payload.ano)
        ) {
            logger.warn("Campo ano inválido", {
                route: req.originalUrl,
                ano: payload.ano,
            });
            return res
                .status(400)
                .json({ error: "Field ano must be an integer" });
        }

        if (
            payload.portas !== undefined &&
            !Number.isInteger(payload.portas)
        ) {
            logger.warn("Campo portas inválido", {
                route: req.originalUrl,
                portas: payload.portas,
            });
            return res
                .status(400)
                .json({ error: "Field portas must be an integer" });
        }

        if (
            payload.kilometragem !== undefined &&
            !Number.isInteger(payload.kilometragem)
        ) {
            logger.warn("Campo kilometragem inválido", {
                route: req.originalUrl,
                kilometragem: payload.kilometragem,
            });
            return res
                .status(400)
                .json({ error: "Field kilometragem must be an integer" });
        }

        // Validar IDs de relacionamento
        const idFields = [
            "unidadeId",
            "tipoCombustivelId",
            "categoriaVeiculoId",
            "tipoTransmissaoId",
            "tipoDirecaoId",
            "situacaoLicenciamentoId",
            "situacaoVeiculoId",
            "estadoVeiculoId",
        ];

        for (const field of idFields) {
            if (
                payload[field] !== undefined &&
                (!Number.isInteger(payload[field]) || payload[field] < 1)
            ) {
                logger.warn("ID de relacionamento inválido", {
                    route: req.originalUrl,
                    field,
                    value: payload[field],
                });
                return res.status(400).json({
                    error: `Field ${field} must be a valid positive integer`,
                });
            }
        }

        return null; // Sem erros
    }

    /**
     * Sobrescreve create para adicionar validação de campos numéricos
     */
    async create(req, res, next) {
        try {
            // Pré-processar dados
            const payload = this.preprocessData(req.body);

            // Validar campos numéricos
            const validationError = this.validateNumericFields(payload, req, res);
            if (validationError) return validationError;

            // Atualizar req.body com dados processados
            req.body = payload;

            // Chamar método do BaseController
            return await super.create(req, res, next);
        } catch (error) {
            logger.error("Erro ao criar veículo", {
                error: error.message,
                route: req.originalUrl,
            });
            return res.status(500).json({
                error: "Erro ao criar veículo",
                details: error.message,
            });
        }
    }

    /**
     * Sobrescreve findAll para suportar filtro por unidade
     */
    async findAll(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 0;
            const offset = parseInt(req.query.offset) || 0;

            // Filtro por código da unidade
            let unidadeId = null;
            if (req.query.codigoUnidade) {
                unidadeId = Number(req.query.codigoUnidade);
                
                // Validar que codigoUnidade é um número válido
                if (isNaN(unidadeId) || !Number.isInteger(unidadeId) || unidadeId < 1) {
                    logger.warn("Código de unidade inválido na listagem de veículos", {
                        route: req.originalUrl,
                        codigoUnidade: req.query.codigoUnidade,
                    });
                    // Retornar lista vazia ao invés de erro 400
                    return res.json([]);
                }
            }

            const veiculos = await this.repository.getAll(limit, offset, unidadeId);

            return res.json(veiculos);
        } catch (error) {
            logger.error("Erro ao listar veículos", {
                error: error.message,
                route: req.originalUrl,
            });
            return res.status(500).json({
                error: "Erro ao listar veículos",
                details: error.message,
            });
        }
    }

    /**
     * Sobrescreve update para adicionar validação de campos numéricos
     */
    async update(req, res, next) {
        try {
            // Pré-processar dados
            const payload = this.preprocessData(req.body);

            // Validar campos numéricos
            const validationError = this.validateNumericFields(payload, req, res);
            if (validationError) return validationError;

            // Atualizar req.body com dados processados
            req.body = payload;

            // Chamar método do BaseController
            return await super.update(req, res, next);
        } catch (error) {
            logger.error("Erro ao atualizar veículo", {
                error: error.message,
                route: req.originalUrl,
            });
            return res.status(500).json({
                error: "Erro ao atualizar veículo",
                details: error.message,
            });
        }
    }

    /**
     * Busca veículos por situação
     */
    async findBySituacao(req, res) {
        try {
            const { descricao } = req.params;

            // Validar descrição
            if (
                !descricao ||
                typeof descricao !== "string" ||
                descricao.trim() === ""
            ) {
                logger.warn("Descrição de situação inválida", {
                    route: req.originalUrl,
                    descricao,
                });
                return res.status(400).json({
                    error: "O parâmetro descricao deve ser uma string válida",
                });
            }

            const data = await this.repository.getAllBySituacao({
                descricao: descricao.trim().toUpperCase(),
            });

            logger.info("Veículos recuperados por situação", {
                descricao: descricao.toUpperCase(),
                total: data.length,
            });

            return res.json(data);
        } catch (error) {
            logger.error("Erro ao buscar veículos por situação", {
                error: error.message,
                route: req.originalUrl,
            });
            return res.status(500).json({
                error: "Erro ao buscar veículos por situação",
                details: error.message,
            });
        }
    }
}

const controller = new VeiculoController();

module.exports = {
    createVeiculo: controller.create.bind(controller),
    findAllVeiculos: controller.findAll.bind(controller),
    findVeiculoById: controller.findById.bind(controller),
    updateVeiculo: controller.update.bind(controller),
    deleteVeiculo: controller.delete.bind(controller),
    findVeiculosBySituacao: controller.findBySituacao.bind(controller),
};
