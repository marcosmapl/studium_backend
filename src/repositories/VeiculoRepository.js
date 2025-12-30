const BaseRepository = require("./BaseRepository");

const includeRelations = {
    categoriaVeiculo: true,
    estadoVeiculo: true,
    situacaoLicenciamento: true,
    situacaoVeiculo: true,
    tipoCombustivel: true,
    tipoDirecao: true,
    tipoTransmissao: true,
    unidade: true,
};

class PrismaVeiculoRepository extends BaseRepository {

    constructor() {
        super("veiculo", "VeiculoRepository.js", {
            defaultOrderBy: "modelo",
            orderDirection: "asc",
            includeRelations
        });
    }

    /**
     * Busca todos os veículos com filtro opcional por unidade
     * @param {number} limit - Limite de registros
     * @param {number} offset - Deslocamento
     * @param {number|null} unidadeId - ID da unidade para filtrar
     * @returns {Promise<Array>} Lista de veículos
     */
    async getAll(limit = 0, offset = 0, unidadeId = null) {
        const where = {};

        if (unidadeId !== undefined && unidadeId !== null) {
            where.unidadeId = Number(unidadeId);
        }

        return await this.findAll(limit, offset, where);
    }

    /**
     * Alias para findById mantendo compatibilidade
     * @param {number} id - ID do veículo
     * @returns {Promise<object|null>} Veículo encontrado ou null
     */
    async getById(id) {
        return await this.findById(id);
    }

    /**
     * Busca veículos por situação
     * @param {object} options - Opções de busca
     * @param {string} options.descricao - Descrição da situação
     * @returns {Promise<Array>} Lista de veículos
     */
    async getAllBySituacao(options = {}) {
        const { descricao } = options;

        return await this.findMany(
            {
                situacaoVeiculo: {
                    descricao: descricao,
                },
            },
            {
                orderBy: { placa: "asc" },
            }
        );
    }
}

module.exports = new PrismaVeiculoRepository();
