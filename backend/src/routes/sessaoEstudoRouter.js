const express = require("express");
const router = express.Router();
const controller = require("../controllers/SessaoEstudoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/sessaoEstudo:
 *   post:
 *     summary: Cria uma nova sessão de estudo
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planoEstudoId
 *               - disciplinaId
 *               - topicoId
 *             properties:
 *               planoEstudoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *                 example: 1
 *               topicoId:
 *                 type: integer
 *                 description: ID do tópico
 *                 example: 1
 *               blocoEstudoId:
 *                 type: integer
 *                 description: ID do bloco de estudo (opcional)
 *                 example: 1
 *               categoriaSessao:
 *                 type: string
 *                 enum: [TEORIA, REVISAO, RESOLUCAO_QUESTOES, LEITURA, OUTROS]
 *                 description: Categoria da sessão de estudo
 *                 example: TEORIA
 *               situacaoSessao:
 *                 type: string
 *                 enum: [AGENDADA, CANCELADA, EM_ANDAMENTO, PAUSADA, CONCLUIDA]
 *                 description: Situação da sessão de estudo
 *                 example: AGENDADA
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de início da sessão
 *               dataTermino:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de término da sessão
 *               questoesAcertos:
 *                 type: integer
 *                 description: Número de questões acertadas
 *                 example: 0
 *               questoesErros:
 *                 type: integer
 *                 description: Número de questões erradas
 *                 example: 0
 *               tempoEstudo:
 *                 type: number
 *                 format: decimal
 *                 description: Tempo de estudo em horas (Decimal 4,2)
 *                 example: 0.0
 *               paginasLidas:
 *                 type: integer
 *                 description: Número de páginas lidas
 *                 example: 0
 *               topicoFinalizado:
 *                 type: boolean
 *                 description: Se o tópico foi finalizado nesta sessão
 *                 example: false
 *               concluida:
 *                 type: boolean
 *                 description: Se a sessão foi concluída
 *                 example: false
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre a sessão
 *     responses:
 *       201:
 *         description: Sessão de estudo criada com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as sessões de estudo
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sessões de estudo ordenadas por data de início (mais recentes primeiro)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/sessaoEstudo/planoEstudo/{planoEstudoId}:
 *   get:
 *     summary: Busca todas as sessões de estudo de um plano de estudo
 *     tags: [Sessão de Estudo]
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
 *         description: Sessões de estudo encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma sessão de estudo encontrada para este plano
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/planoEstudo/:planoEstudoId", verifyToken, controller.findManyByPlanoEstudoId);

/**
 * @swagger
 * /api/sessaoEstudo/disciplina/{disciplinaId}:
 *   get:
 *     summary: Busca todas as sessões de estudo de uma disciplina
 *     tags: [Sessão de Estudo]
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
 *         description: Sessões de estudo encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma sessão de estudo encontrada para esta disciplina
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/disciplina/:disciplinaId", verifyToken, controller.findManyByDisciplinaId);

/**
 * @swagger
 * /api/sessaoEstudo/topico/{topicoId}:
 *   get:
 *     summary: Busca todas as sessões de estudo de um tópico
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tópico
 *         example: 1
 *     responses:
 *       200:
 *         description: Sessões de estudo encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma sessão de estudo encontrada para este tópico
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/topico/:topicoId", verifyToken, controller.findManyByTopicoId);

/**
 * @swagger
 * /api/sessaoEstudo/blocoEstudo/{blocoEstudoId}:
 *   get:
 *     summary: Busca todas as sessões de estudo de um bloco de estudo
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blocoEstudoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bloco de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Sessões de estudo encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma sessão de estudo encontrada para este bloco
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/blocoEstudo/:blocoEstudoId", verifyToken, controller.findManyByBlocoEstudoId);

/**
 * @swagger
 * /api/sessaoEstudo/categoria/{categoriaSessao}:
 *   get:
 *     summary: Busca todas as sessões de estudo por categoria
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoriaSessao
 *         required: true
 *         schema:
 *           type: string
 *           enum: [TEORIA, REVISAO, RESOLUCAO_QUESTOES, LEITURA, OUTROS]
 *         description: Categoria da sessão
 *         example: TEORIA
 *     responses:
 *       200:
 *         description: Sessões de estudo encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma sessão de estudo encontrada para esta categoria
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/categoria/:categoriaSessao", verifyToken, controller.findManyByCategoriaSessao);

/**
 * @swagger
 * /api/sessaoEstudo/situacao/{situacaoSessao}:
 *   get:
 *     summary: Busca todas as sessões de estudo por situação
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: situacaoSessao
 *         required: true
 *         schema:
 *           type: string
 *           enum: [AGENDADA, CANCELADA, EM_ANDAMENTO, PAUSADA, CONCLUIDA]
 *         description: Situação da sessão
 *         example: AGENDADA
 *     responses:
 *       200:
 *         description: Sessões de estudo encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma sessão de estudo encontrada para esta situação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/situacao/:situacaoSessao", verifyToken, controller.findManyBySituacaoSessao);

/**
 * @swagger
 * /api/sessaoEstudo/{id}:
 *   get:
 *     summary: Busca uma sessão de estudo por ID
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sessão de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Sessão de estudo encontrada
 *       404:
 *         description: Sessão de estudo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma sessão de estudo
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sessão de estudo
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataTermino:
 *                 type: string
 *                 format: date-time
 *               questoesAcertos:
 *                 type: integer
 *               questoesErros:
 *                 type: integer
 *               tempoEstudo:
 *                 type: number
 *                 format: decimal
 *               paginasLidas:
 *                 type: integer
 *               topicoFinalizado:
 *                 type: boolean
 *               concluida:
 *                 type: boolean
 *               observacoes:
 *                 type: string
 *               planoEstudoId:
 *                 type: integer
 *               disciplinaId:
 *                 type: integer
 *               topicoId:
 *                 type: integer
 *               blocoEstudoId:
 *                 type: integer
 *               categoriaSessao:
 *                 type: string
 *                 enum: [TEORIA, REVISAO, RESOLUCAO_QUESTOES, LEITURA, OUTROS]
 *               situacaoSessao:
 *                 type: string
 *                 enum: [AGENDADA, CANCELADA, EM_ANDAMENTO, PAUSADA, CONCLUIDA]
 *     responses:
 *       200:
 *         description: Sessão de estudo atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Sessão de estudo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma sessão de estudo
 *     tags: [Sessão de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sessão de estudo
 *         example: 1
 *     responses:
 *       200:
 *         description: Sessão de estudo excluída com sucesso
 *       404:
 *         description: Sessão de estudo não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
