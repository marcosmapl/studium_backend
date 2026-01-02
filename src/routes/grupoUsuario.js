const express = require("express");
const router = express.Router();
const grupoUsuarioController = require("../controllers/GrupoUsuarioController");
const { verifyToken } = require("../middleware/auth");


/**
 * @swagger
 * /api/gruposUsuario:
 *   post:
 *     summary: Cria um novo grupo de usuário
 *     tags: [Grupo de Usuário]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grupo
 *             properties:
 *               grupo:
 *                 type: string
 *                 description: Descrição do grupo de usuário
 *                 example: "ADMINISTRADOR"
 *     responses:
 *       201:
 *         description: Grupo de usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 grupo:
 *                   type: string
 *                   example: "ADMINISTRADOR"
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Grupo de usuário já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os grupos de usuário
 *     tags: [Grupo de Usuário]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos de usuário ordenados por descrição
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
 *                   grupo:
 *                     type: string
 *                     example: "ADMINISTRADOR"
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, grupoUsuarioController.createGrupoUsuario);
router.get("/", verifyToken, grupoUsuarioController.findAllGrupoUsuario);

/**
 * @swagger
 * /api/gruposUsuario/grupo/{grupo}:
 *   get:
 *     summary: Busca grupo de usuário por nome (busca exata)
 *     tags: [Grupo de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: grupo
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do grupo (busca exata)
 *         example: "Admin"
 *     responses:
 *       200:
 *         description: Grupo de usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 grupo:
 *                   type: string
 *                   example: "ADMINISTRADOR"
 *       404:
 *         description: Nenhum grupo de usuário encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/grupo/:grupo", verifyToken, grupoUsuarioController.findGrupoUsuarioByGrupo);

/**
 * @swagger
 * /api/gruposUsuario/{id}:
 *   get:
 *     summary: Busca um grupo de usuário por ID
 *     tags: [Grupo de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do grupo de usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Grupo de usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 grupo:
 *                   type: string
 *       404:
 *         description: Grupo de usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um grupo de usuário
 *     tags: [Grupo de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do grupo de usuário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               grupo:
 *                 type: string
 *                 description: Novo nome de grupo
 *                 example: "GERENTE"
 *     responses:
 *       200:
 *         description: Grupo de usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 grupo:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Grupo de usuário não encontrado
 *       409:
 *         description: Grupo já cadastrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um grupo de usuário
 *     tags: [Grupo de Usuário]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do grupo de usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Grupo de usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Grupo de usuário excluído com sucesso"
 *       404:
 *         description: Grupo de usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, grupoUsuarioController.findGrupoUsuarioById);
router.put("/:id", verifyToken, grupoUsuarioController.updateGrupoUsuario);
router.delete("/:id", verifyToken, grupoUsuarioController.deleteGrupoUsuario);

module.exports = router;
