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
 *               - situacaoId
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
 *               situacaoId:
 *                 type: integer
 *                 description: ID da situação do tópico
 *                 example: 1
 *               concluido:
 *                 type: boolean
 *                 description: Se o tópico foi concluído
 *                 example: false
 *               estabilidade:
 *                 type: number
 *                 description: Estabilidade de memorização
 *                 example: 1.0
 *               dificuldade:
 *                 type: number
 *                 description: Dificuldade do tópico (0-10)
 *                 example: 5.0
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre o tópico
 *                 example: "Tópico introdutório fundamental"
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
 *                 situacaoId:
 *                   type: integer
 *                   example: 1
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 estabilidade:
 *                   type: number
 *                   example: 1.0
 *                 dificuldade:
 *                   type: number
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
 *                   situacaoId:
 *                     type: integer
 *                     example: 1
 *                   disciplina:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titulo:
 *                         type: string
 *                   situacao:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       descricao:
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
 *                 titulo:
 *                   type: string
 *                 ordem:
 *                   type: integer
 *                 disciplinaId:
 *                   type: integer
 *                 situacaoId:
 *                   type: integer
 *                 disciplina:
 *                   type: object
 *                 situacao:
 *                   type: object
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
 *         description: Tópicos encontrados
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
 *                   ordem:
 *                     type: integer
 *                   disciplinaId:
 *                     type: integer
 *                   situacaoId:
 *                     type: integer
 *                   disciplina:
 *                     type: object
 *                   situacao:
 *                     type: object
 *       404:
 *         description: Nenhum tópico encontrado
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
 *         description: Tópicos da disciplina encontrados
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
 *                   ordem:
 *                     type: integer
 *                   disciplinaId:
 *                     type: integer
 *                   situacaoId:
 *                     type: integer
 *                   disciplina:
 *                     type: object
 *                   situacao:
 *                     type: object
 *       404:
 *         description: Nenhum tópico encontrado para esta disciplina
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/disciplina/:disciplinaId", verifyToken, controller.findManyByDisciplinaId);

/**
 * @swagger
 * /api/topico/situacao/{situacaoId}:
 *   get:
 *     summary: Busca todos os tópicos por situação
 *     tags: [Tópico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: situacaoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da situação
 *         example: 1
 *     responses:
 *       200:
 *         description: Tópicos da situação encontrados
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
 *                   ordem:
 *                     type: integer
 *                   disciplinaId:
 *                     type: integer
 *                   situacaoId:
 *                     type: integer
 *                   disciplina:
 *                     type: object
 *                   situacao:
 *                     type: object
 *       404:
 *         description: Nenhum tópico encontrado para esta situação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/situacao/:situacaoId", verifyToken, controller.findManyBySituacaoId);

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
 *                 titulo:
 *                   type: string
 *                 ordem:
 *                   type: integer
 *                 disciplinaId:
 *                   type: integer
 *                 situacaoId:
 *                   type: integer
 *                 concluido:
 *                   type: boolean
 *                 estabilidade:
 *                   type: number
 *                 dificuldade:
 *                   type: number
 *                 disciplina:
 *                   type: object
 *                 situacao:
 *                   type: object
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
 *                 description: Novo título do tópico
 *                 example: "Teoria Geral dos Direitos Fundamentais - Atualizado"
 *               ordem:
 *                 type: integer
 *                 description: Nova ordem do tópico
 *                 example: 2
 *               situacaoId:
 *                 type: integer
 *                 description: Novo ID da situação
 *                 example: 2
 *               concluido:
 *                 type: boolean
 *                 description: Se o tópico foi concluído
 *                 example: true
 *               estabilidade:
 *                 type: number
 *                 description: Estabilidade de memorização
 *                 example: 2.5
 *               dificuldade:
 *                 type: number
 *                 description: Dificuldade do tópico (0-10)
 *                 example: 7.0
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre o tópico
 *                 example: "Tópico revisado e atualizado"
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
 *                 ordem:
 *                   type: integer
 *                 disciplinaId:
 *                   type: integer
 *                 situacaoId:
 *                   type: integer
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
