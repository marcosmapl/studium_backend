const express = require("express");
const router = express.Router();
const controller = require("../controllers/DisciplinaController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/disciplina:
 *   post:
 *     summary: Cria uma nova disciplina
 *     tags: [Disciplina]
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
 *               - cor
 *               - planoId
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título da disciplina
 *                 example: "Direito Constitucional"
 *               descricao:
 *                 type: string
 *                 description: Descrição da disciplina
 *                 example: "Estudo dos princípios constitucionais"
 *               cor:
 *                 type: string
 *                 description: Cor da disciplina em formato hexadecimal
 *                 example: "#FF5733"
 *               planoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *                 example: 1
 *               importancia:
 *                 type: number
 *                 description: Importância da disciplina (0-10)
 *                 example: 8.5
 *               conhecimento:
 *                 type: number
 *                 description: Nível de conhecimento (0-10)
 *                 example: 6.0
 *               prioridade:
 *                 type: number
 *                 description: Prioridade de estudo calculada
 *                 example: 7.5
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre a disciplina
 *                 example: "Focar em direitos fundamentais"
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
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
 *                   example: "Direito Constitucional"
 *                 descricao:
 *                   type: string
 *                   example: "Estudo dos princípios constitucionais"
 *                 cor:
 *                   type: string
 *                   example: "#FF5733"
 *                 planoId:
 *                   type: integer
 *                   example: 1
 *                 importancia:
 *                   type: number
 *                   example: 8.5
 *                 conhecimento:
 *                   type: number
 *                   example: 6.0
 *                 prioridade:
 *                   type: number
 *                   example: 7.5
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
 *                 progresso:
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
 *     summary: Lista todas as disciplinas
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disciplinas ordenadas por título
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
 *                     example: "Direito Constitucional"
 *                   descricao:
 *                     type: string
 *                     example: "Estudo dos princípios constitucionais"
 *                   cor:
 *                     type: string
 *                     example: "#FF5733"
 *                   planoId:
 *                     type: integer
 *                     example: 1
 *                   importancia:
 *                     type: number
 *                     example: 8.5
 *                   conhecimento:
 *                     type: number
 *                     example: 6.0
 *                   prioridade:
 *                     type: number
 *                     example: 7.5
 *                   progresso:
 *                     type: integer
 *                     example: 45
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   plano:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titulo:
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
 * /api/disciplina/titulo/exact/{titulo}:
 *   get:
 *     summary: Busca disciplina por título exato
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título exato da disciplina
 *         example: "Direito Constitucional"
 *     responses:
 *       200:
 *         description: Disciplina encontrada
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
 *                 cor:
 *                   type: string
 *                 planoId:
 *                   type: integer
 *                 importancia:
 *                   type: number
 *                 conhecimento:
 *                   type: number
 *                 prioridade:
 *                   type: number
 *                 progresso:
 *                   type: integer
 *                 concluido:
 *                   type: boolean
 *       404:
 *         description: Nenhuma disciplina encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/exact/:titulo", verifyToken, controller.findUniqueByTitulo);

/**
 * @swagger
 * /api/disciplina/titulo/search/{titulo}:
 *   get:
 *     summary: Busca disciplinas por título (busca parcial)
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título da disciplina (busca parcial)
 *         example: "Direito"
 *     responses:
 *       200:
 *         description: Disciplinas encontradas
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
 *                   cor:
 *                     type: string
 *                   planoId:
 *                     type: integer
 *                   progresso:
 *                     type: integer
 *                   concluido:
 *                     type: boolean
 *       404:
 *         description: Nenhuma disciplina encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/search/:titulo", verifyToken, controller.findManyByTitulo);

/**
 * @swagger
 * /api/disciplina/plano/{planoId}:
 *   get:
 *     summary: Busca todas as disciplinas de um plano de estudo
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Disciplinas encontradas
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
 *                   cor:
 *                     type: string
 *                   planoId:
 *                     type: integer
 *                   importancia:
 *                     type: number
 *                   conhecimento:
 *                     type: number
 *                   prioridade:
 *                     type: number
 *                   progresso:
 *                     type: integer
 *                   concluido:
 *                     type: boolean
 *       404:
 *         description: Nenhuma disciplina encontrada para este plano
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/plano/:planoId", verifyToken, controller.findManyByPlanoId);

/**
 * @swagger
 * /api/disciplina/{id}:
 *   get:
 *     summary: Busca uma disciplina por ID
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *         example: 1
 *     responses:
 *       200:
 *         description: Disciplina encontrada
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
 *                 cor:
 *                   type: string
 *                 planoId:
 *                   type: integer
 *                 importancia:
 *                   type: number
 *                 conhecimento:
 *                   type: number
 *                 prioridade:
 *                   type: number
 *                 questoesAcertos:
 *                   type: integer
 *                 questoesErros:
 *                   type: integer
 *                 tempoEstudo:
 *                   type: number
 *                 paginasLidas:
 *                   type: integer
 *                 progresso:
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
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma disciplina
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
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
 *                 description: Novo título da disciplina
 *                 example: "Direito Constitucional Avançado"
 *               descricao:
 *                 type: string
 *                 description: Nova descrição
 *                 example: "Aprofundamento em controle de constitucionalidade"
 *               cor:
 *                 type: string
 *                 description: Nova cor
 *                 example: "#3498DB"
 *               importancia:
 *                 type: number
 *                 example: 9.0
 *               conhecimento:
 *                 type: number
 *                 example: 7.5
 *               prioridade:
 *                 type: number
 *                 example: 8.5
 *               questoesAcertos:
 *                 type: integer
 *                 example: 150
 *               questoesErros:
 *                 type: integer
 *                 example: 50
 *               tempoEstudo:
 *                 type: number
 *                 example: 45.5
 *               paginasLidas:
 *                 type: integer
 *                 example: 280
 *               progresso:
 *                 type: integer
 *                 example: 65
 *               concluido:
 *                 type: boolean
 *                 example: false
 *               observacoes:
 *                 type: string
 *                 example: "Revisar jurisprudência do STF"
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso
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
 *                 cor:
 *                   type: string
 *                 progresso:
 *                   type: integer
 *                 concluido:
 *                   type: boolean
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma disciplina
 *     tags: [Disciplina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *         example: 1
 *     responses:
 *       200:
 *         description: Disciplina excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Disciplina excluída com sucesso"
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
