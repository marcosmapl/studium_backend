const express = require("express");
const router = express.Router();
const categoriaAtendimentoController = require("../controllers/categoriaAtendimentoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/categoriasAtendimento:
 *   post:
 *     summary: Cria uma nova categoria de atendimento
 *     tags: [Categorias de Atendimento]
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
 *                 description: Descrição da categoria de atendimento
 *                 example: "Dúvida"
 *     responses:
 *       201:
 *         description: Categoria de atendimento criada com sucesso
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
 *                   example: "Dúvida"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Categoria de atendimento já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as categorias de atendimento
 *     tags: [Categorias de Atendimento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias de atendimento ordenadas por descrição
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
 *                     example: "Dúvida"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/",
  verifyToken,
  categoriaAtendimentoController.createCategoriaAtendimento
);
router.get(
  "/",
  verifyToken,
  categoriaAtendimentoController.findAllCategoriasAtendimento
);

/**
 * @swagger
 * /api/categoriasAtendimento/descricao/{descricao}:
 *   get:
 *     summary: Busca uma categoria de atendimento por descrição
 *     tags: [Categorias de Atendimento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da categoria de atendimento
 *         example: "Dúvida"
 *     responses:
 *       200:
 *         description: Categoria de atendimento encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Categoria de atendimento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/descricao/:descricao",
  verifyToken,
  categoriaAtendimentoController.findCategoriaAtendimentoByDescricao
);

/**
 * @swagger
 * /api/categoriasAtendimento/{id}:
 *   get:
 *     summary: Busca uma categoria de atendimento por ID
 *     tags: [Categorias de Atendimento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de atendimento
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria de atendimento encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Categoria de atendimento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma categoria de atendimento
 *     tags: [Categorias de Atendimento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de atendimento
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
 *                 description: Nova descrição da categoria de atendimento
 *                 example: "Reclamação"
 *     responses:
 *       200:
 *         description: Categoria de atendimento atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria de atendimento não encontrada
 *       409:
 *         description: Descrição já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma categoria de atendimento
 *     tags: [Categorias de Atendimento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria de atendimento
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria de atendimento excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria de atendimento excluída com sucesso"
 *       404:
 *         description: Categoria de atendimento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/:id",
  verifyToken,
  categoriaAtendimentoController.findCategoriaAtendimentoById
);
router.put(
  "/:id",
  verifyToken,
  categoriaAtendimentoController.updateCategoriaAtendimento
);
router.delete(
  "/:id",
  verifyToken,
  categoriaAtendimentoController.deleteCategoriaAtendimento
);

module.exports = router;
