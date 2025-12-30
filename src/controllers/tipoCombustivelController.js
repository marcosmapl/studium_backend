const BaseController = require("./BaseController");
const repository = require("../repositories/TipoCombustivelRepository");

class TipoCombustivelController extends BaseController {

    constructor() {
        super(repository, "tipo de combustível", {
            entityNamePlural: "tipos de combustível",
            requiredFields: ["descricao"]
        });
    }
    
}

const controller = new TipoCombustivelController();

module.exports = {
    createTipoCombustivel: controller.create.bind(controller),
    findAllTiposCombustivel: controller.findAll.bind(controller),
    findTipoCombustivelById: controller.findById.bind(controller),
    findTipoCombustivelByDescricao: controller.findByDescricao.bind(controller),
    updateTipoCombustivel: controller.update.bind(controller),
    deleteTipoCombustivel: controller.delete.bind(controller)
};
