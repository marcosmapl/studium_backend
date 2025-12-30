const BaseController = require("./BaseController");
const repository = require("../repositories/UnidadeRepository");

class UnidadeController extends BaseController {
    constructor() {
        super(repository, "unidade", {
            entityNamePlural: "unidades",
            requiredFields: ["nome", "endereco", "cidade", "uf", "cep", "telefone1", "telefone2"]
        });
    }
}

const controller = new UnidadeController();

module.exports = {
    createUnidade: controller.create.bind(controller),
    findAllUnidades: controller.findAll.bind(controller),
    findUnidadeById: controller.findById.bind(controller),
    findUnidadeByDescricao: controller.findByDescricao.bind(controller),
    updateUnidade: controller.update.bind(controller),
    deleteUnidade: controller.delete.bind(controller)
};
