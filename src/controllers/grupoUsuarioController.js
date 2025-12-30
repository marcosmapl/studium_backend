const BaseController = require("./BaseController");
const repository = require("../repositories/GrupoUsuarioRepository");

class GrupoUsuarioController extends BaseController {

    constructor() {
        super(repository, "grupo de usuário", {
            entityNamePlural: "grupos de usuário",
            requiredFields: ["nome"]
        });
    }
}

const controller = new GrupoUsuarioController();

module.exports = {
    createGrupoUsuario: controller.create.bind(controller),
    findAllGrupoUsuario: controller.findAll.bind(controller),
    findGrupoUsuarioById: controller.findById.bind(controller),
    updateGrupoUsuario: controller.update.bind(controller),
    deleteGrupoUsuario: controller.delete.bind(controller)
};
