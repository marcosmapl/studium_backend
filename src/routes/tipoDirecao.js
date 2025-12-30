const express = require("express");
const router = express.Router();
const tipoDirecaoController = require("../controllers/tipoDirecaoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/tiposDirecao:
 *   post:
 *     summary: Cria um novo tipo de direção
 *     tags: [Tipos de Direção]
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
 *                 description: Descrição do tipo de direção
 *                 example: "HIDRÁULICA"
 *     responses:
 *       201:
 *         description: Tipo de direção criado com sucesso
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
 *                   example: "HIDRÁULICA"
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
 *         description: Tipo de direção já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os tipos de direção
 *     tags: [Tipos de Direção]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de direção ordenados por descrição
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
 *                     example: "HIDRÁULICA"
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
router.post("/", verifyToken, tipoDirecaoController.createTipoDirecao);
router.get("/", verifyToken, tipoDirecaoController.findAllTiposDirecao);
router.get("/descricao/:descricao", verifyToken, tipoDirecaoController.findTipoDirecaoByDescricao);

/**
 * @swagger
 * /api/tiposDirecao/{id}:
 *   get:
 *     summary: Busca um tipo de direção por ID
 *     tags: [Tipos de Direção]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de direção
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo de direção encontrado
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
 *         description: Tipo de direção não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um tipo de direção
 *     tags: [Tipos de Direção]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de direção
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
 *                 description: Nova descrição do tipo de direção
 *                 example: "ELÉTRICA"
 *     responses:
 *       200:
 *         description: Tipo de direção atualizado com sucesso
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
 *         description: Tipo de direção não encontrado
 *       409:
 *         description: Descrição já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um tipo de direção
 *     tags: [Tipos de Direção]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de direção
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo de direção excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de direção excluído com sucesso"
 *       404:
 *         description: Tipo de direção não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, tipoDirecaoController.findTipoDirecaoById);
router.put("/:id", verifyToken, tipoDirecaoController.updateTipoDirecao);
router.delete("/:id", verifyToken, tipoDirecaoController.deleteTipoDirecao);

module.exports = router;
