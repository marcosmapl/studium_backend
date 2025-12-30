const express = require("express");
const router = express.Router();
const situacaoLicenciamentoController = require("../controllers/situacaoLicenciamentoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/situacoesLicenciamento:
 *   post:
 *     summary: Cria uma nova situação de licenciamento
 *     tags: [Situações de Licenciamento]
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
 *                 description: Descrição da situação de licenciamento
 *                 example: "LICENCIADO"
 *     responses:
 *       201:
 *         description: Situação de licenciamento criada com sucesso
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
 *                   example: "LICENCIADO"
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
 *         description: Situação de licenciamento já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as situações de licenciamento
 *     tags: [Situações de Licenciamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de situações de licenciamento ordenadas por descrição
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
 *                     example: "LICENCIADO"
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
  situacaoLicenciamentoController.createSituacaoLicenciamento
);
router.get(
  "/",
  verifyToken,
  situacaoLicenciamentoController.findAllSituacaoLicenciamento
);

/**
 * @swagger
 * /api/situacaoLicenciamento/descricao/{descricao}:
 *   get:
 *     summary: Busca uma situação de licenciamento por descrição
 *     tags: [Situações de Licenciamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação do licenciamento
 *         example: "NOVO"
 *     responses:
 *       200:
 *         description: Situação do licenciamento encontrada
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
 *         description: Situação do licenciamento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/descricao/:descricao",
  verifyToken,
  situacaoLicenciamentoController.findSituacaoLicenciamentoByDescricao
);

/**
 * @swagger
 * /api/situacoesLicenciamento/{id}:
 *   get:
 *     summary: Busca uma situação de licenciamento por ID
 *     tags: [Situações de Licenciamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de licenciamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de licenciamento encontrada
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
 *         description: Situação de licenciamento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma situação de licenciamento
 *     tags: [Situações de Licenciamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de licenciamento
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
 *                 example: "A LICENCIAR"
 *     responses:
 *       200:
 *         description: Situação de licenciamento atualizada com sucesso
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
 *         description: Situação de licenciamento não encontrada
 *       409:
 *         description: Descrição já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma situação de licenciamento
 *     tags: [Situações de Licenciamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação de licenciamento
 *         example: 1
 *     responses:
 *       200:
 *         description: Situação de licenciamento excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Situação de licenciamento excluída com sucesso"
 *       404:
 *         description: Situação de licenciamento não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/:id",
  verifyToken,
  situacaoLicenciamentoController.findSituacaoLicenciamentoById
);
router.put(
  "/:id",
  verifyToken,
  situacaoLicenciamentoController.updateSituacaoLicenciamento
);
router.delete(
  "/:id",
  verifyToken,
  situacaoLicenciamentoController.deleteSituacaoLicenciamento
);

module.exports = router;
