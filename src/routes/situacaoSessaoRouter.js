const express = require("express");
const router = express.Router();
const controller = require("../controllers/SituacaoSessaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/situacaoSessao:
 *   post:
 *     summary: Cria uma nova situação de sessão
 *     tags: [Situação de Sessão]
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
 *                 example: "Planejada"
 *     responses:
 *       201:
 *         description: Situação de sessão criada com sucesso
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
 *                   example: "Planejada"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Situação de sessão já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as situações de sessão
 *     tags: [Situação de Sessão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de situações de sessão ordenadas por descrição
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
 *                     example: "Planejada"
 *                   sessoesEstudo:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         dataInicio:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/situacaoSessao/descricao/exact/{descricao}:
 *   get:
 *     summary: Busca situação de sessão por descrição exata
 *     tags: [Situação de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da situação de sessão
 *         example: "Planejada"
 *     responses:
 *       200:
 *         description: Situação de sessão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 sessoesEstudo:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Nenhuma situação de sessão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/exact/:descricao", verifyToken, controller.findUniqueByDescricao);

/**
 * @swagger
 * /api/situacaoSessao/descricao/search/{descricao}:
 *   get:
 *     summary: Busca situações de sessão por descrição (busca parcial)
 *     tags: [Situação de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação de sessão (busca parcial)
 *         example: "Plan"
 *     responses:
 *       200:
 *         description: Situações de sessão encontradas
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
 *                   sessoesEstudo:
 *                     type: array
 *                     items:
 *                       type: object
 *       404:
 *         description: Nenhuma situação de sessão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/situacaoSessao/{id}:
 *   get:
 *     summary: Busca uma situação de sessão por ID
 *     tags: [Situação de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de sessão
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de sessão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 sessoesEstudo:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Situação de sessão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma situação de sessão
 *     tags: [Situação de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de sessão
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
 *                 description: Nova descrição da situação de sessão
 *                 example: "Concluída"
 *     responses:
 *       200:
 *         description: Situação de sessão atualizada com sucesso
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
 *         description: Situação de sessão não encontrada
 *       409:
 *         description: Descrição da situação de sessão já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma situação de sessão
 *     tags: [Situação de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de sessão
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de sessão excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Situação de sessão excluída com sucesso"
 *       404:
 *         description: Situação de sessão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
