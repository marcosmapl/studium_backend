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
 *               - planoId
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título da disciplina
 *                 example: "Direito Constitucional"
 *               cor:
 *                 type: string
 *                 description: Cor da disciplina em formato hexadecimal
 *                 example: "#FF5733"
 *                 default: "#FFFFFF"
 *               concluido:
 *                 type: boolean
 *                 description: Indica se a disciplina foi concluída
 *                 example: false
 *                 default: false
 *               importancia:
 *                 type: number
 *                 format: decimal
 *                 description: Peso/importância da disciplina (0.0 a 5.0)
 *                 example: 3.0
 *                 default: 1.0
 *               conhecimento:
 *                 type: number
 *                 format: decimal
 *                 description: Nível de conhecimento atual (0.0 a 5.0)
 *                 example: 1.0
 *                 default: 0.0
 *               horasSemanais:
 *                 type: number
 *                 format: decimal
 *                 description: Horas semanais alocadas para estudo
 *                 example: 4.5
 *                 default: 0.0
 *               planoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *                 example: 1
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
 *                 cor:
 *                   type: string
 *                   example: "#FF5733"
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 importancia:
 *                   type: number
 *                   example: 3.0
 *                 conhecimento:
 *                   type: number
 *                   example: 1.0
 *                 horasSemanais:
 *                   type: number
 *                   example: 4.5
 *                 planoId:
 *                   type: integer
 *                   example: 1
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
 *                   cor:
 *                     type: string
 *                     example: "#FF5733"
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   importancia:
 *                     type: number
 *                     example: 3.0
 *                   conhecimento:
 *                     type: number
 *                     example: 1.0
 *                   horasSemanais:
 *                     type: number
 *                     example: 4.5
 *                   planoId:
 *                     type: integer
 *                     example: 1
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
 *                 cor:
 *                   type: string
 *                 concluido:
 *                   type: boolean
 *                 importancia:
 *                   type: number
 *                 conhecimento:
 *                   type: number
 *                 horasSemanais:
 *                   type: number
 *                 planoId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Nenhuma disciplina encontrada com esse título
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
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
 *         description: Lista de disciplinas (array vazio se não houver disciplinas com esse padrão)
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
 *                   cor:
 *                     type: string
 *                   concluido:
 *                     type: boolean
 *                   importancia:
 *                     type: number
 *                   conhecimento:
 *                     type: number
 *                   horasSemanais:
 *                     type: number
 *                   planoId:
 *                     type: integer
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
 *         description: Lista de disciplinas (array vazio se o plano não tiver disciplinas)
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
 *                   cor:
 *                     type: string
 *                   concluido:
 *                     type: boolean
 *                   importancia:
 *                     type: number
 *                   conhecimento:
 *                     type: number
 *                   horasSemanais:
 *                     type: number
 *                   planoId:
 *                     type: integer
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
 *                 cor:
 *                   type: string
 *                 concluido:
 *                   type: boolean
 *                 importancia:
 *                   type: number
 *                 conhecimento:
 *                   type: number
 *                 horasSemanais:
 *                   type: number
 *                 planoId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
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
 *               cor:
 *                 type: string
 *                 description: Nova cor
 *                 example: "#3498DB"
 *               concluido:
 *                 type: boolean
 *                 description: Status de conclusão
 *                 example: false
 *               importancia:
 *                 type: number
 *                 format: decimal
 *                 description: Novo peso/importância da disciplina (0.0 a 5.0)
 *                 example: 2.5
 *               conhecimento:
 *                 type: number
 *                 format: decimal
 *                 description: Novo nível de conhecimento (0.0 a 5.0)
 *                 example: 2.0
 *               horasSemanais:
 *                 type: number
 *                 format: decimal
 *                 description: Novas horas semanais
 *                 example: 5.0
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
 *                 cor:
 *                   type: string
 *                 concluido:
 *                   type: boolean
 *                 importancia:
 *                   type: number
 *                 conhecimento:
 *                   type: number
 *                 horasSemanais:
 *                   type: number
 *                 planoId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
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
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
