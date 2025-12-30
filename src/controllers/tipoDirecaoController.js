const BaseController = require("./BaseController");
const repository = require("../repositories/TipoDirecaoRepository");

class TipoDirecaoController extends BaseController {
    
    constructor() {
        super(repository, "tipo de direção", {
            entityNamePlural: "tipos de direção",
            requiredFields: ["descricao"]
        });
    }

}

const controller = new TipoDirecaoController();

module.exports = {
    createTipoDirecao: controller.create.bind(controller),
    findAllTiposDirecao: controller.findAll.bind(controller),
    findTipoDirecaoById: controller.findById.bind(controller),
    findTipoDirecaoByDescricao: controller.findByDescricao.bind(controller),
    updateTipoDirecao: controller.update.bind(controller),
    deleteTipoDirecao: controller.delete.bind(controller)
};
