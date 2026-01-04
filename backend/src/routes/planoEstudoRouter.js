const express = require("express");
const router = express.Router();
const controller = require("../controllers/PlanoEstudoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/planoEstudo:
 *   post:
 *     summary: Cria um novo plano de estudo
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - usuarioId
 *               - situacaoId
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do plano de estudo
 *                 example: "Concurso PCDF 2025"
 *               descricao:
 *                 type: string
 *                 description: Descrição do plano de estudo
 *                 example: "Plano de estudos para o concurso da Polícia Civil do DF"
 *               usuarioId:
 *                 type: integer
 *                 description: ID do usuário proprietário do plano
 *                 example: 1
 *               situacaoId:
 *                 type: integer
 *                 description: ID da situação do plano
 *                 example: 1
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais sobre o plano
 *                 example: "Focar em direito constitucional"
 *     responses:
 *       201:
 *         description: Plano de estudo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   example: "Concurso PCDF 2025"
 *                 descricao:
 *                   type: string
 *                   example: "Plano de estudos para o concurso da Polícia Civil do DF"
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 situacaoId:
 *                   type: integer
 *                   example: 1
 *                 questoesAcertos:
 *                   type: integer
 *                   example: 0
 *                 questoesErros:
 *                   type: integer
 *                   example: 0
 *                 tempoEstudo:
 *                   type: number
 *                   example: 0.0
 *                 paginasLidas:
 *                   type: integer
 *                   example: 0
 *                 concluido:
 *                   type: boolean
 *                   example: false
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
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os planos de estudo
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planos de estudo ordenados por título
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
 *                   titulo:
 *                     type: string
 *                     example: "Concurso PCDF 2025"
 *                   descricao:
 *                     type: string
 *                     example: "Plano de estudos para o concurso da Polícia Civil do DF"
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   situacaoId:
 *                     type: integer
 *                     example: 1
 *                   questoesAcertos:
 *                     type: integer
 *                     example: 150
 *                   questoesErros:
 *                     type: integer
 *                     example: 50
 *                   tempoEstudo:
 *                     type: number
 *                     example: 120.5
 *                   paginasLidas:
 *                     type: integer
 *                     example: 350
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       sobrenome:
 *                         type: string
 *                   situacao:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       descricao:
 *                         type: string
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
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/planoEstudo/titulo/exact/{titulo}:
 *   get:
 *     summary: Busca plano de estudo por título exato
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título exato do plano de estudo
 *         example: "Concurso PCDF 2025"
 *     responses:
 *       200:
 *         description: Plano de estudo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 usuarioId:
 *                   type: integer
 *                 situacaoId:
 *                   type: integer
 *                 questoesAcertos:
 *                   type: integer
 *                 questoesErros:
 *                   type: integer
 *                 tempoEstudo:
 *                   type: number
 *                 paginasLidas:
 *                   type: integer
 *                 concluido:
 *                   type: boolean
 *       404:
 *         description: Nenhum plano de estudo encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/exact/:titulo", verifyToken, controller.findUniqueByTitulo);

/**
 * @swagger
 * /api/planoEstudo/titulo/search/{titulo}:
 *   get:
 *     summary: Busca planos de estudo por título (busca parcial)
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título do plano de estudo (busca parcial)
 *         example: "Concurso"
 *     responses:
 *       200:
 *         description: Planos de estudo encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   usuarioId:
 *                     type: integer
 *                   situacaoId:
 *                     type: integer
 *                   concluido:
 *                     type: boolean
 *       404:
 *         description: Nenhum plano de estudo encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/search/:titulo", verifyToken, controller.findManyByTitulo);

/**
 * @swagger
 * /api/planoEstudo/{id}:
 *   get:
 *     summary: Busca um plano de estudo por ID
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Plano de estudo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 usuarioId:
 *                   type: integer
 *                 situacaoId:
 *                   type: integer
 *                 questoesAcertos:
 *                   type: integer
 *                 questoesErros:
 *                   type: integer
 *                 tempoEstudo:
 *                   type: number
 *                 paginasLidas:
 *                   type: integer
 *                 concluido:
 *                   type: boolean
 *                 observacoes:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Plano de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um plano de estudo
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Novo título do plano
 *                 example: "Concurso PCDF 2026"
 *               descricao:
 *                 type: string
 *                 description: Nova descrição do plano
 *                 example: "Atualização do plano de estudos"
 *               situacaoId:
 *                 type: integer
 *                 description: Novo ID da situação
 *                 example: 2
 *               questoesAcertos:
 *                 type: integer
 *                 example: 200
 *               questoesErros:
 *                 type: integer
 *                 example: 75
 *               tempoEstudo:
 *                 type: number
 *                 example: 150.5
 *               paginasLidas:
 *                 type: integer
 *                 example: 500
 *               concluido:
 *                 type: boolean
 *                 example: false
 *               observacoes:
 *                 type: string
 *                 example: "Revisar matérias de direito penal"
 *     responses:
 *       200:
 *         description: Plano de estudo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 situacaoId:
 *                   type: integer
 *                 concluido:
 *                   type: boolean
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Plano de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um plano de estudo
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Plano de estudo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plano de estudo excluído com sucesso"
 *       404:
 *         description: Plano de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
