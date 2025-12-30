const BaseController = require("./BaseController");
const repository = require("../repositories/TipoTransmissaoRepository");

class TipoTransmissaoController extends BaseController {

    constructor() {
        super(repository, "tipo de transmissão", {
            entityNamePlural: "tipos de transmissão",
            requiredFields: ["descricao"]
        });
    }

}
    
const controller = new TipoTransmissaoController();

module.exports = {
    createTipoTransmissao: controller.create.bind(controller),
    findAllTiposTransmissao: controller.findAll.bind(controller),
    findTipoTransmissaoById: controller.findById.bind(controller),
    findTipoTransmissaByDescricao: controller.findByDescricao.bind(controller),
    updateTipoTransmissao: controller.update.bind(controller),
    deleteTipoTransmissao: controller.delete.bind(controller)
};
    