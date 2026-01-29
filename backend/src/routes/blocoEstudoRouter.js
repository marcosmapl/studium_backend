const express = require("express");
const router = express.Router();
const controller = require("../controllers/BlocoEstudoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/bloco:
 *   post:
 *     summary: Cria um novo bloco
 *     tags: [Bloco Estudo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - diaSemana
 *               - ordem
 *               - horasPlanejadas
 *               - disciplinaPlanejamentoId
 *             properties:
 *               diaSemana:
 *                 type: integer
 *                 description: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *               ordem:
 *                 type: integer
 *                 description: Ordem do bloco no dia da semana
 *                 example: 1
 *               horasPlanejadas:
 *                 type: number
 *                 description: Horas planejadas para estudo no dia
 *                 example: 4.0
 *               disciplinaPlanejamentoId:
 *                 type: integer
 *                 description: ID do relacionamento disciplina-planejamento
 *                 example: 1
 *     responses:
 *       201:
 *         description: Dia de estudo criado com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os dias de estudo
 *     tags: [Bloco Estudo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dias de estudo ordenados por dia da semana
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 * 
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/bloco/plano/{planoEstudoId}/disciplina/{disciplinaId}:
 *   get:
 *     summary: Busca todos os blocos de estudo de um plano e disciplina
 *     tags: [Bloco Estudo]
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
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *         example: 1
 *     responses:
 *       200:
 *         description: Blocos de estudo encontrados (array vazio se não houver blocos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/plano/:planoEstudoId/disciplina/:disciplinaId", verifyToken, controller.findManyByDisciplinaPlano);

/**
 * @swagger
 * /api/blocoEstudo/plano/{planoEstudoId}:
 *   get:
 *     summary: Busca todos os blocos de estudo de um plano
 *     tags: [Bloco Estudo]
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
 *         description: Blocos de estudo encontrados (array vazio se não houver blocos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/plano/:planoEstudoId", verifyToken, controller.findManyByPlanoId);


/**
 * @swagger
 * /api/bloco/{id}:
 *   get:
 *     summary: Busca um bloco por ID
 *     tags: [Bloco Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bloco
 *         example: 1
 *     responses:
 *       200:
 *         description: Dia de estudo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Dia de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um bloco existente
 *     tags: [Bloco Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bloco
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diaSemana:
 *                 type: integer
 *                 description: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 2
 *               ordem:
 *                 type: integer
 *                 description: Ordem do bloco no dia da semana
 *                 example: 2
 *               totalHorasPlanejadas:
 *                 type: number
 *                 description: Total de horas planejadas para estudo
 *                 example: 5.0
 *               planoEstudoId:
 *                 type: integer
 *                 description: ID do plano de estudo
 *                 example: 1
 *               disciplinaId:
 *                 type: integer
 *                 description: ID da disciplina
 *                 example: 1
 *     responses:
 *       200:
 *         description: Dia de estudo atualizado com sucesso
 *       404:
 *         description: Dia de estudo não encontrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Remove um bloco
 *     tags: [Bloco Estudo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do bloco
 *         example: 1
 *     responses:
 *       200:
 *         description: Dia de estudo removido com sucesso
 *       404:
 *         description: Dia de estudo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
