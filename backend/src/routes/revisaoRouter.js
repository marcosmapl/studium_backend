const express = require("express");
const router = express.Router();
const controller = require("../controllers/RevisaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/revisao:
 *   post:
 *     summary: Cria uma nova revisão
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero
 *               - dataProgramada
 *               - desempenho
 *               - categoriaRevisaoId
 *               - situacaoRevisaoId
 *               - planoEstudoId
 *               - disciplinaId
 *               - topicoId
 *             properties:
 *               numero:
 *                 type: integer
 *                 description: Número da revisão
 *                 example: 1
 *               dataProgramada:
 *                 type: string
 *                 format: date-time
 *                 description: Data programada para a revisão
 *               dataRealizada:
 *                 type: string
 *                 format: date-time
 *                 description: Data em que a revisão foi realizada (opcional)
 *               tempoEstudo:
 *                 type: number
 *                 description: Tempo de estudo em horas
 *                 example: 0.0
 *               questoesAcertos:
 *                 type: integer
 *                 description: Número de questões acertadas
 *                 example: 0
 *               questoesErros:
 *                 type: integer
 *                 description: Número de questões erradas
 *                 example: 0
 *               desempenho:
 *                 type: integer
 *                 description: Desempenho da revisão
 *                 example: 85
 *               categoriaRevisaoId:
 *                 type: integer
 *                 description: ID da categoria de revisão
 *                 example: 1
 *               situacaoRevisaoId:
 *                 type: integer
 *                 description: ID da situação de revisão
 *                 example: 1
 *               planoEstudoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *                 example: 1
 *               topicoId:
 *                 type: integer
 *                 description: ID do tópico
 *                 example: 1
 *     responses:
 *       201:
 *         description: Revisão criada com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as revisões
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de revisões ordenadas por data programada (mais recentes primeiro)
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
 * /api/revisao/categoria/{categoriaRevisaoId}:
 *   get:
 *     summary: Busca todas as revisões por categoria
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoriaRevisaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de revisão
 *         example: 1
 *     responses:
 *       200:
 *         description: Revisões encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma revisão encontrada para esta categoria
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/revisao/planoEstudo/{planoEstudoId}:
 *   get:
 *     summary: Busca todas as revisões de um plano de estudo
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planoEstudoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Revisões encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma revisão encontrada para este plano
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/planoEstudo/:planoEstudoId", verifyToken, controller.findManyByPlanoEstudoId);

/**
 * @swagger
 * /api/revisao/disciplina/{disciplinaId}:
 *   get:
 *     summary: Busca todas as revisões de uma disciplina
 *     tags: [Revisão]
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
 *         description: Revisões encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma revisão encontrada para esta disciplina
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/disciplina/:disciplinaId", verifyToken, controller.findManyByDisciplinaId);

/**
 * @swagger
 * /api/revisao/topico/{topicoId}:
 *   get:
 *     summary: Busca todas as revisões de um tópico
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tópico
 *         example: 1
 *     responses:
 *       200:
 *         description: Revisões encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma revisão encontrada para este tópico
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/topico/:topicoId", verifyToken, controller.findManyByTopicoId);

/**
 * @swagger
 * /api/revisao/{id}:
 *   get:
 *     summary: Busca uma revisão por ID
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da revisão
 *         example: 1
 *     responses:
 *       200:
 *         description: Revisão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma revisão
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da revisão
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *                 description: Número da revisão
 *               dataProgramada:
 *                 type: string
 *                 format: date-time
 *                 description: Data programada para a revisão
 *               dataRealizada:
 *                 type: string
 *                 format: date-time
 *                 description: Data em que a revisão foi realizada
 *               tempoEstudo:
 *                 type: number
 *                 description: Tempo de estudo em horas
 *               questoesAcertos:
 *                 type: integer
 *                 description: Número de questões acertadas
 *               questoesErros:
 *                 type: integer
 *                 description: Número de questões erradas
 *               desempenho:
 *                 type: integer
 *                 description: Desempenho da revisão
 *               categoriaRevisaoId:
 *                 type: integer
 *                 description: ID da categoria de revisão
 *               situacaoRevisaoId:
 *                 type: integer
 *                 description: ID da situação de revisão
 *               planoEstudoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *               topicoId:
 *                 type: integer
 *                 description: ID do tópico
 *     responses:
 *       200:
 *         description: Revisão atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma revisão
 *     tags: [Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da revisão
 *         example: 1
 *     responses:
 *       204:
 *         description: Revisão excluída com sucesso
 *       404:
 *         description: Revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
