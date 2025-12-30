const express = require("express");
const router = express.Router();
const situacaoVeiculoController = require("../controllers/situacaoVeiculoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/situacoesVeiculo:
 *   post:
 *     summary: Cria uma nova situação de veículo
 *     tags: [Situações de Veículo]
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
 *                 description: Descrição da situação do veículo
 *                 example: "DISPONÍVEL"
 *     responses:
 *       201:
 *         description: Situação de veículo criada com sucesso
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
 *                   example: "DISPONÍVEL"
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
 *         description: Situação de veículo já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as situações de veículo
 *     tags: [Situações de Veículo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de situações de veículo ordenadas por descrição
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
 *                     example: "DISPONÍVEL"
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
router.post("/", verifyToken, situacaoVeiculoController.createSituacaoVeiculo);
router.get("/", verifyToken, situacaoVeiculoController.findAllSituacoesVeiculo);

/**
 * @swagger
 * /api/situacaoVeiculo/descricao/{descricao}:
 *   get:
 *     summary: Busca uma situação de veículo por descrição
 *     tags: [Situações de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação do veículo
 *         example: "NOVO"
 *     responses:
 *       200:
 *         description: Situação do veículo encontrada
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
 *         description: Situação do veículo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/descricao/:descricao",
  verifyToken,
  situacaoVeiculoController.findSituacaoVeiculoByDescricao
);

/**
 * @swagger
 * /api/situacoesVeiculo/{id}:
 *   get:
 *     summary: Busca uma situação de veículo por ID
 *     tags: [Situações de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de veículo encontrada
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
 *         description: Situação de veículo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma situação de veículo
 *     tags: [Situações de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de veículo
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
 *                 description: Nova descrição da situação
 *                 example: "VENDIDO"
 *     responses:
 *       200:
 *         description: Situação de veículo atualizada com sucesso
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
 *         description: Situação de veículo não encontrada
 *       409:
 *         description: Descrição já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma situação de veículo
 *     tags: [Situações de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de veículo excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Situação de veículo excluída com sucesso"
 *       404:
 *         description: Situação de veículo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/:id",
  verifyToken,
  situacaoVeiculoController.findSituacaoVeiculoById
);
router.put(
  "/:id",
  verifyToken,
  situacaoVeiculoController.updateSituacaoVeiculo
);
router.delete(
  "/:id",
  verifyToken,
  situacaoVeiculoController.deleteSituacaoVeiculo
);

module.exports = router;
