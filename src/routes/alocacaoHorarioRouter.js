const express = require("express");
const router = express.Router();
const AlocacaoHorarioController = require("../controllers/AlocacaoHorarioController");
const { verifyToken } = require("../middleware/auth");

const controller = new AlocacaoHorarioController();

/**
 * @swagger
 * tags:
 *   name: Alocação Horário
 *   description: Gerenciamento de alocações de horário
 */

/**
 * @swagger
 * /api/alocacaoHorario:
 *   post:
 *     summary: Cria uma nova alocação de horário
 *     tags: [Alocação Horário]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - horasAlocadas
 *               - ordem
 *               - diaEstudoId
 *               - disciplinaCronogramaId
 *             properties:
 *               horasAlocadas:
 *                 type: number
 *                 description: Horas alocadas para a disciplina no dia
 *               ordem:
 *                 type: integer
 *                 description: Ordem da disciplina no dia
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre a alocação
 *               diaEstudoId:
 *                 type: integer
 *                 description: ID do dia de estudo
 *               disciplinaCronogramaId:
 *                 type: integer
 *                 description: ID da disciplina de planejamento
 *     responses:
 *       201:
 *         description: Alocação de horário criada com sucesso
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
 * /api/alocacaoHorario:
 *   get:
 *     summary: Retorna todas as alocações de horário
 *     tags: [Alocação Horário]
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
 *         description: Lista de alocações de horário
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", verifyToken, (req, res) => controller.findAll(req, res));

/**
 * @swagger
 * /api/alocacaoHorario/diaEstudo/{diaEstudoId}:
 *   get:
 *     summary: Retorna todas as alocações de horário de um dia de estudo
 *     tags: [Alocação Horário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diaEstudoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do dia de estudo
 *     responses:
 *       200:
 *         description: Lista de alocações de horário do dia de estudo
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/diaEstudo/:diaEstudoId", verifyToken, (req, res, next) =>
  controller.findManyByDiaEstudoId(req, res, next)
);

/**
 * @swagger
 * /api/alocacaoHorario/disciplinaCronograma/{disciplinaCronogramaId}:
 *   get:
 *     summary: Retorna todas as alocações de horário de uma disciplina de planejamento
 *     tags: [Alocação Horário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disciplinaCronogramaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina de planejamento
 *     responses:
 *       200:
 *         description: Lista de alocações de horário da disciplina de planejamento
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/disciplinaCronograma/:disciplinaCronogramaId", verifyToken, (req, res, next) =>
  controller.findManyByDisciplinaCronogramaId(req, res, next)
);

/**
 * @swagger
 * /api/alocacaoHorario/{id}:
 *   get:
 *     summary: Retorna uma alocação de horário pelo ID
 *     tags: [Alocação Horário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da alocação de horário
 *     responses:
 *       200:
 *         description: Alocação de horário encontrada
 *       404:
 *         description: Alocação de horário não encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, (req, res) => controller.findById(req, res));

/**
 * @swagger
 * /api/alocacaoHorario/{id}:
 *   put:
 *     summary: Atualiza uma alocação de horário
 *     tags: [Alocação Horário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da alocação de horário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horasAlocadas:
 *                 type: number
 *                 description: Horas alocadas para a disciplina no dia
 *               ordem:
 *                 type: integer
 *                 description: Ordem da disciplina no dia
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre a alocação
 *               diaEstudoId:
 *                 type: integer
 *                 description: ID do dia de estudo
 *               disciplinaCronogramaId:
 *                 type: integer
 *                 description: ID da disciplina de planejamento
 *     responses:
 *       200:
 *         description: Alocação de horário atualizada com sucesso
 *       404:
 *         description: Alocação de horário não encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/alocacaoHorario/{id}:
 *   delete:
 *     summary: Exclui uma alocação de horário
 *     tags: [Alocação Horário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da alocação de horário
 *     responses:
 *       200:
 *         description: Alocação de horário excluída com sucesso
 *       404:
 *         description: Alocação de horário não encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));

module.exports = router;
