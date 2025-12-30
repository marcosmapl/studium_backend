const express = require("express");
const router = express.Router();
const estadoVeiculoController = require("../controllers/estadoVeiculoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/estadosVeiculo:
 *   post:
 *     summary: Cria um novo estado de veículo
 *     tags: [Estados de Veículo]
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
 *                 description: Descrição do estado do veículo
 *                 example: "NOVO"
 *     responses:
 *       201:
 *         description: Estado de veículo criado com sucesso
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
 *                   example: "NOVO"
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
 *         description: Estado de veículo já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os estados de veículo
 *     tags: [Estados de Veículo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados de veículo ordenados por descrição
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
 *                     example: "NOVO"
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
router.post("/", verifyToken, estadoVeiculoController.createEstadoVeiculo);
router.get("/", verifyToken, estadoVeiculoController.findAllEstadoVeiculo);

/**
 * @swagger
 * /api/estadosVeiculo/descricao/{descricao}:
 *   get:
 *     summary: Busca um estado de veículo por descrição
 *     tags: [Estados de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição do estado do veículo
 *         example: "NOVO"
 *     responses:
 *       200:
 *         description: Estado de veículo encontrado
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
 *         description: Estado de veículo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/descricao/:descricao",
  verifyToken,
  estadoVeiculoController.findEstadoVeiculoByDescricao
);

/**
 * @swagger
 * /api/estadosVeiculo/{id}:
 *   get:
 *     summary: Busca um estado de veículo por ID
 *     tags: [Estados de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do estado de veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Estado de veículo encontrado
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
 *         description: Estado de veículo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um estado de veículo
 *     tags: [Estados de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do estado de veículo
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
 *                 description: Nova descrição do estado
 *                 example: "SEMINOVO"
 *     responses:
 *       200:
 *         description: Estado de veículo atualizado com sucesso
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
 *         description: Estado de veículo não encontrado
 *       409:
 *         description: Descrição já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um estado de veículo
 *     tags: [Estados de Veículo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do estado de veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Estado de veículo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estado de veículo excluído com sucesso"
 *       404:
 *         description: Estado de veículo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, estadoVeiculoController.findEstadoVeiculoById);
router.put("/:id", verifyToken, estadoVeiculoController.updateEstadoVeiculo);
router.delete("/:id", verifyToken, estadoVeiculoController.deleteEstadoVeiculo);

module.exports = router;
