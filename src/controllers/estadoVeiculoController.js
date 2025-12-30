const BaseController = require("./BaseController");
const repository = require("../repositories/EstadoVeiculoRepository");

class EstadoVeiculoController extends BaseController {

    constructor() {
        super(repository, "estado de veículo", {
            entityNamePlural: "estados de veículo",
            requiredFields: ["descricao"]
        });
    }
}

const controller = new EstadoVeiculoController();

module.exports = {
    createEstadoVeiculo: controller.create.bind(controller),
    findAllEstadoVeiculo: controller.findAll.bind(controller),
    findEstadoVeiculoById: controller.findById.bind(controller),
    findEstadoVeiculoByDescricao: controller.findByDescricao.bind(controller),
    updateEstadoVeiculo: controller.update.bind(controller),
    deleteEstadoVeiculo: controller.delete.bind(controller)
};
