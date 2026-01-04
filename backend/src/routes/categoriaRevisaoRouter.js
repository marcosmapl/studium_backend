const express = require("express");
const router = express.Router();
const controller = require("../controllers/CategoriaRevisaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/categoriaRevisao:
 *   post:
 *     summary: Cria uma nova categoria de revisão
 *     tags: [Categoria de Revisão]
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
 *                 example: "Primeira Revisão"
 *     responses:
 *       201:
 *         description: Categoria de revisão criada com sucesso
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
 *                   example: "Primeira Revisão"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Categoria de revisão já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as categorias de revisão
 *     tags: [Categoria de Revisão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias de revisão ordenadas por descrição
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
 *                     example: "Primeira Revisão"
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
 * /api/categoriaRevisao/descricao/exact/{descricao}:
 *   get:
 *     summary: Busca categoria de revisão por descrição exata
 *     tags: [Categoria de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da categoria de revisão
 *         example: "Primeira Revisão"
 *     responses:
 *       200:
 *         description: Categoria de revisão encontrada
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
 *         description: Nenhuma categoria de revisão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/exact/:descricao", verifyToken, controller.findUniqueByDescricao);

/**
 * @swagger
 * /api/categoriaRevisao/descricao/search/{descricao}:
 *   get:
 *     summary: Busca categorias de revisão por descrição (busca parcial)
 *     tags: [Categoria de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da categoria de revisão (busca parcial)
 *         example: "Primeira"
 *     responses:
 *       200:
 *         description: Categorias de revisão encontradas
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
 *         description: Nenhuma categoria de revisão encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/categoriaRevisao/{id}:
 *   get:
 *     summary: Busca uma categoria de revisão por ID
 *     tags: [Categoria de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de revisão
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria de revisão encontrada
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
 *         description: Categoria de revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma categoria de revisão
 *     tags: [Categoria de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de revisão
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
 *                 description: Nova descrição da categoria de revisão
 *                 example: "Segunda Revisão"
 *     responses:
 *       200:
 *         description: Categoria de revisão atualizada com sucesso
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
 *         description: Categoria de revisão não encontrada
 *       409:
 *         description: Descrição da categoria de revisão já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma categoria de revisão
 *     tags: [Categoria de Revisão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de revisão
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria de revisão excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria de revisão excluída com sucesso"
 *       404:
 *         description: Categoria de revisão não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
