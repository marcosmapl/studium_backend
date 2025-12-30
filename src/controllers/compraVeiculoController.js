const BaseController = require("./BaseController");
const repository = require("../repositories/CompraVeiculoRepository");
const logger = require("../config/logger");

class CompraVeiculoController extends BaseController {

    constructor() {
        super(repository, "compra de veículo", {
            entityNamePlural: "compras de veículo",
            requiredFields: ["veiculoId", "fornecedorId", "unidadeId", "tipoCompraId", "situacaoCompraId", "dataCompra", "valorCompra", "custoAquisicao"]
        });
    }

    async findCompraVeiculoByVeiculoId(req, res, next) {
        try {
            const { veiculoId } = req.params;
            const comprasVeiculos = await this.repository.findByVeiculoId(
                veiculoId
            );
            return res.json(comprasVeiculos);
        } catch (error) {
            logger.error("Erro ao buscar compras por veículo", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

    async findCompraVeiculoByFornecedorId(req, res, next) {
        try {
            const { fornecedorId } = req.params;
            const comprasVeiculos = await this.repository.findByFornecedorId(
                fornecedorId
            );
            return res.json(comprasVeiculos);
        } catch (error) {
            logger.error("Erro ao buscar compras por fornecedor", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

    async findCompraVeiculoByUnidadeId(req, res, next) {
        try {
            const { unidadeId } = req.params;
            const comprasVeiculos = await this.repository.findByUnidadeId(
                unidadeId
            );
            return res.json(comprasVeiculos);
        } catch (error) {
            logger.error("Erro ao buscar compras por unidade", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

}

const controller = new CompraVeiculoController();

module.exports = {
    createCompraVeiculo: controller.create.bind(controller),
    findAllComprasVeiculo: controller.findAll.bind(controller),
    findCompraVeiculoById: controller.findById.bind(controller),
    findCompraVeiculoByVeiculoId: controller.findCompraVeiculoByVeiculoId.bind(controller),
    findCompraVeiculoByFornecedorId: controller.findCompraVeiculoByFornecedorId.bind(controller),
    findCompraVeiculoByUnidadeId: controller.findCompraVeiculoByUnidadeId.bind(controller),
    updateCompraVeiculo: controller.update.bind(controller),
    deleteCompraVeiculo: controller.delete.bind(controller)
};
