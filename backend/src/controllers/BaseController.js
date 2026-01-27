const { Prisma } = require("@prisma/client");
const logger = require("../config/logger");

/**
 * Classe base para controllers com operações CRUD padrão
 */
class BaseController {
    /**
     * @param {object} repository - Instância do repositório
     * @param {string} entityName - Nome da entidade (ex: 'categoria de veículo')
     * @param {object} options - Configurações opcionais
     * @param {Array<string>} options.requiredFields - Campos obrigatórios para criação
     * @param {Array<string>} options.updateRequiredFields - Campos obrigatórios para atualização
     */
    constructor(repository, entityName, options = {}) {
        if (this.constructor === BaseController) {
            throw new Error("BaseController é uma classe abstrata e não pode ser instanciada diretamente");
        }

        this.repository = repository;
        this.entityName = entityName;
        this.entityNamePlural = options.entityNamePlural || `${entityName}s`;
        this.requiredFields = options.requiredFields || [];
        this.updateRequiredFields = options.updateRequiredFields || [];
    }

    /**
     * Valida se todos os campos obrigatórios estão presentes
     * @param {object} data - Dados a validar
     * @param {Array<string>} fields - Lista de campos obrigatórios
     * @returns {Array<string>} Lista de campos ausentes
     */
    validateRequiredFields(data, fields = this.requiredFields) {
        return fields.filter((field) => data[field] === undefined || data[field] === null || data[field] === '');
    }

    /**
     * Valida se o ID é um número válido
     * @param {string} id - ID a validar
     * @returns {number|null} ID convertido ou null se inválido
     */
    validateId(id) {
        const numId = parseInt(id);
        return isNaN(numId) ? null : numId;
    }

    /**
     * Cria um novo registro
     */
    create = async (req, res, next) => {
        const missingFields = this.validateRequiredFields(req.body);

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
            const result = await this.repository.create(req.body);

            logger.info(`${this.entityName} criado(a) com sucesso`, {
                id: result.id,
                route: req.originalUrl,
            });

            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
            next(error);
        }
    };

    /**
     * Busca todos os registros
     */
    findAll = async (req, res, next) => {
        try {
            const { limit, offset, orderBy } = req.query;

            // Preparar opções de consulta
            const options = {};

            if (limit) {
                options.take = parseInt(limit);
            }

            if (offset) {
                options.skip = parseInt(offset);
            }

            if (orderBy && this.repository.options?.defaultOrderBy) {
                options.orderBy = this.repository.options.defaultOrderBy;
            }

            // Se não houver parâmetros, usa findAll padrão
            if (Object.keys(options).length === 0) {
                const result = await this.repository.findAll();
                return res.json(result);
            }

            // Caso contrário, usa findMany com opções
            const result = await this.repository.findMany({}, options);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Busca um registro por ID
     */
    findById = async (req, res, next) => {
        const id = this.validateId(req.params.id);

        if (!id) {
            logger.warn("ID inválido fornecido", {
                route: req.originalUrl,
                providedId: req.params.id,
            });
            return res.status(400).json({ error: "ID inválido" });
        }

        try {
            const result = await this.repository.findById(id);

            if (!result) {
                logger.info(`${this.entityName} não encontrado(a)`, {
                    id,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `${this.entityName} não encontrado(a)`
                });
            }

            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Busca registro por descrição (se o repositório tiver esse método)
     */
    findByDescricao = async (req, res, next) => {
        const { descricao } = req.params;
        const descricaoDecodificada = decodeURIComponent(descricao);

        if (!descricaoDecodificada || descricaoDecodificada.trim() === "") {
            logger.warn(`Descrição ausente na busca de ${this.entityName}`, {
                route: req.originalUrl,
            });
            return res.status(400).json({
                error: "Descrição é obrigatória para busca"
            });
        }

        if (!this.repository.findByDescricao) {
            return res.status(501).json({
                error: "Busca por descrição não implementada"
            });
        }

        try {
            const result = await this.repository.findByDescricao(descricaoDecodificada);

            if (!result) {
                logger.info(`${this.entityName} não encontrado(a) por descrição`, {
                    descricao: descricaoDecodificada,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `${this.entityName} não encontrado(a)`
                });
            }

            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Atualiza um registro
     */
    update = async (req, res, next) => {
        const id = this.validateId(req.params.id);

        if (!id) {
            logger.warn("ID inválido fornecido para atualização", {
                route: req.originalUrl,
                providedId: req.params.id,
            });
            return res.status(400).json({ error: "ID inválido" });
        }

        // Valida campos obrigatórios para atualização se especificados
        if (this.updateRequiredFields.length > 0) {
            const missingFields = this.validateRequiredFields(
                req.body,
                this.updateRequiredFields
            );

            if (missingFields.length > 0) {
                logger.warn(`Campos obrigatórios ausentes ao atualizar ${this.entityName}`, {
                    route: req.originalUrl,
                    missingFields,
                });
                return res.status(400).json({
                    error: "Campos obrigatórios ausentes",
                    missingFields,
                });
            }
        }

        try {
            const result = await this.repository.update(id, req.body);

            logger.info(`${this.entityName} atualizado(a) com sucesso`, {
                id,
                route: req.originalUrl,
            });

            return res.json(result);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    logger.info(`Tentativa de atualizar ${this.entityName} inexistente`, {
                        id: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(404).json({
                        error: `${this.entityName} não encontrado(a)`
                    });
                }
                if (error.code === "P2002") {
                    logger.warn(`Tentativa de atualizar para ${error.meta?.target?.[0]} duplicado(a)`, {
                        id: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(409).json({
                        error: `Já existe ${this.entityName} com este(a) ${error.meta?.target?.[0] || 'valor'}`,
                    });
                }
            }
            next(error);
        }
    };

    /**
     * Deleta um registro
     */
    delete = async (req, res, next) => {
        const id = this.validateId(req.params.id);

        if (!id) {
            logger.warn("ID inválido fornecido para exclusão", {
                route: req.originalUrl,
                providedId: req.params.id,
            });
            return res.status(400).json({ error: "ID inválido" });
        }

        try {
            await this.repository.delete(id);

            logger.info(`${this.entityName} excluído(a) com sucesso`, {
                id,
                route: req.originalUrl,
            });

            return res.status(204).send();
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    logger.info(`Tentativa de excluir ${this.entityName} inexistente`, {
                        id: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(404).json({
                        error: `${this.entityName} não encontrado(a)`
                    });
                }
                if (error.code === "P2003") {
                    logger.warn(`Tentativa de excluir ${this.entityName} com registros associados`, {
                        id: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(400).json({
                        error: `Não é possível excluir este(a) ${this.entityName}: existem registros associados`,
                    });
                }
            }
            next(error);
        }
    };
}

module.exports = BaseController;
