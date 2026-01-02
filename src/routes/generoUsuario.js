const express = require("express");
const router = express.Router();
const generoUsuarioController = require("../controllers/GeneroUsuarioController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/generoUsuario:
 *   post:
 *     summary: Cria um novo gênero de usuário
 *     tags: [Gênero de Usuário]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genero
 *             properties:
 *               genero:
 *                 type: string
 *                 description: Nome do gênero
 *                 example: "Masculino"
 *     responses:
 *       201:
 *         description: Gênero de usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 genero:
 *                   type: string
 *                   example: "Masculino"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Gênero já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os gêneros de usuário
 *     tags: [Gênero de Usuário]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gêneros ordenados por nome
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
 *                   genero:
 *                     type: string
 *                     example: "Masculino"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, generoUsuarioController.createGeneroUsuario);
router.get("/", verifyToken, generoUsuarioController.findAllGenerosUsuario);

/**
 * @swagger
 * /api/generoUsuario/genero/{genero}:
 *   get:
 *     summary: Busca gêneros por nome (busca parcial)
 *     tags: [Gênero de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: genero
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do gênero (busca parcial)
 *         example: "Masculino"
 *     responses:
 *       200:
 *         description: Gêneros encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   genero:
 *                     type: string
 *       404:
 *         description: Nenhum gênero encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/genero/:genero", verifyToken, generoUsuarioController.findGeneroUsuarioByGenero);

/**
 * @swagger
 * /api/generoUsuario/{id}:
 *   get:
 *     summary: Busca um gênero de usuário por ID
 *     tags: [Gênero de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *         example: 1
 *     responses:
 *       200:
 *         description: Gênero encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 genero:
 *                   type: string
 *       404:
 *         description: Gênero não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um gênero de usuário
 *     tags: [Gênero de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genero:
 *                 type: string
 *                 description: Novo nome do gênero
 *                 example: "Feminino"
 *     responses:
 *       200:
 *         description: Gênero atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 genero:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Gênero não encontrado
 *       409:
 *         description: Nome do gênero já cadastrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um gênero de usuário
 *     tags: [Gênero de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *         example: 1
 *     responses:
 *       200:
 *         description: Gênero excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gênero de usuário excluído com sucesso"
 *       404:
 *         description: Gênero não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, generoUsuarioController.findGeneroUsuarioById);
router.put("/:id", verifyToken, generoUsuarioController.updateGeneroUsuario);
router.delete("/:id", verifyToken, generoUsuarioController.deleteGeneroUsuario);

module.exports = router;
