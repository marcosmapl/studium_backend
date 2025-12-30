const BaseRepository = require("./BaseRepository");

class PrismaCompraVeiculoRepository extends BaseRepository {
    
    constructor() {
        super("compraVeiculo", "CompraVeiculoRepository.js", {
            defaultOrderBy: "dataCompra",
            orderDirection: "desc",
            includeRelations: {
                fornecedor: true,
                situacaoCompra: true,
                tipoCompra: true,
                unidade: true,
                veiculo: true,
            }
        });
    }

    /**
     * Busca compras por ID do veículo
     * @param {number} veiculoId - ID do veículo
     * @returns {Promise<Array>} Lista de compras
     */
    async findByVeiculoId(veiculoId) {
        return await this.findMany(
            { veiculoId: parseInt(veiculoId) },
            { orderBy: { dataCompra: "desc" } }
        );
    }

    /**
     * Busca compras por ID do fornecedor
     * @param {number} fornecedorId - ID do fornecedor
     * @returns {Promise<Array>} Lista de compras
     */
    async findByFornecedorId(fornecedorId) {
        return await this.findMany(
            { fornecedorId: parseInt(fornecedorId) },
            { orderBy: { dataCompra: "desc" } }
        );
    }

    /**
     * Busca compras por ID da unidade
     * @param {number} unidadeId - ID da unidade
     * @returns {Promise<Array>} Lista de compras
     */
    async findByUnidadeId(unidadeId) {
        return await this.findMany(
            { unidadeId: parseInt(unidadeId) },
            { orderBy: { dataCompra: "desc" } }
        );
    }
}

module.exports = new PrismaCompraVeiculoRepository();
