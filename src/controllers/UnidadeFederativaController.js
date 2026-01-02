const BaseController = require("./BaseController");
const repository = require("../repositories/UnidadeFederativaRepository");

class UnidadeFederativaController extends BaseController {

    constructor() {
        super(repository, "unidade federativa", {
            entityNamePlural: "unidades federativas",
            requiredFields: ["nome", "sigla"]
        });
    }

    /**
     * Busca unidades federativas por nome
     */
    async findByNome(req, res, next) {
        try {
            const { nome } = req.params;
            const nomeDecodificado = decodeURIComponent(nome);

            logger.info("Buscando unidade federativa por nome", {
                nome: nomeDecodificado,
                route: req.originalUrl,
            });

            const unidadesFederativas = await this.repository.findByNome(
                nomeDecodificado
            );

            if (!unidadesFederativas || unidadesFederativas.length === 0) {
                logger.info("Nenhuma unidade federativa encontrada com o nome", {
                    nome: nomeDecodificado,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `Nenhuma ${this.entityName} encontrada com esse nome`
                });
            }

            return res.json(unidadesFederativas);
        } catch (error) {
            logger.error("Erro ao buscar unidade federativa por nome", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    /**
     * Busca unidades federativas por sigla
     */
    async findBySigla(req, res, next) {
        try {
            const { sigla } = req.params;
            const siglaDecodificada = decodeURIComponent(sigla);

            logger.info("Buscando unidade federativa por sigla", {
                sigla: siglaDecodificada,
                route: req.originalUrl,
            });

            const unidadesFederativas = await this.repository.findBySigla(
                siglaDecodificada
            );

            if (!unidadesFederativas || unidadesFederativas.length === 0) {
                logger.info("Nenhuma unidade federativa encontrada com a sigla", {
                    sigla: siglaDecodificada,
                    route: req.originalUrl,
                });
                return res.status(404).json({
                    error: `Nenhuma ${this.entityName} encontrada com essa sigla`
                });
            }

            return res.json(unidadesFederativas);

        } catch (error) {
            logger.error("Erro ao buscar unidade federativa por sigla", {
                error: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }
}

const controller = new UnidadeFederativaController();

module.exports = {
    createUnidadeFederativa: controller.create.bind(controller),
    findAllUnidadesFederativas: controller.findAll.bind(controller),
    findUnidadeFederativaById: controller.findById.bind(controller),
    findUnidadeFederativaByNome: controller.findByNome.bind(controller),
    findUnidadeFederativaBySigla: controller.findBySigla.bind(controller),
    updateUnidadeFederativa: controller.update.bind(controller),
    deleteUnidadeFederativa: controller.delete.bind(controller)
};
