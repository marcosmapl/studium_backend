const express = require("express");
const router = express.Router();
const controller = require("../controllers/CidadeController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/cidade:
 *   post:
 *     summary: Cria uma nova cidade
 *     tags: [Cidade]
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
 *               - unidadeFederativa
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Nome da cidade
 *                 example: "Brasília"
 *               unidadeFederativa:
 *                 type: string
 *                 description: Sigla da Unidade Federativa
 *                 enum: [AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]
 *                 example: "DF"
 *     responses:
 *       201:
 *         description: Cidade criada com sucesso
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
 *                   example: "Brasília"
 *                 unidadeFederativa:
 *                   type: string
 *                   example: "DF"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Cidade já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as cidades
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cidades ordenadas por nome
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
 *                     example: "Brasília"
 *                   unidadeFederativa:
 *                     type: string
 *                     example: "DF"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, controller.create);
router.get("/", verifyToken, controller.findAll);

/**
 * @swagger
 * /api/cidade/descricao/{descricao}/uf/{unidadeFederativa}:
 *   get:
 *     summary: Busca cidade por descrição exata e Unidade Federativa
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição exata da cidade
 *         example: "Brasília"
 *       - in: path
 *         name: unidadeFederativa
 *         required: true
 *         schema:
 *           type: string
 *           enum: [AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]
 *         description: Sigla da Unidade Federativa
 *         example: "DF"
 *     responses:
 *       200:
 *         description: Cidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 unidadeFederativa:
 *                   type: string
 *       404:
 *         description: Nenhuma cidade encontrada com essa descrição e UF
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/:descricao/uf/:unidadeFederativa", verifyToken, controller.findByDescricaoAndUF);

/**
 * @swagger
 * /api/cidade/descricao/search/{descricao}:
 *   get:
 *     summary: Busca cidades por descrição (busca parcial)
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da cidade (busca parcial)
 *         example: "Brasí"
 *     responses:
 *       200:
 *         description: Cidades encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descricao:
 *                     type: string
 *                   unidadeFederativa:
 *                     type: string
 *       404:
 *         description: Nenhuma cidade encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/descricao/search/:descricao", verifyToken, controller.findManyByDescricao);

/**
 * @swagger
 * /api/cidade/uf/{unidadeFederativa}:
 *   get:
 *     summary: Busca todas as cidades de uma Unidade Federativa
 *     tags: [Cidade]
 *     parameters:
 *       - in: path
 *         name: unidadeFederativa
 *         required: true
 *         schema:
 *           type: string
 *           enum: [AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]
 *         description: Sigla da Unidade Federativa
 *         example: "DF"
 *     responses:
 *       200:
 *         description: Cidades encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descricao:
 *                     type: string
 *                   unidadeFederativa:
 *                     type: string
       404:
         description: Nenhuma cidade encontrada para esta UF
       500:
         description: Erro interno do servidor
 */
router.get(
    "/uf/:unidadeFederativa",
    controller.findManyByUnidadeFederativa // Rota pública para formulário de cadastro
);

/**
 * @swagger
 * /api/cidade/{id}:
 *   get:
 *     summary: Busca uma cidade por ID
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Cidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 unidadeFederativa:
 *                   type: string
 *       404:
 *         description: Cidade não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma cidade
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
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
 *                 description: Nova descrição da cidade
 *                 example: "São Paulo"
 *               unidadeFederativa:
 *                 type: string
 *                 description: Nova sigla da Unidade Federativa
 *                 enum: [AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]
 *                 example: "SP"
 *     responses:
 *       200:
 *         description: Cidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 unidadeFederativa:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cidade não encontrada
 *       409:
 *         description: Cidade já cadastrada para esta UF
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma cidade
 *     tags: [Cidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Cidade excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cidade excluída com sucesso"
 *       404:
 *         description: Cidade não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

module.exports = router;
