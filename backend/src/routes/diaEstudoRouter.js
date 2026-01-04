const express = require("express");
const router = express.Router();
const controller = require("../controllers/DiaEstudoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/diaEstudo:
 *   post:
 *     summary: Cria um novo dia de estudo
 *     tags: [Dia Estudo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diaSemana
 *               - horasPlanejadas
 *               - planejamentoId
 *             properties:
 *               diaSemana:
 *                 type: integer
 *                 description: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *               horasPlanejadas:
 *                 type: number
 *                 description: Horas planejadas para estudo no dia
 *                 example: 4.0
 *               planejamentoId:
 *                 type: integer
 *                 description: ID do planejamento
 *                 example: 1
 *     responses:
 *       201:
 *         description: Dia de estudo criado com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os dias de estudo
 *     tags: [Dia Estudo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dias de estudo ordenados por dia da semana
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
 * /api/diaEstudo/planejamento/{planejamentoId}:
 *   get:
 *     summary: Busca todos os dias de estudo de um planejamento
 *     tags: [Dia Estudo]
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
 *         description: Dias de estudo encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhum dia de estudo encontrado para este planejamento
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/planejamento/:planejamentoId", verifyToken, controller.findManyByPlanejamentoId);

/**
 * @swagger
 * /api/diaEstudo/diaSemana/{diaSemana}:
 *   get:
 *     summary: Busca dias de estudo por dia da semana
 *     tags: [Dia Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: diaSemana
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *         description: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *         example: 1
 *     responses:
 *       200:
 *         description: Dias de estudo encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhum dia de estudo encontrado para este dia da semana
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/diaSemana/:diaSemana", verifyToken, controller.findManyByDiaSemana);

/**
 * @swagger
 * /api/diaEstudo/{id}:
 *   get:
 *     summary: Busca um dia de estudo por ID
 *     tags: [Dia Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do dia de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Dia de estudo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Dia de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um dia de estudo existente
 *     tags: [Dia Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do dia de estudo
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diaSemana:
 *                 type: integer
 *                 description: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 2
 *               horasPlanejadas:
 *                 type: number
 *                 description: Horas planejadas para estudo no dia
 *                 example: 5.0
 *               planejamentoId:
 *                 type: integer
 *                 description: ID do planejamento
 *     responses:
 *       200:
 *         description: Dia de estudo atualizado com sucesso
 *       404:
 *         description: Dia de estudo não encontrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Remove um dia de estudo
 *     tags: [Dia Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do dia de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Dia de estudo removido com sucesso
 *       404:
 *         description: Dia de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
