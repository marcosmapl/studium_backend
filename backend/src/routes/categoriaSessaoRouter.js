const express = require("express");
const router = express.Router();
const controller = require("../controllers/CategoriaSessaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/categoriaSessao:
 *   post:
 *     summary: Cria uma nova categoria de sessão
 *     tags: [Categoria de Sessão]
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
 *                 description: Descrição da categoria
 *                 example: "Leitura"
 *     responses:
 *       201:
 *         description: Categoria de sessão criada com sucesso
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
 *                   example: "Leitura"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Categoria de sessão já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as categorias de sessão
 *     tags: [Categoria de Sessão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias de sessão ordenadas por descrição
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
 *                     example: "Leitura"
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
 * /api/categoriaSessao/descricao/exact/{descricao}:
 *   get:
 *     summary: Busca categoria de sessão por descrição exata
 *     tags: [Categoria de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da categoria de sessão
 *         example: "Leitura"
 *     responses:
 *       200:
 *         description: Categoria de sessão encontrada
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
 *         description: Nenhuma categoria de sessão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/exact/:descricao", verifyToken, controller.findUniqueByDescricao);

/**
 * @swagger
 * /api/categoriaSessao/descricao/search/{descricao}:
 *   get:
 *     summary: Busca categorias de sessão por descrição (busca parcial)
 *     tags: [Categoria de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da categoria de sessão (busca parcial)
 *         example: "Lei"
 *     responses:
 *       200:
 *         description: Categorias de sessão encontradas
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
 *         description: Nenhuma categoria de sessão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/categoriaSessao/{id}:
 *   get:
 *     summary: Busca uma categoria de sessão por ID
 *     tags: [Categoria de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de sessão
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria de sessão encontrada
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
 *         description: Categoria de sessão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma categoria de sessão
 *     tags: [Categoria de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de sessão
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
 *                 description: Nova descrição da categoria de sessão
 *                 example: "Exercícios"
 *     responses:
 *       200:
 *         description: Categoria de sessão atualizada com sucesso
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
 *         description: Categoria de sessão não encontrada
 *       409:
 *         description: Descrição da categoria de sessão já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma categoria de sessão
 *     tags: [Categoria de Sessão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de sessão
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria de sessão excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria de sessão excluída com sucesso"
 *       404:
 *         description: Categoria de sessão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
