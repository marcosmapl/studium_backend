const express = require("express");
const router = express.Router();
const controller = require("../controllers/DisciplinaPlanejamentoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/disciplinaPlanejamento:
 *   post:
 *     summary: Cria uma nova disciplina de planejamento
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - importancia
 *               - conhecimento
 *               - prioridade
 *               - horasSemanais
 *               - percentualCarga
 *               - planejamentoId
 *               - disciplinaId
 *             properties:
 *               importancia:
 *                 type: number
 *                 description: Peso da disciplina na prova (0-10)
 *                 example: 8.5
 *               conhecimento:
 *                 type: number
 *                 description: Nível de conhecimento atual (0-10)
 *                 example: 5.0
 *               prioridade:
 *                 type: number
 *                 description: Prioridade calculada (importancia / conhecimento)
 *                 example: 1.7
 *               horasSemanais:
 *                 type: number
 *                 description: Horas semanais alocadas
 *                 example: 10.0
 *               percentualCarga:
 *                 type: number
 *                 description: Percentual da carga total
 *                 example: 25.0
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *                 example: "Revisar conceitos básicos"
 *               planejamentoId:
 *                 type: integer
 *                 description: ID do planejamento
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *                 example: 1
 *     responses:
 *       201:
 *         description: Disciplina de planejamento criada com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as disciplinas de planejamento
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disciplinas ordenadas por prioridade (maior primeiro)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/disciplinaPlanejamento/planejamento/{planejamentoId}:
 *   get:
 *     summary: Busca todas as disciplinas de um planejamento
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planejamentoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do planejamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Disciplinas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma disciplina encontrada para este planejamento
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/planejamento/:planejamentoId", verifyToken, controller.findManyByPlanejamentoId);

/**
 * @swagger
 * /api/disciplinaPlanejamento/disciplina/{disciplinaId}:
 *   get:
 *     summary: Busca todos os planejamentos de uma disciplina
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *         example: 1
 *     responses:
 *       200:
 *         description: Planejamentos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhum planejamento encontrado para esta disciplina
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/disciplina/:disciplinaId", verifyToken, controller.findManyByDisciplinaId);

/**
 * @swagger
 * /api/disciplinaPlanejamento/{id}:
 *   get:
 *     summary: Busca uma disciplina de planejamento por ID
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina de planejamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Disciplina de planejamento encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Disciplina de planejamento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma disciplina de planejamento existente
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina de planejamento
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               importancia:
 *                 type: number
 *                 description: Peso da disciplina na prova (0-10)
 *                 example: 9.0
 *               conhecimento:
 *                 type: number
 *                 description: Nível de conhecimento atual (0-10)
 *                 example: 6.0
 *               prioridade:
 *                 type: number
 *                 description: Prioridade calculada (importancia / conhecimento)
 *                 example: 1.5
 *               horasSemanais:
 *                 type: number
 *                 description: Horas semanais alocadas
 *                 example: 12.0
 *               percentualCarga:
 *                 type: number
 *                 description: Percentual da carga total
 *                 example: 30.0
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *               planejamentoId:
 *                 type: integer
 *                 description: ID do planejamento
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina de planejamento atualizada com sucesso
 *       404:
 *         description: Disciplina de planejamento não encontrada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Remove uma disciplina de planejamento
 *     tags: [Disciplina Planejamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina de planejamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Disciplina de planejamento removida com sucesso
 *       404:
 *         description: Disciplina de planejamento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
