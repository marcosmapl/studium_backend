const express = require("express");
const router = express.Router();
const controller = require("../controllers/SituacaoPlanoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/situacaoPlano:
 *   post:
 *     summary: Cria uma nova situação de plano de estudo
 *     tags: [Situação de Plano de Estudo]
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
 *                 example: "Ativo"
 *     responses:
 *       201:
 *         description: Situação de plano de estudo criada com sucesso
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
 *                   example: "Ativo"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Situação de plano de estudo já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos as situações de plano de estudo
 *     tags: [Situação de Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de situações de plano de estudo ordenadas por descrição
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
 *                     example: "Ativo"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/sitiuacaoPlano/descricao/exact/{descricao}:
 *   get:
 *     summary: Busca situação de plano de estudo por descrição exata
 *     tags: [Situação de Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da situação de plano de estudo
 *         example: "Ativo"
 *     responses:
 *       200:
 *         description: Situação de plano de estudo encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *       404:
 *         description: Nenhuma situação de plano de estudo encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/exact/:descricao", verifyToken, controller.findUniqueByDescricao);

/**
 * @swagger
 * /api/situacaoPlano/descricao/search/{descricao}:
 *   get:
 *     summary: Busca situações de plano de estudo por descrição (busca parcial)
 *     tags: [Situação de Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação de plano de estudo (busca parcial)
 *         example: "Ati"
 *     responses:
 *       200:
 *         description: Situações de plano de estudo encontradas
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
 *       404:
 *         description: Nenhuma situação de plano de estudo encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/situacaoPlano/{id}:
 *   get:
 *     summary: Busca uma situação de plano de estudo por ID
 *     tags: [Situação de Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de plano de estudo encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *       404:
 *         description: Situação de plano de estudo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma situação de plano de estudo
 *     tags: [Situação de Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de plano de estudo
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
 *                 description: Nova descrição da situação de plano de estudo
 *                 example: "Inativo"
 *     responses:
 *       200:
 *         description: Situação de plano de estudo atualizada com sucesso
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
 *         description: Situação de plano de estudo não encontrada
 *       409:
 *         description: Descrição da situação de plano de estudo já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma situação de plano de estudo
 *     tags: [Situação de Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de plano de estudo excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Situação de plano de estudo excluída com sucesso"
 *       404:
 *         description: Situação de plano de estudo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
