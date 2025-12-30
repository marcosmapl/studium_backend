const BaseController = require("./BaseController");
const repository = require("../repositories/SituacaoVendaRepository");

class SituacaoVendaController extends BaseController {
  constructor() {
    super(repository, "situação de venda", {
      entityNamePlural: "situações de venda",
      requiredFields: ["descricao"]
    });
  }
}

const controller = new SituacaoVendaController();

module.exports = {
  createSituacaoVenda: controller.create.bind(controller),
  findAllSituacoesVenda: controller.findAll.bind(controller),
  findSituacaoVendaById: controller.findById.bind(controller),
  updateSituacaoVenda: controller.update.bind(controller),
  deleteSituacaoVenda: controller.delete.bind(controller),
};
