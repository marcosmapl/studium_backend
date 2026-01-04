const express = require("express");
const router = express.Router();
const controller = require("../controllers/SituacaoRevisaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/situacaoRevisao:
 *   post:
 *     summary: Cria uma nova situação de revisão
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Descrição da situação
 *                 example: "Pendente"
 *     responses:
 *       201:
 *         description: Situação de revisão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 descricao:
 *                   type: string
 *                   example: "Pendente"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Situação de revisão já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as situações de revisão
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de situações de revisão ordenadas por descrição
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   descricao:
 *                     type: string
 *                     example: "Pendente"
 *                   revisoes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         numero:
 *                           type: integer
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/situacaoRevisao/descricao/exact/{descricao}:
 *   get:
 *     summary: Busca situação de revisão por descrição exata
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da situação de revisão
 *         example: "Pendente"
 *     responses:
 *       200:
 *         description: Situação de revisão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 revisoes:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Nenhuma situação de revisão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/exact/:descricao", verifyToken, controller.findUniqueByDescricao);

/**
 * @swagger
 * /api/situacaoRevisao/descricao/search/{descricao}:
 *   get:
 *     summary: Busca situações de revisão por descrição (busca parcial)
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação de revisão (busca parcial)
 *         example: "Pend"
 *     responses:
 *       200:
 *         description: Situações de revisão encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descricao:
 *                     type: string
 *                   revisoes:
 *                     type: array
 *                     items:
 *                       type: object
 *       404:
 *         description: Nenhuma situação de revisão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/situacaoRevisao/{id}:
 *   get:
 *     summary: Busca uma situação de revisão por ID
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de revisão
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de revisão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 revisoes:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Situação de revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma situação de revisão
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de revisão
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Nova descrição da situação de revisão
 *                 example: "Concluída"
 *     responses:
 *       200:
 *         description: Situação de revisão atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Situação de revisão não encontrada
 *       409:
 *         description: Descrição da situação de revisão já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma situação de revisão
 *     tags: [Situação de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de revisão
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de revisão excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Situação de revisão excluída com sucesso"
 *       404:
 *         description: Situação de revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
