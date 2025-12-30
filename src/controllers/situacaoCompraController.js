const BaseController = require("./BaseController");
const repository = require("../repositories/SituacaoCompraRepository");

class SituacaoCompraController extends BaseController {

    constructor() {
        super(repository, "situação de compra", {
            entityNamePlural: "situações de compra",
            requiredFields: ["descricao"]
        });
    }
}

const controller = new SituacaoCompraController();

module.exports = {
    createSituacaoCompra: controller.create.bind(controller),
    findAllSituacaoCompra: controller.findAll.bind(controller),
    findSituacaoCompraById: controller.findById.bind(controller),
    findSituacaoCompraByDescricao: controller.findByDescricao.bind(controller),
    updateSituacaoCompra: controller.update.bind(controller),
    deleteSituacaoCompra: controller.delete.bind(controller)
};
