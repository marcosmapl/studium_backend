const BaseController = require("./BaseController");
const repository = require("../repositories/CategoriaVeiculoRepository");

class CategoriaVeiculoController extends BaseController {

    constructor() {
        super(repository, "categoria de veículo", {
            entityNamePlural: "categorias de veículo",
            requiredFields: ["descricao"]
        });
    }

}

const controller = new CategoriaVeiculoController();

module.exports = {
    createCategoriaVeiculo: controller.create.bind(controller),
    findAllCategoriasVeiculo: controller.findAll.bind(controller),
    findCategoriaVeiculoById: controller.findById.bind(controller),
    findCategoriaVeiculoByDescricao: controller.findByDescricao.bind(controller),
    updateCategoriaVeiculo: controller.update.bind(controller),
    deleteCategoriaVeiculo: controller.delete.bind(controller)
};
