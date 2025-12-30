const BaseController = require("./BaseController");
const repository = require("../repositories/TipoCompraRepository");

class TipoCompraController extends BaseController {
    
    constructor() {
        super(repository, "tipo de compra", {
            entityNamePlural: "tipos de compra",
            requiredFields: ["descricao"]
        });
    }
    
}

const controller = new TipoCompraController();

module.exports = {
    createTipoCompra: controller.create.bind(controller),
    findAllTiposCompra: controller.findAll.bind(controller),
    findTipoCompraById: controller.findById.bind(controller),
    findTipoCompraByDescricao: controller.findByDescricao.bind(controller),
    updateTipoCompra: controller.update.bind(controller),
    deleteTipoCompra: controller.delete.bind(controller)
};
