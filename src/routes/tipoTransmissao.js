const express = require("express");
const router = express.Router();
const tipoTransmissaoController = require("../controllers/tipoTransmissaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/tiposTransmissao:
 *   post:
 *     summary: Cria um novo tipo de transmissão
 *     tags: [Tipos de Transmissão]
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
 *                 description: Descrição do tipo de transmissão
 *                 example: "MANUAL"
 *     responses:
 *       201:
 *         description: Tipo de transmissão criado com sucesso
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
 *                   example: "MANUAL"
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
 *         description: Tipo de transmissão já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os tipos de transmissão
 *     tags: [Tipos de Transmissão]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de transmissão ordenados por descrição
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
 *                     example: "MANUAL"
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
router.post("/", verifyToken, tipoTransmissaoController.createTipoTransmissao);
router.get("/", verifyToken, tipoTransmissaoController.findAllTiposTransmissao);

/**
 * @swagger
 * /api/tiposTransmissao/{id}:
 *   get:
 *     summary: Busca um tipo de transmissão por ID
 *     tags: [Tipos de Transmissão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de transmissão
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo de transmissão encontrado
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
 *         description: Tipo de transmissão não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um tipo de transmissão
 *     tags: [Tipos de Transmissão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de transmissão
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
 *                 description: Nova descrição do tipo de transmissão
 *                 example: "AUTOMÁTICA"
 *     responses:
 *       200:
 *         description: Tipo de transmissão atualizado com sucesso
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
 *         description: Tipo de transmissão não encontrado
 *       409:
 *         description: Descrição já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um tipo de transmissão
 *     tags: [Tipos de Transmissão]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de transmissão
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo de transmissão excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de transmissão excluído com sucesso"
 *       404:
 *         description: Tipo de transmissão não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/:id",
  verifyToken,
  tipoTransmissaoController.findTipoTransmissaoById
);
router.put(
  "/:id",
  verifyToken,
  tipoTransmissaoController.updateTipoTransmissao
);
router.delete(
  "/:id",
  verifyToken,
  tipoTransmissaoController.deleteTipoTransmissao
);

module.exports = router;
