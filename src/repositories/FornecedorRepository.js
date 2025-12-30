const BaseRepository = require("./BaseRepository");

class PrismaFornecedorRepository extends BaseRepository {
    
    constructor() {
        super("fornecedor", "FornecedorRepository.js", {
            defaultOrderBy: "razaoSocial",
            orderDirection: "asc"
        });
    }

    /**
     * Busca fornecedores por razão social (busca parcial)
     * @param {string} razaoSocial - Razão social para buscar
     * @returns {Promise<Array>} Lista de fornecedores
     */
    async findByRazaoSocial(razaoSocial) {
        return await this.findMany({
            razaoSocial: {
                contains: razaoSocial,
                mode: "insensitive",
            },
        });
    }

    /**
     * Busca fornecedor por CPF ou CNPJ
     * @param {string} cpfCnpj - CPF ou CNPJ do fornecedor
     * @returns {Promise<object|null>} Fornecedor encontrado ou null
     */
    async findByCpfCnpj(cpfCnpj) {
        return await this.findByUniqueField("cpfCnpj", cpfCnpj);
    }

    /**
     * Busca fornecedor por email
     * @param {string} email - Email do fornecedor
     * @returns {Promise<object|null>} Fornecedor encontrado ou null
     */
    async findByEmail(email) {
        return await this.findByUniqueField("email", email);
    }
}

module.exports = new PrismaFornecedorRepository();
