const BaseController = require("./BaseController");
const repository = require("../repositories/FornecedorRepository");
const logger = require("../config/logger");

class FornecedorController extends BaseController {

    constructor() {
        super(repository, "fornecedor", {
            entityNamePlural: "fornecedores",
            requiredFields: ["razaoSocial", "cpfCnpj", "tipo", "cidade", "telefone1"]
        });
    }

    /**
     * Busca fornecedores por razão social
     */
    async findByRazaoSocial(req, res, next) {
        try {
            const { razaoSocial } = req.params;
            const razaoSocialDecodificada = decodeURIComponent(razaoSocial);

            logger.info("Buscando fornecedores por razão social", {
                razaoSocial: razaoSocialDecodificada,
                route: req.originalUrl,
            });

            const fornecedores = await this.repository.findByRazaoSocial(
                razaoSocialDecodificada
            );

            if (!fornecedores || fornecedores.length === 0) {
                logger.info("Nenhum fornecedor encontrado com a razão social", {
                    razaoSocial: razaoSocialDecodificada,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `Nenhum ${this.entityName} encontrado com essa razão social`
                });
            }

            return res.json(fornecedores);
        } catch (error) {
            logger.error("Erro ao buscar fornecedores por razão social", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

    /**
     * Busca fornecedor por CPF/CNPJ
     */
    async findByCpfCnpj(req, res, next) {
        try {
            const { cpfCnpj } = req.params;

            logger.info("Buscando fornecedor por CPF/CNPJ", {
                cpfCnpj,
                route: req.originalUrl,
            });

            const fornecedor = await this.repository.findByCpfCnpj(cpfCnpj);

            if (!fornecedor) {
                logger.info("Fornecedor não encontrado por CPF/CNPJ", {
                    cpfCnpj,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `${this.entityName} não encontrado(a)`
                });
            }

            return res.json(fornecedor);
        } catch (error) {
            logger.error("Erro ao buscar fornecedor por CPF/CNPJ", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

    /**
     * Busca fornecedor por email
     */
    async findByEmail(req, res, next) {
        try {
            const { email } = req.params;
            const emailDecodificado = decodeURIComponent(email);

            logger.info("Buscando fornecedor por email", {
                email: emailDecodificado,
                route: req.originalUrl,
            });

            const fornecedor = await this.repository.findByEmail(emailDecodificado);

            if (!fornecedor) {
                logger.info("Fornecedor não encontrado por email", {
                    email: emailDecodificado,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `${this.entityName} não encontrado(a)`
                });
            }

            return res.json(fornecedor);
        } catch (error) {
            logger.error("Erro ao buscar fornecedor por email", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

}

const controller = new FornecedorController();

module.exports = {
    createFornecedor: controller.create.bind(controller),
    findAllFornecedores: controller.findAll.bind(controller),
    findFornecedorById: controller.findById.bind(controller),
    findByRazaoSocial: controller.findByRazaoSocial.bind(controller),
    findByCpfCnpj: controller.findByCpfCnpj.bind(controller),
    findByEmail: controller.findByEmail.bind(controller),
    updateFornecedor: controller.update.bind(controller),
    deleteFornecedor: controller.delete.bind(controller)
};
