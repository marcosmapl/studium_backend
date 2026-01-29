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
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do plano de estudo
 *                 example: "Plano TCU - Auditor Federal"
 *               concurso:
 *                 type: string
 *                 description: Nome do concurso meta do plano de estudo
 *                 example: "Concurso do Tribunal de Contas da União - 2026"
 *               cargo:
 *                 type: string
 *                 description: Cargo principal pretendido
 *                 example: "Auditor Federal de Controle Externo"
 *               banca:
 *                 type: string
 *                 description: Banca realizadora do concurso
 *                 example: "CESPE/CEBRASPE"
 *               dataProva:
 *                 type: string
 *                 format: date-time
 *                 description: Data da prova
 *                 example: "2026-01-01"
 *               situacao:
 *                 type: string
 *                 description: Situação do plano (NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO)
 *                 enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                 default: NOVO
 *                 example: "NOVO"
 *               concluido:
 *                 type: boolean
 *                 description: Indica se o plano de estudo foi concluído
 *                 default: false
 *                 example: false
 *               usuarioId:
 *                 type: integer
 *                 description: ID do usuário proprietário do plano
 *                 example: 1
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
 *                   example: "Plano TCU - Auditor Federal"
 *                 concurso:
 *                   type: string
 *                   example: "Concurso do Tribunal de Contas da União - 2026"
 *                 cargo:
 *                   type: string
 *                   example: "Auditor Federal de Controle Externo"
 *                 banca:
 *                   type: string
 *                   example: "CESPE/CEBRASPE"
 *                 dataProva:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-01"
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 situacaoId:
 *                   type: integer
 *                   example: 1
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-01"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-01"
 *       400:
 *         description: Campos obrigatórios ausentes ao criar PlanoEstudo
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
 *                     example: "Projeto Polícial do DF 2026"
 *                   concurso:
 *                     type: string
 *                     example: "Concurso da Polícia Civil do Distrito Federal - 2026"
 *                   cargo:
 *                     type: string
 *                     example: "Delegado de Polícia"
 *                   banca:
 *                     type: string
 *                     example: "Fundação Carlos Chagas (FCC)"
 *                   dataProva:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-02"
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   situacao:
 *                     type: string
 *                     enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                     example: "NOVO"
 *                   concluido:
 *                     type: boolean
 *                     example: false
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
 *           description: Título exato do plano de estudo
 *           example: "Concurso PCDF 2026"
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
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   example: "Projeto Polícial do DF 2026"
 *                 concurso:
 *                   type: string
 *                   example: "Concurso da Polícia Civil do Distrito Federal - 2026"
 *                 cargo:
 *                   type: string
 *                   example: "Delegado de Polícia"
 *                 banca:
 *                   type: string
 *                   example: "Fundação Carlos Chagas (FCC)"
 *                 dataProva:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-02"
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 situacao:
 *                   type: string
 *                   enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                   example: "NOVO"
 *                 concluido:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-01 00:00:00"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-01 00:00:00"
 *       404:
 *         description: Nenhum plano de estudo encontrado com esse título
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
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
 *         example: "Concurso Infraero"
 *     responses:
 *       200:
 *         description: Lista de planos de estudo (array vazio se não houver planos com esse padrão)
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
 *                     example: "Projeto Polícial do DF 2026"
 *                   concurso:
 *                     type: string
 *                     example: "Concurso da Polícia Civil do Distrito Federal - 2026"
 *                   cargo:
 *                     type: string
 *                     example: "Delegado de Polícia"
 *                   banca:
 *                     type: string
 *                     example: "Fundação Carlos Chagas (FCC)"
 *                   dataProva:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-02"
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   situacao:
 *                     type: string
 *                     enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                     example: "NOVO"
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-01 00:00:00"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-01 00:00:00"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/titulo/search/:titulo", verifyToken, controller.findManyByTitulo);


/**
 * @swagger
 * /api/planoEstudo/usuario/{usuarioId}:
 *   get:
 *     summary: Busca todos os planos de estudo por ID de usuário
 *     tags: [Plano de Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O Identificador único do usuário
 *         example: 1
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
 *                     example: 1
 *                   titulo:
 *                     type: string
 *                     example: "Projeto Polícial do DF 2026"
 *                   concurso:
 *                     type: string
 *                     example: "Concurso da Polícia Civil do Distrito Federal - 2026"
 *                   cargo:
 *                     type: string
 *                     example: "Delegado de Polícia"
 *                   banca:
 *                     type: string
 *                     example: "Fundação Carlos Chagas (FCC)"
 *                   dataProva:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-02"
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   situacao:
 *                     type: string
 *                     enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                     example: "NOVO"
 *                   concluido:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-01 00:00:00"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-01 00:00:00"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/usuario/:usuarioId", verifyToken, controller.findManyByUsuarioId);


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
*                   example: 1
*                 titulo:
*                   type: string
*                   example: "Plano TCU - Auditor Federal"
*                 concurso:
*                   type: string
*                   example: "Concurso do Tribunal de Contas da União - 2026"
*                 cargo:
*                   type: string
*                   example: "Auditor Federal de Controle Externo"
*                 banca:
*                   type: string
*                   example: "CESPE/CEBRASPE"
*                 dataProva:
*                   type: string
*                   format: date-time
*                   example: "2026-01-01"
*                 usuarioId:
*                   type: integer
*                   example: 1
*                 situacao:
*                   type: string
*                   enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
*                   example: "NOVO"
*                 concluido:
*                   type: boolean
*                   example: false
*                 createdAt:
*                   type: string
*                   format: date-time
*                   example: "2026-01-01"
*                 updatedAt:
*                   type: string
*                   format: date-time
*                   example: "2026-01-01"
 *       404:
 *         description: Erro ao buscar Plano de estudo por ID
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
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
 *                 example: "Plano Auditor Federal 2026"
 *               concurso:
 *                 type: string
 *                 description: Nova descrição do concurso
 *                 example: "Receita Federal do Brasil - 2026"
 *               cargo:
 *                 type: string
 *                 description: Nova descrição do cargo
 *                 example: "Auditor-Fiscal da Receita Federal do Brasil"
 *               banca:
 *                 type: string
 *                 description: Nova descrição da banca realizadora
 *                 example: "Fundação Getúlio Vargas"
 *               dataProva:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data de prova
 *                 example: "2026-01-01"
 *               situacao:
 *                 type: string
 *                 description: Nova situação do plano
 *                 enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                 example: "EM_ANDAMENTO"
 *               concluido:
 *                 type: boolean
 *                 description: Indica se o plano foi concluído
 *                 example: false
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
 *                   example: 2
 *                 titulo:
 *                   type: string
 *                   example: "Plano Auditor Federal 2026"
 *                 concurso:
 *                   type: string
 *                   example: "Receita Federal do Brasil - 2026"
 *                 cargo:
 *                   type: string
 *                   example: "Auditor-Fiscal da Receita Federal do Brasil"
 *                 banca:
 *                   type: string
 *                   example: "Fundação Getúlio Vargas"
 *                 dataProva:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-01"
 *                 usuarioId:
 *                   type: integer
 *                   description: ID do usuário criador do plano de estudo
 *                   example: 1
 *                 situacao:
 *                   type: string
 *                   enum: [NOVO, EM_ANDAMENTO, CONCLUIDO, EXCLUIDO]
 *                   description: Situação do plano
 *                   example: "EM_ANDAMENTO"
 *                 concluido:
 *                   type: boolean
 *                   example: false
*                 createdAt:
*                   type: string
*                   format: date-time
*                   example: "2026-01-01"
*                 updatedAt:
*                   type: string
*                   format: date-time
*                   example: "2026-01-01"
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Erro ao atualizar Plano de estudo
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
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
 *         description: Erro ao encontrar Plano de estudo
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
