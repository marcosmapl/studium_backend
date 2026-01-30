const express = require("express");
const router = express.Router();
const controller = require("../controllers/TopicoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/topico:
 *   post:
 *     summary: Cria um novo tópico
 *     tags: [Tópico]
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
 *               - ordem
 *               - disciplinaId
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do tópico
 *                 example: "Teoria Geral dos Direitos Fundamentais"
 *               ordem:
 *                 type: integer
 *                 description: Ordem do tópico na disciplina
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *                 example: 1
 *               concluido:
 *                 type: boolean
 *                 description: Se o tópico foi concluído
 *                 example: false
 *               edital:
 *                 type: boolean
 *                 description: Se o tópico conta no edital
 *                 example: true
 *               estabilidade:
 *                 type: number
 *                 format: decimal
 *                 description: Estabilidade de memorização (Decimal 2,1 - 0.0 a 5.0)
 *                 example: 1.0
 *               dificuldade:
 *                 type: number
 *                 format: decimal
 *                 description: Dificuldade do tópico (Decimal 2,1 - 0.0 a 5.0)
 *                 example: 5.0
 *     responses:
 *       201:
 *         description: Tópico criado com sucesso
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
 *                   example: "Teoria Geral dos Direitos Fundamentais"
 *                 ordem:
 *                   type: integer
 *                   example: 1
 *                 disciplinaId:
 *                   type: integer
 *                   example: 1
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 edital:
 *                   type: boolean
 *                   example: true
 *                 estabilidade:
 *                   type: number
 *                   format: decimal
 *                   example: 1.0
 *                 dificuldade:
 *                   type: number
 *                   format: decimal
 *                   example: 5.0
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
 *     summary: Lista todos os tópicos
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tópicos ordenados por ordem
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
 *                     example: "Teoria Geral dos Direitos Fundamentais"
 *                   ordem:
 *                     type: integer
 *                     example: 1
 *                   disciplinaId:
 *                     type: integer
 *                     example: 1
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   edital:
 *                     type: boolean
 *                     example: true
 *                   estabilidade:
 *                     type: number
 *                     format: decimal
 *                     example: 1.0
 *                   dificuldade:
 *                     type: number
 *                     format: decimal
 *                     example: 5.0
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   disciplina:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titulo:
 *                         type: string
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/topico/titulo/exact/{titulo}:
 *   get:
 *     summary: Busca tópico por título exato
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título exato do tópico
 *         example: "Teoria Geral dos Direitos Fundamentais"
 *     responses:
 *       200:
 *         description: Tópico encontrado
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
 *                   example: "Teoria Geral dos Direitos Fundamentais"
 *                 ordem:
 *                   type: integer
 *                   example: 1
 *                 disciplinaId:
 *                   type: integer
 *                   example: 1
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 edital:
 *                   type: boolean
 *                   example: true
 *                 estabilidade:
 *                   type: number
 *                   format: decimal
 *                   example: 1.0
 *                 dificuldade:
 *                   type: number
 *                   format: decimal
 *                   example: 5.0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 disciplina:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Contabilidade Geral"
 *       404:
 *         description: Nenhum tópico encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/exact/:titulo", verifyToken, controller.findUniqueByTitulo);

/**
 * @swagger
 * /api/topico/titulo/search/{titulo}:
 *   get:
 *     summary: Busca tópicos por título (busca parcial)
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Parte do título do tópico
 *         example: "Direitos"
 *     responses:
 *       200:
 *         description: Lista de tópicos (array vazio se não houver tópicos com esse padrão)
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
 *                     example: "Teoria Geral dos Direitos Fundamentais"
 *                   ordem:
 *                     type: integer
 *                     example: 1
 *                   disciplinaId:
 *                     type: integer
 *                     example: 1
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   edital:
 *                     type: boolean
 *                     example: true
 *                   estabilidade:
 *                     type: number
 *                     format: decimal
 *                     example: 1.0
 *                   dificuldade:
 *                     type: number
 *                     format: decimal
 *                     example: 5.0
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   disciplina:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Contabilidade Geral"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/search/:titulo", verifyToken, controller.findManyByTitulo);

/**
 * @swagger
 * /api/topico/disciplina/{disciplinaId}:
 *   get:
 *     summary: Busca todos os tópicos de uma disciplina
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de tópicos (array vazio se não houver tópicos para esta disciplina)
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
 *                     example: "Teoria Geral dos Direitos Fundamentais"
 *                   ordem:
 *                     type: integer
 *                     example: 1
 *                   disciplinaId:
 *                     type: integer
 *                     example: 1
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   edital:
 *                     type: boolean
 *                     example: true
 *                   estabilidade:
 *                     type: number
 *                     format: decimal
 *                     example: 1.0
 *                   dificuldade:
 *                     type: number
 *                     format: decimal
 *                     example: 5.0
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   disciplina:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Contabilidade Geral"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/disciplina/:disciplinaId", verifyToken, controller.findManyByDisciplinaId);

/**
 * @swagger
 * /api/topico/planoEstudo/{planoEstudoId}:
 *   get:
 *     summary: Busca todos os tópicos de um plano de estudo
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planoEstudoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de tópicos (array vazio se não houver tópicos para este plano de estudo)
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
 *                     example: "Teoria Geral dos Direitos Fundamentais"
 *                   ordem:
 *                     type: integer
 *                     example: 1
 *                   disciplinaId:
 *                     type: integer
 *                     example: 1
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   edital:
 *                     type: boolean
 *                     example: true
 *                   estabilidade:
 *                     type: number
 *                     format: decimal
 *                     example: 1.0
 *                   dificuldade:
 *                     type: number
 *                     format: decimal
 *                     example: 5.0
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   disciplina:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Contabilidade Geral"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/planoEstudo/:planoEstudoId", verifyToken, controller.findManyByPlanoEstudoId);

/**
 * @swagger
 * /api/topico/{id}:
 *   get:
 *     summary: Busca um tópico por ID
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tópico
 *         example: 1
 *     responses:
 *       200:
 *         description: Tópico encontrado
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
 *                   example: "Teoria Geral dos Direitos Fundamentais"
 *                 ordem:
 *                   type: integer
 *                   example: 1
 *                 disciplinaId:
 *                   type: integer
 *                   example: 1
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 edital:
 *                   type: boolean
 *                   example: true
 *                 estabilidade:
 *                   type: number
 *                   format: decimal
 *                   example: 1.0
 *                 dificuldade:
 *                   type: number
 *                   format: decimal
 *                   example: 5.0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 disciplina:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Contabilidade Geral"
 *       404:
 *         description: Tópico não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um tópico
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tópico
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
 *                 example: "Teoria Geral dos Direitos Fundamentais"
 *               ordem:
 *                 type: integer
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 example: 1
 *               concluido:
 *                 type: boolean
 *                 example: false
 *               edital:
 *                 type: boolean
 *                 example: true
 *               estabilidade:
 *                 type: number
 *                 format: decimal
 *                 example: 1.0
 *               dificuldade:
 *                 type: number
 *                 format: decimal
 *                 example: 5.0
 *     responses:
 *       200:
 *         description: Tópico atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                   example: "Teoria Geral dos Direitos Fundamentais"
 *                 ordem:
 *                   type: integer
 *                   example: 1
 *                 disciplinaId:
 *                   type: integer
 *                   example: 1
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 edital:
 *                   type: boolean
 *                   example: true
 *                 estabilidade:
 *                   type: number
 *                   format: decimal
 *                   example: 1.0
 *                 dificuldade:
 *                   type: number
 *                   format: decimal
 *                   example: 5.0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 disciplina:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Contabilidade Geral"
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tópico não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um tópico
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tópico
 *         example: 1
 *     responses:
 *       200:
 *         description: Tópico excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tópico excluído com sucesso"
 *       404:
 *         description: Tópico não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
