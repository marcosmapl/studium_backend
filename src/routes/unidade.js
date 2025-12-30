const express = require("express");
const router = express.Router();
const controller = require("../controllers/unidadeController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/unidades:
 *   post:
 *     summary: Cria uma nova unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - endereco
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da unidade
 *                 example: "Unidade Central"
 *               endereco:
 *                 type: string
 *                 description: Endereço completo da unidade
 *                 example: "Rua Principal, 123"
 *               telefone:
 *                 type: string
 *                 description: Telefone de contato
 *                 example: "(11) 98765-4321"
 *     responses:
 *       201:
 *         description: Unidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Unidade Central"
 *                 endereco:
 *                   type: string
 *                   example: "Rua Principal, 123"
 *                 telefone:
 *                   type: string
 *                   example: "(11) 98765-4321"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Unidade já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as unidades
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades ordenadas por nome
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
 *                   nome:
 *                     type: string
 *                     example: "Unidade Central"
 *                   endereco:
 *                     type: string
 *                     example: "Rua Principal, 123"
 *                   telefone:
 *                     type: string
 *                     example: "(11) 98765-4321"
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
router.get("/", verifyToken, controller.findAllUnidades);
router.post("/", verifyToken, controller.createUnidade);

/**
 * @swagger
 * /api/unidades/{id}:
 *   get:
 *     summary: Busca uma unidade por ID
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da unidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Unidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 endereco:
 *                   type: string
 *                 telefone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Unidade não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da unidade
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da unidade
 *                 example: "Unidade Sul"
 *               endereco:
 *                 type: string
 *                 description: Endereço da unidade
 *                 example: "Av. Secundária, 456"
 *               telefone:
 *                 type: string
 *                 description: Telefone de contato
 *                 example: "(11) 91234-5678"
 *     responses:
 *       200:
 *         description: Unidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 endereco:
 *                   type: string
 *                 telefone:
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
 *         description: Unidade não encontrada
 *       409:
 *         description: Nome da unidade já cadastrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma unidade
 *     tags: [Unidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da unidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Unidade excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unidade excluída com sucesso"
 *       404:
 *         description: Unidade não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findUnidadeById);
router.put("/:id", verifyToken, controller.updateUnidade);
router.delete("/:id", verifyToken, controller.deleteUnidade);

module.exports = router;
