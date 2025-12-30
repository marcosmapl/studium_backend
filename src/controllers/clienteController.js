const BaseController = require("./BaseController");
const repository = require("../repositories/ClienteRepository");

class ClienteController extends BaseController {

    constructor() {
        super(repository, "cliente", {
            entityNamePlural: "clientes",
            requiredFields: ["nomeCompleto", "dataNascimento", "cpf", "sexo", "telefone1", "email"]
        });
    }

    async findAllClientes(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 0;
            const offset = parseInt(req.query.offset) || 0;

            const clientes = await this.repository.findAll(limit, offset);

            return res.json(clientes);
        } catch (error) {
            next(error);
        }
    }

    async findClienteByNome(req, res, next) {
        try {
            const { nome } = req.params;

            if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
                logger.warn("Nome inválido fornecido", {
                    route: req.originalUrl,
                });
                return res.status(400).json({ error: "Nome inválido" });
            }

            const clientes = await this.repository.findByNome(nome);

            return res.json(clientes);
        } catch (error) {
            next(error);
        }
    }

    async findClienteByCpf(req, res, next) {
        try {
            const { cpf } = req.params;

            if (!cpf || typeof cpf !== "string") {
                logger.warn("CPF inválido fornecido para busca", {
                    route: req.originalUrl,
                });
                return res.status(400).json({ error: "CPF inválido" });
            }

            const cpfLimpo = cpf.replace(/\D/g, "");

            if (cpfLimpo.length !== 11) {
                logger.warn("CPF com tamanho inválido", {
                    route: req.originalUrl,
                    tamanho: cpfLimpo.length,
                });
                return res.status(400).json({ error: "CPF deve conter 11 dígitos" });
            }

            const cliente = await clienteRepository.findByCpf(cpfLimpo);

            if (!cliente) {
                logger.info("Cliente não encontrado por CPF", {
                    route: req.originalUrl,
                });
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            return res.json(cliente);
        } catch (error) {
            next(error);
        }
    }

}

const controller = new ClienteController();

module.exports = {
    createCliente: controller.create.bind(controller),
    findAllClientes: controller.findAll.bind(controller),
    findClienteById: controller.findById.bind(controller),
    findClienteByNome: controller.findClienteByNome.bind(controller),
    findClienteByCpf: controller.findClienteByCpf.bind(controller),
    updateCliente: controller.update.bind(controller),
    deleteCliente: controller.delete.bind(controller)
};
