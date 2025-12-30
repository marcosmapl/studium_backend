const BaseController = require("./BaseController");
const repository = require("../repositories/SituacaoVeiculoRepository");

class SituacaoVeiculoController extends BaseController {

    constructor() {
        super(repository, "situação de veículo", {
            entityNamePlural: "situações de veículo",
            requiredFields: ["descricao"]
        });
    }
    
}

const controller = new SituacaoVeiculoController();

module.exports = {
    createSituacaoVeiculo: controller.create.bind(controller),
    findAllSituacoesVeiculo: controller.findAll.bind(controller),
    findSituacaoVeiculoById: controller.findById.bind(controller),
    findSituacaoVeiculoByDescricao: controller.findByDescricao.bind(controller),
    updateSituacaoVeiculo: controller.update.bind(controller),
    deleteSituacaoVeiculo: controller.delete.bind(controller)
};
