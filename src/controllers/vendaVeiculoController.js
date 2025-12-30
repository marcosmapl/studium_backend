const BaseController = require("./BaseController");
const repository = require("../repositories/VendaVeiculoRepository");
const logger = require("../config/logger");
const { Prisma } = require("@prisma/client");

class VendaVeiculoController extends BaseController {
    constructor() {
        super(repository, "venda de veículo", {
            entityNamePlural: "vendas de veículo",
            requiredFields: [
                "dataVenda",
                "valorVenda",
                "veiculoId",
                "clienteId",
                "usuarioId",
                "tipoVendaId",
                "situacaoVendaId",
            ],
        });
    }

    /**
     * Processa dados antes de criar/atualizar
     * Converte campos para tipos apropriados
     */
    preprocessData(data) {
        const payload = { ...data };

        // Converter data
        if (payload.dataVenda) {
            payload.dataVenda = new Date(payload.dataVenda);
        }

        // Converter campos numéricos decimais
        if (payload.valorVenda !== undefined) {
            payload.valorVenda = parseFloat(payload.valorVenda);
        }
        if (payload.valorEntrada !== undefined) {
            payload.valorEntrada = parseFloat(payload.valorEntrada) || 0;
        }
        if (payload.valorFinanciado !== undefined) {
            payload.valorFinanciado = parseFloat(payload.valorFinanciado) || 0;
        }
        if (payload.valorParcela !== undefined) {
            payload.valorParcela = payload.valorParcela ? parseFloat(payload.valorParcela) : null;
        }
        if (payload.comissaoVendedor !== undefined) {
            payload.comissaoVendedor = parseFloat(payload.comissaoVendedor) || 0;
        }

        // Converter campos numéricos inteiros
        if (payload.quantidadeParcelas !== undefined) {
            payload.quantidadeParcelas = payload.quantidadeParcelas ? parseInt(payload.quantidadeParcelas) : null;
        }

        // Converter IDs - mantém o valor original se não for conversível
        if (payload.veiculoId !== undefined) {
            const parsed = parseInt(payload.veiculoId);
            payload.veiculoId = isNaN(parsed) ? payload.veiculoId : parsed;
        }
        if (payload.clienteId !== undefined) {
            const parsed = parseInt(payload.clienteId);
            payload.clienteId = isNaN(parsed) ? payload.clienteId : parsed;
        }
        if (payload.usuarioId !== undefined) {
            const parsed = parseInt(payload.usuarioId);
            payload.usuarioId = isNaN(parsed) ? payload.usuarioId : parsed;
        }
        if (payload.tipoVendaId !== undefined) {
            const parsed = parseInt(payload.tipoVendaId);
            payload.tipoVendaId = isNaN(parsed) ? payload.tipoVendaId : parsed;
        }
        if (payload.situacaoVendaId !== undefined) {
            const parsed = parseInt(payload.situacaoVendaId);
            payload.situacaoVendaId = isNaN(parsed) ? payload.situacaoVendaId : parsed;
        }

        return payload;
    }

    /**
     * Valida IDs de relacionamento
     */
    validateIds(payload, req, res) {
        const idFields = [
            "veiculoId",
            "clienteId",
            "usuarioId",
            "tipoVendaId",
            "situacaoVendaId",
        ];

        const invalidIds = idFields.filter(
            (field) =>
                payload[field] !== undefined &&
                (typeof payload[field] !== 'number' || !Number.isInteger(payload[field]) || payload[field] < 1)
        );

        if (invalidIds.length > 0) {
            logger.warn("IDs inválidos fornecidos", {
                route: req.originalUrl,
                invalidIds,
            });
            return res.status(400).json({
                error: "IDs devem ser números válidos",
                invalidIds,
            });
        }

        return null; // Sem erros
    }

    /**
     * Cria uma nova venda de veículo com validação e pré-processamento
     */
    create = async (req, res, next) => {
        try {
            // Pré-processar dados
            const payload = this.preprocessData(req.body);

            // Validar IDs
            const validationError = this.validateIds(payload, req, res);
            if (validationError) return validationError;

            // Atualizar req.body com dados processados
            req.body = payload;

            // Validar campos obrigatórios
            const missingFields = this.validateRequiredFields(payload);
            if (missingFields.length > 0) {
                logger.warn(`Campos obrigatórios ausentes ao criar ${this.entityName}`, {
                    route: req.originalUrl,
                    method: req.method,
                    missingFields,
                });
                return res.status(400).json({
                    error: "Campos obrigatórios ausentes",
                    missingFields,
                });
            }

            try {
                const result = await this.repository.create(payload);

                logger.info(`${this.entityName} criado(a) com sucesso`, {
                    id: result.id,
                    route: req.originalUrl,
                });

                return res.status(201).json(result);
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2003") {
                        const field = error.meta?.field_name || "relacionamento";
                        logger.warn(`Erro de chave estrangeira ao criar ${this.entityName}`, {
                            route: req.originalUrl,
                            field,
                        });
                        return res.status(400).json({
                            error: `Referência inválida no campo ${field}`,
                            details: error.message,
                        });
                    }
                    
                    if (error.code === "P2002") {
                        logger.warn(`Tentativa de criar ${this.entityName} duplicado(a)`, {
                            route: req.originalUrl,
                            field: error.meta?.target?.[0],
                        });
                        return res.status(409).json({
                            error: `Já existe ${this.entityName} com este(a) ${error.meta?.target?.[0] || 'valor'}`,
                        });
                    }
                }

                logger.error(`Erro ao criar ${this.entityName}`, {
                    error: error.message,
                    route: req.originalUrl,
                });
                throw error;
            }
        } catch (error) {
            logger.error(`Erro ao criar ${this.entityName}`, {
                error: error.message,
                route: req.originalUrl,
            });
            return res.status(500).json({
                error: `Erro ao criar ${this.entityName}`,
                details: error.message,
            });
        }
    };

    /**
     * Sobrescreve update para adicionar validação de IDs e conversão de tipos
     */
    async update(req, res, next) {
        try {
            // Pré-processar dados
            const payload = this.preprocessData(req.body);

            // Validar IDs
            const validationError = this.validateIds(payload, req, res);
            if (validationError) return validationError;

            // Atualizar req.body com dados processados
            req.body = payload;

            // Chamar método do BaseController
            return await super.update(req, res, next);
        } catch (error) {
            // Tratamento específico para erro de referência inválida (P2003)
            if (error.code === "P2003") {
                logger.warn("Tentativa de atualizar venda com referência inválida", {
                    route: req.originalUrl,
                    field: error.meta?.field_name,
                });
                return res.status(400).json({
                    error: "Referência inválida",
                    details: error.meta?.field_name,
                });
            }

            // Tratamento para erro de validação do Prisma (tipo inválido)
            if (error.name === "PrismaClientValidationError") {
                logger.warn("Erro de validação do Prisma ao atualizar venda", {
                    route: req.originalUrl,
                    error: error.message,
                });
                return res.status(400).json({
                    error: "IDs devem ser números válidos",
                });
            }

            logger.error("Erro ao atualizar venda de veículo", {
                error: error.message,
                route: req.originalUrl,
            });
            return res.status(500).json({
                error: "Erro ao atualizar venda de veículo",
                details: error.message,
            });
        }
    }
}

const controller = new VendaVeiculoController();

module.exports = {
    createVendaVeiculo: controller.create.bind(controller),
    getVendasVeiculo: controller.findAll.bind(controller),
    getVendaVeiculoById: controller.findById.bind(controller),
    updateVendaVeiculo: controller.update.bind(controller),
    deleteVendaVeiculo: controller.delete.bind(controller),
};
