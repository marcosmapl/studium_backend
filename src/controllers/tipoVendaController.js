const BaseController = require("./BaseController");
const repository = require("../repositories/TipoVendaRepository");

class TipoVendaController extends BaseController {
    constructor() {
        super(repository, "tipo de venda", {
            entityNamePlural: "tipos de venda",
            requiredFields: ["descricao"]
        });
    }
}

const controller = new TipoVendaController();

module.exports = {
    createTipoVenda: controller.create.bind(controller),
    findAllTiposVenda: controller.findAll.bind(controller),
    findTipoVendaById: controller.findById.bind(controller),
    findTipoVendaByDescricao: controller.findByDescricao.bind(controller),
    updateTipoVenda: controller.update.bind(controller),
    deleteTipoVenda: controller.delete.bind(controller)
};
