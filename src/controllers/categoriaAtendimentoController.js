const BaseController = require("./BaseController");
const repository = require("../repositories/CategoriaAtendimentoRepository");

class CategoriaAtendimentoController extends BaseController {

    constructor() {
        super(repository, "categoria de atendimento", {
            entityNamePlural: "categorias de atendimento",
            requiredFields: ["descricao"]
        });
    }
}

const controller = new CategoriaAtendimentoController();

module.exports = {
    createCategoriaAtendimento: controller.create.bind(controller),
    findAllCategoriasAtendimento: controller.findAll.bind(controller),
    findCategoriaAtendimentoById: controller.findById.bind(controller),
    findCategoriaAtendimentoByDescricao: controller.findByDescricao.bind(controller),
    updateCategoriaAtendimento: controller.update.bind(controller),
    deleteCategoriaAtendimento: controller.delete.bind(controller)
};
