const express = require("express");
const router = express.Router();
const controller = require("../controllers/SituacaoTopicoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/situacaoTopico:
 *   post:
 *     summary: Cria uma nova situação de tópico
 *     tags: [Situação de Tópico]
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
 *         description: Situação de tópico criada com sucesso
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
 *         description: Situação de tópico já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as situações de tópico
 *     tags: [Situação de Tópico]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de situações de tópico ordenadas por descrição
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
 *                   topicos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         titulo:
 *                           type: string
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/situacaoTopico/descricao/exact/{descricao}:
 *   get:
 *     summary: Busca situação de tópico por descrição exata
 *     tags: [Situação de Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da situação de tópico
 *         example: "Pendente"
 *     responses:
 *       200:
 *         description: Situação de tópico encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 topicos:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Nenhuma situação de tópico encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/exact/:descricao", verifyToken, controller.findUniqueByDescricao);

/**
 * @swagger
 * /api/situacaoTopico/descricao/search/{descricao}:
 *   get:
 *     summary: Busca situações de tópico por descrição (busca parcial)
 *     tags: [Situação de Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação de tópico (busca parcial)
 *         example: "Pen"
 *     responses:
 *       200:
 *         description: Situações de tópico encontradas
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
 *                   topicos:
 *                     type: array
 *                     items:
 *                       type: object
 *       404:
 *         description: Nenhuma situação de tópico encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/situacaoTopico/{id}:
 *   get:
 *     summary: Busca uma situação de tópico por ID
 *     tags: [Situação de Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de tópico
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de tópico encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 topicos:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Situação de tópico não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma situação de tópico
 *     tags: [Situação de Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de tópico
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
 *                 description: Nova descrição da situação de tópico
 *                 example: "Em Progresso"
 *     responses:
 *       200:
 *         description: Situação de tópico atualizada com sucesso
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
 *         description: Situação de tópico não encontrada
 *       409:
 *         description: Descrição da situação de tópico já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma situação de tópico
 *     tags: [Situação de Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de tópico
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de tópico excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Situação de tópico excluída com sucesso"
 *       404:
 *         description: Situação de tópico não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
