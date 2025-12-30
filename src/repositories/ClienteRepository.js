const BaseRepository = require("./BaseRepository");

class PrismaClienteRepository extends BaseRepository {

    constructor() {
        super("cliente", "ClienteRepository.js", {
            defaultOrderBy: "nomeCompleto",
            orderDirection: "asc"
        });
    }

    /**
     * Busca cliente por CPF
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<object|null>} Cliente encontrado ou null
     */
    async findByCpf(cpf) {
        return await this.findByUniqueField("cpf", cpf);
    }

    /**
     * Busca cliente por email
     * @param {string} email - Email do cliente
     * @returns {Promise<object|null>} Cliente encontrado ou null
     */
    async findByEmail(email) {
        return await this.findByUniqueField("email", email);
    }

    /**
     * Busca clientes por nome (busca parcial)
     * @param {string} nomeCompleto - Nome para buscar
     * @returns {Promise<Array>} Lista de clientes
     */
    async findByNome(nomeCompleto) {
        return await this.findMany({
            nomeCompleto: {
                contains: nomeCompleto,
                mode: "insensitive",
            },
        });
    }

    /**
     * Busca cliente por CNH
     * @param {string} cnh - CNH do cliente
     * @returns {Promise<object|null>} Cliente encontrado ou null
     */
    async findByCnh(cnh) {
        return await this.findByUniqueField("cnh", cnh);
    }
}

module.exports = new PrismaClienteRepository();
