const BaseController = require("./BaseController");
const repository = require("../repositories/SituacaoLicenciamentoRepository");

class SituacaoLicenciamentoController extends BaseController {

    constructor() {
        super(repository, "situação de licenciamento", {
            entityNamePlural: "situações de licenciamento",
            requiredFields: ["descricao"]
        });
    }
}

const controller = new SituacaoLicenciamentoController();

module.exports = {
    createSituacaoLicenciamento: controller.create.bind(controller),
    findAllSituacaoLicenciamento: controller.findAll.bind(controller),
    findSituacaoLicenciamentoById: controller.findById.bind(controller),
    findSituacaoLicenciamentoByDescricao: controller.findByDescricao.bind(controller),
    updateSituacaoLicenciamento: controller.update.bind(controller),
    deleteSituacaoLicenciamento: controller.delete.bind(controller)
};
