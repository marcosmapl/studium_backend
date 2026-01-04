const express = require("express");
const router = express.Router();
const PlanejamentoController = require("../controllers/PlanejamentoController");
const { verifyToken } = require("../middleware/auth");

const controller = new PlanejamentoController();

/**
 * @swagger
 * tags:
 *   name: Planejamento
 *   description: Gerenciamento de planejamentos semanais
 */

/**
 * @swagger
 * /api/planejamento:
 *   post:
 *     summary: Cria um novo planejamento
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataInicio
 *               - ativo
 *               - totalHorasSemana
 *               - quantidadeDias
 *               - planoEstudoId
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Data de início do planejamento
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *                 description: Data de fim do planejamento (opcional)
 *               ativo:
 *                 type: boolean
 *                 description: Se o planejamento está ativo
 *               totalHorasSemana:
 *                 type: number
 *                 description: Total de horas disponíveis na semana
 *               quantidadeDias:
 *                 type: integer
 *                 description: Quantidade de dias de estudo na semana
 *               planoEstudoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *     responses:
 *       201:
 *         description: Planejamento criado com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /api/planejamento:
 *   get:
 *     summary: Retorna todos os planejamentos
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de planejamentos
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", verifyToken, (req, res) => controller.findAll(req, res));

/**
 * @swagger
 * /api/planejamento/planoEstudo/{planoEstudoId}:
 *   get:
 *     summary: Retorna todos os planejamentos de um plano de estudo
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planoEstudoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *     responses:
 *       200:
 *         description: Lista de planejamentos do plano de estudo
 *       404:
 *         description: Nenhum planejamento encontrado
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/planoEstudo/:planoEstudoId", verifyToken, (req, res, next) =>
  controller.findManyByPlanoEstudoId(req, res, next)
);

/**
 * @swagger
 * /api/planejamento/ativos:
 *   get:
 *     summary: Retorna todos os planejamentos ativos
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planejamentos ativos
 *       404:
 *         description: Nenhum planejamento ativo encontrado
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/ativos", verifyToken, (req, res, next) =>
  controller.findManyByAtivo(req, res, next)
);

/**
 * @swagger
 * /api/planejamento/{id}:
 *   get:
 *     summary: Retorna um planejamento pelo ID
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do planejamento
 *     responses:
 *       200:
 *         description: Planejamento encontrado
 *       404:
 *         description: Planejamento não encontrado
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, (req, res) => controller.findById(req, res));

/**
 * @swagger
 * /api/planejamento/{id}:
 *   put:
 *     summary: Atualiza um planejamento
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do planejamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Data de início do planejamento
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *                 description: Data de fim do planejamento
 *               ativo:
 *                 type: boolean
 *                 description: Se o planejamento está ativo
 *               totalHorasSemana:
 *                 type: number
 *                 description: Total de horas disponíveis na semana
 *               quantidadeDias:
 *                 type: integer
 *                 description: Quantidade de dias de estudo na semana
 *               planoEstudoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *     responses:
 *       200:
 *         description: Planejamento atualizado com sucesso
 *       404:
 *         description: Planejamento não encontrado
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/planejamento/{id}:
 *   delete:
 *     summary: Exclui um planejamento
 *     tags: [Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do planejamento
 *     responses:
 *       204:
 *         description: Planejamento excluído com sucesso
 *       404:
 *         description: Planejamento não encontrado
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));

module.exports = router;
