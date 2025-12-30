const BaseRepository = require("./BaseRepository");

class PrismaVendaVeiculoRepository extends BaseRepository {
    
    constructor() {
        super("vendaVeiculo", "VendaVeiculoRepository.js", {
            defaultOrderBy: "id",
            orderDirection: "desc",
            includeRelations: {
                veiculo: true,
                cliente: true,
                usuario: {
                    select: {
                        id: true,
                        nomeUsuario: true,
                        nomeFuncionario: true,
                        email: true,
                    },
                },
                tipoVenda: true,
                situacaoVenda: true,
            }
        });
    }

    /**
     * Sobrescreve findAll para ordenar por cliente.nomeCompleto
     */
    async findAll(limit = 0, offset = 0, additionalWhere = {}) {
        const query = {
            where: additionalWhere,
            orderBy: {
                cliente: {
                    nomeCompleto: "asc",
                },
            },
            include: this.includeRelations,
        };

        if (limit > 0) {
            query.take = limit;
            query.skip = offset;
        }

        try {
            return await this.model.findMany(query);
        } catch (error) {
            const logger = require("../config/logger");
            logger.error(`Erro ao buscar ${this.modelName}s`, {
                error: error.message,
                file: this.repositoryName,
            });
            throw error;
        }
    }
}

module.exports = new PrismaVendaVeiculoRepository();
