const express = require("express");
const router = express.Router();
const categoriaVeiculoController = require("../controllers/categoriaVeiculoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/categoriasVeiculo:
 *   post:
 *     tags:
 *       - Categorias de Veículos
 *     summary: Criar nova categoria de veículo
 *     description: Cadastra uma nova categoria de veículo no sistema
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
 *                 example: SUV
 *                 description: Descrição da categoria (deve ser única)
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     descricao:
 *                       type: string
 *                       example: SUV
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos ou categoria já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  verifyToken,
  categoriaVeiculoController.createCategoriaVeiculo
);

/**
 * @swagger
 * /api/categoriasVeiculo:
 *   get:
 *     tags:
 *       - Categorias de Veículos
 *     summary: Listar todas as categorias de veículo
 *     description: Retorna lista completa de categorias cadastradas ordenadas por descrição
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
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
 *                     example: SUV
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/",
  verifyToken,
  categoriaVeiculoController.findAllCategoriasVeiculo
);

/**
 * @swagger
 * /api/categoriasVeiculo/descricao/{descricao}:
 *   get:
 *     tags:
 *       - Categorias de Veículos
 *     summary: Buscar categoria por descrição
 *     description: Busca uma categoria específica pela sua descrição
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da categoria a ser buscada
 *         example: SUV
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     descricao:
 *                       type: string
 *                       example: SUV
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/descricao/:descricao",
  verifyToken,
  categoriaVeiculoController.findCategoriaVeiculoByDescricao
);

/**
 * @swagger
 * /api/categoriasVeiculo/{id}:
 *   get:
 *     tags:
 *       - Categorias de Veículos
 *     summary: Buscar categoria por ID
 *     description: Retorna uma categoria específica pelo seu ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     descricao:
 *                       type: string
 *                       example: SUV
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/:id",
  verifyToken,
  categoriaVeiculoController.findCategoriaVeiculoById
);

/**
 * @swagger
 * /api/categoriasVeiculo/{id}:
 *   put:
 *     tags:
 *       - Categorias de Veículos
 *     summary: Atualizar categoria de veículo
 *     description: Atualiza os dados de uma categoria existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser atualizada
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
 *                 example: SUV Compacto
 *                 description: Nova descrição da categoria
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     descricao:
 *                       type: string
 *                       example: SUV Compacto
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  verifyToken,
  categoriaVeiculoController.updateCategoriaVeiculo
);

/**
 * @swagger
 * /api/categoriasVeiculo/{id}:
 *   delete:
 *     tags:
 *       - Categorias de Veículos
 *     summary: Excluir categoria de veículo
 *     description: Remove uma categoria do sistema (apenas se não houver veículos associados)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser excluída
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Categoria excluída com sucesso
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Categoria possui veículos associados e não pode ser excluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  verifyToken,
  categoriaVeiculoController.deleteCategoriaVeiculo
);

module.exports = router;
