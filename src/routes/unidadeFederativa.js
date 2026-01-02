const express = require("express");
const router = express.Router();
const unidadeFederativaController = require("../controllers/UnidadeFederativaController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/unidadeFederativa:
 *   post:
 *     summary: Cria uma nova unidade federativa
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - sigla
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Descrição da unidade federativa
 *                 example: "Distrito Federal"
 *               sigla:
 *                 type: string
 *                 description: Sigla da unidade federativa
 *                 example: "DF"
 *     responses:
 *       201:
 *         description: Unidade Federativa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Distrito Federal"
 *                 sigla:
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
 *         description: Unidade Federativa já cadastrada
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as Unidades Federativas
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de Unidades Federativas ordenadas por Nome
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
 *                   nome:
 *                     type: string
 *                     example: "Distrito Federal"
 *                   sigla:
 *                     type: string
 *                     example: "DF"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/",
  verifyToken,
  unidadeFederativaController.createUnidadeFederativa
);
router.get(
  "/",
  verifyToken,
  unidadeFederativaController.findAllUnidadesFederativas
);

/**
 * @swagger
 * /api/unidadeFederativa/nome/{nome}:
 *   get:
 *     summary: Busca uma unidade federativa por nome
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da Unidade Federativa
 *         example: "Distrito Federal"
 *     responses:
 *       200:
 *         description: Unidade Federativa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 sigla:
 *                   type: string
 *       404:
 *         description: Unidade Federativa não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/nome/:nome",
  verifyToken,
  unidadeFederativaController.findUnidadeFederativaByNome
);

/**
 * @swagger
 * /api/unidadeFederativa/sigla/{sigla}:
 *   get:
 *     summary: Busca uma unidade federativa por sigla
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sigla
 *         required: true
 *         schema:
 *           type: string
 *         description: Sigla da Unidade Federativa
 *         example: "DF"
 *     responses:
 *       200:
 *         description: Unidade Federativa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 sigla:
 *                   type: string
 *       404:
 *         description: Unidade Federativa não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/sigla/:sigla",
  verifyToken,
  unidadeFederativaController.findUnidadeFederativaBySigla
);


/**
 * @swagger
 * /api/unidadeFederativa/{id}:
 *   get:
 *     summary: Busca uma Unidade Federativa por ID
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da Unidade Federativa
 *         example: 1
 *     responses:
 *       200:
 *         description: Unidade Federativa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 sigla:
 *                   type: string
 *       404:
 *         description: Unidade Federativa não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma Unidade Federativa
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da Unidade Federativa
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome da Unidade Federativa
 *                 example: "São Paulo"
 *               sigla:
 *                 type: string
 *                 description: Nova sigla da Unidade Federativa
 *                 example: "SP"
 *     responses:
 *       200:
 *         description: Unidade Federativa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 sigla:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Unidade Federativa não encontrada
 *       409:
 *         description: Nome ou sigla já cadastrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma Unidade Federativa
 *     tags: [Unidade Federativa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da Unidade Federativa
 *         example: 1
 *     responses:
 *       200:
 *         description: Unidade Federativa excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unidade Federativa excluída com sucesso"
 *       404:
 *         description: Unidade Federativa não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/:id",
  verifyToken,
  unidadeFederativaController.findUnidadeFederativaById
);
router.put(
  "/:id",
  verifyToken,
  unidadeFederativaController.updateUnidadeFederativa
);
router.delete(
  "/:id",
  verifyToken,
  unidadeFederativaController.deleteUnidadeFederativa
);

module.exports = router;
