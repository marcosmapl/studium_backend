const logger = require("../config/logger");
const prisma = require("../orm/prismaClient");

/**
 * Classe base para repositórios com operações CRUD padrão
 * @abstract
 */
class BaseRepository {
    /**
     * @param {string} modelName - Nome do modelo Prisma (ex: 'cliente', 'fornecedor')
     * @param {string} repositoryName - Nome do repositório para logs (ex: 'ClienteRepository')
     * @param {object} options - Configurações opcionais
     * @param {string} options.defaultOrderBy - Campo padrão para ordenação
     * @param {string} options.orderDirection - Direção da ordenação ('asc' ou 'desc')
     * @param {object} options.includeRelations - Relações a incluir nas consultas
     */
    constructor(modelName, repositoryName, options = {}) {
        if (this.constructor === BaseRepository) {
            throw new Error("BaseRepository é uma classe abstrata e não pode ser instanciada diretamente");
        }

        this.modelName = modelName;
        this.repositoryName = repositoryName;
        this.model = prisma[modelName];
        this.defaultOrderBy = options.defaultOrderBy || 'id';
        this.orderDirection = options.orderDirection || 'asc';
        this.includeRelations = options.includeRelations || null;

        if (!this.model) {
            throw new Error(`Modelo '${modelName}' não encontrado no Prisma Client`);
        }
    }

    /**
     * Cria um novo registro
     * @param {object} data - Dados para criar o registro
     * @returns {Promise<object>} Registro criado
     */
    async create(data) {
        const query = { data };

        if (this.includeRelations) {
            query.include = this.includeRelations;
        }

        try {
            return await this.model.create(query);
        } catch (error) {
            logger.error(`Erro ao criar ${this.modelName}`, {
                error: error.message,
                data,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Busca todos os registros com paginação opcional
     * @param {number} limit - Limite de registros (0 = sem limite)
     * @param {number} offset - Deslocamento para paginação
     * @param {object} additionalWhere - Condições adicionais para filtro
     * @returns {Promise<Array>} Lista de registros
     */
    async findAll(limit = 0, offset = 0, additionalWhere = {}) {
        const query = {
            where: additionalWhere,
            orderBy: { [this.defaultOrderBy]: this.orderDirection },
        };

        if (this.includeRelations) {
            query.include = this.includeRelations;
        }

        if (limit > 0) {
            query.take = limit;
            query.skip = offset;
        }

        try {
            return await this.model.findMany(query);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName}s`, {
                error: error.message,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Busca um registro por ID
     * @param {number|string} id - ID do registro
     * @returns {Promise<object|null>} Registro encontrado ou null
     */
    async findById(id) {
        const query = {
            where: { id: parseInt(id) },
        };

        if (this.includeRelations) {
            query.include = this.includeRelations;
        }

        try {
            return await this.model.findUnique(query);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por ID`, {
                error: error.message,
                id,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Busca registros por campo único
     * @param {string} fieldName - Nome do campo
     * @param {any} value - Valor a buscar
     * @returns {Promise<object|null>} Registro encontrado ou null
     */
    async findByUniqueField(fieldName, value) {
        const query = {
            where: { [fieldName]: value },
        };

        if (this.includeRelations) {
            query.include = this.includeRelations;
        }

        try {
            return await this.model.findUnique(query);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName} por ${fieldName}`, {
                error: error.message,
                [fieldName]: value,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Busca registros com filtro personalizado
     * @param {object} whereClause - Cláusula where do Prisma
     * @param {object} options - Opções adicionais (orderBy, include, etc)
     * @returns {Promise<Array>} Lista de registros
     */
    async findMany(whereClause, options = {}) {
        const query = {
            where: whereClause,
            orderBy: options.orderBy || { [this.defaultOrderBy]: this.orderDirection },
        };

        if (this.includeRelations && !options.include) {
            query.include = this.includeRelations;
        } else if (options.include) {
            query.include = options.include;
        }

        if (options.take || options.limit) {
            query.take = options.take || options.limit;
        }
        
        if (options.skip !== undefined || options.offset !== undefined) {
            query.skip = options.skip !== undefined ? options.skip : options.offset;
        }

        try {
            return await this.model.findMany(query);
        } catch (error) {
            logger.error(`Erro ao buscar ${this.modelName}s com filtro`, {
                error: error.message,
                whereClause,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Atualiza um registro por ID
     * @param {number|string} id - ID do registro
     * @param {object} data - Dados para atualizar
     * @returns {Promise<object>} Registro atualizado
     */
    async update(id, data) {
        const query = {
            where: { id: parseInt(id) },
            data,
        };

        if (this.includeRelations) {
            query.include = this.includeRelations;
        }

        try {
            return await this.model.update(query);
        } catch (error) {
            logger.error(`Erro ao atualizar ${this.modelName}`, {
                error: error.message,
                id,
                data,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Deleta um registro por ID
     * @param {number|string} id - ID do registro
     * @returns {Promise<object>} Registro deletado
     */
    async delete(id) {
        const query = {
            where: { id: parseInt(id) },
        };

        try {
            return await this.model.delete(query);
        } catch (error) {
            logger.error(`Erro ao deletar ${this.modelName}`, {
                error: error.message,
                id,
                file: this.repositoryName,
            });
            throw error;
        }
    }

    /**
     * Conta registros com filtro opcional
     * @param {object} whereClause - Cláusula where do Prisma
     * @returns {Promise<number>} Quantidade de registros
     */
    async count(whereClause = {}) {
        try {
            return await this.model.count({ where: whereClause });
        } catch (error) {
            logger.error(`Erro ao contar ${this.modelName}s`, {
                error: error.message,
                whereClause,
                file: this.repositoryName,
            });
            throw error;
        }
    }
}

module.exports = BaseRepository;
