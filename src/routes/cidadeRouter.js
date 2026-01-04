const express = require("express");
const router = express.Router();
const controller = require("../controllers/CidadeController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/cidade:
 *   post:
 *     summary: Cria uma nova cidade
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cidade
 *               - unidadeFederativaId
 *             properties:
 *               cidade:
 *                 type: string
 *                 description: Nome da cidade
 *                 example: "Brasília"
 *               unidadeFederativaId:
 *                 type: integer
 *                 description: ID da Unidade Federativa
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 cidade:
 *                   type: string
 *                   example: "Brasília"
 *                 unidadeFederativaId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Cidade já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as cidades
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cidades ordenadas por nome
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
 *                   cidade:
 *                     type: string
 *                     example: "Brasília"
 *                   unidadeFederativaId:
 *                     type: integer
 *                     example: 1
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/cidade/descricao/{descricao}/uf/{unidadeFederativaId}:
 *   get:
 *     summary: Busca cidade por descrição exata e Unidade Federativa
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da cidade
 *         example: "Brasília"
 *       - in: path
 *         name: unidadeFederativaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da Unidade Federativa
 *         example: 1
 *     responses:
 *       200:
 *         description: Cidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 unidadeFederativaId:
 *                   type: integer
 *       404:
 *         description: Nenhuma cidade encontrada com essa descrição e UF
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/:descricao/uf/:unidadeFederativaId", verifyToken, controller.findByDescricaoAndUF);

/**
 * @swagger
 * /api/cidade/descricao/search/{descricao}:
 *   get:
 *     summary: Busca cidades por descrição (busca parcial)
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da cidade (busca parcial)
 *         example: "Brasí"
 *     responses:
 *       200:
 *         description: Cidades encontradas
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
 *                   unidadeFederativaId:
 *                     type: integer
 *       404:
 *         description: Nenhuma cidade encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/cidade/uf/{unidadeFederativaId}:
 *   get:
 *     summary: Busca todas as cidades de uma Unidade Federativa
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unidadeFederativaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da Unidade Federativa
 *         example: 1
 *     responses:
 *       200:
 *         description: Cidades encontradas
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
 *                   unidadeFederativaId:
 *                     type: integer
 *       404:
 *         description: Nenhuma cidade encontrada para esta UF
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
    "/uf/:unidadeFederativaId",
    verifyToken,
    controller.findManyByUnidadeFederativa
);

/**
 * @swagger
 * /api/cidade/{id}:
 *   get:
 *     summary: Busca uma cidade por ID
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Cidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 unidadeFederativaId:
 *                   type: integer
 *       404:
 *         description: Cidade não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma cidade
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
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
 *                 description: Nova descrição da cidade
 *                 example: "São Paulo"
 *               unidadeFederativaId:
 *                 type: integer
 *                 description: Novo ID da Unidade Federativa
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 unidadeFederativaId:
 *                   type: integer
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cidade não encontrada
 *       409:
 *         description: Descrição da cidade já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma cidade
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Cidade excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cidade excluída com sucesso"
 *       404:
 *         description: Cidade não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
