const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Fazer login na aplicação
 *     description: Autentica um usuário e retorna um token JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeUsuario
 *               - senha
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *                 example: admin
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nomeUsuario:
 *                       type: string
 *                       example: admin
 *                     nomeFuncionario:
 *                       type: string
 *                       example: João Silva
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", usuarioController.login);

/**
 * @swagger
 * /api/usuarios/logout:
 *   post:
 *     summary: Fazer logout da aplicação
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/logout", verifyToken, usuarioController.logout);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeUsuario
 *               - senha
 *               - nomeFuncionario
 *               - email
 *               - grupoUsuarioId
 *               - unidadeId
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *                 description: Nome de usuário único
 *                 example: "joao.silva"
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: "senha123"
 *               nomeFuncionario:
 *                 type: string
 *                 description: Nome completo do funcionário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *                 example: "joao.silva@empresa.com"
 *               grupoUsuarioId:
 *                 type: integer
 *                 description: ID do grupo de usuário
 *                 example: 1
 *               unidadeId:
 *                 type: integer
 *                 description: ID da unidade
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nomeUsuario:
 *                   type: string
 *                   example: "joao.silva"
 *                 nomeFuncionario:
 *                   type: string
 *                   example: "João Silva"
 *                 email:
 *                   type: string
 *                   example: "joao.silva@empresa.com"
 *                 grupoUsuarioId:
 *                   type: integer
 *                   example: 1
 *                 unidadeId:
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
 *         description: Não autorizado
 *       409:
 *         description: Usuário, e-mail ou nome de usuário já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários ordenados por nome de usuário
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
 *                   nomeUsuario:
 *                     type: string
 *                     example: "joao.silva"
 *                   nomeFuncionario:
 *                     type: string
 *                     example: "João Silva"
 *                   email:
 *                     type: string
 *                     example: "joao.silva@empresa.com"
 *                   grupoUsuarioId:
 *                     type: integer
 *                     example: 1
 *                   unidadeId:
 *                     type: integer
 *                     example: 1
 *                   grupoUsuario:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "Administrador"
 *                   unidade:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "Unidade Central"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, usuarioController.createUsuario);
router.get("/", verifyToken, usuarioController.findAllUsuarios);

/**
 * @swagger
 * /api/usuarios/nomeUsuario/{nomeUsuario}:
 *   get:
 *     summary: Busca usuário por nome de usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nomeUsuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome de usuário
 *         example: "joao.silva"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nomeUsuario:
 *                   type: string
 *                 nomeFuncionario:
 *                   type: string
 *                 email:
 *                   type: string
 *                 grupoUsuarioId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/nomeUsuario/:nomeUsuario",
  verifyToken,
  usuarioController.findByNomeUsuario
);

/**
 * @swagger
 * /api/usuarios/nomeFuncionario/{nome}:
 *   get:
 *     summary: Busca usuários por nome de funcionário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do funcionário (busca parcial)
 *         example: "João"
 *     responses:
 *       200:
 *         description: Lista de usuários encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nomeUsuario:
 *                     type: string
 *                   nomeFuncionario:
 *                     type: string
 *                   email:
 *                     type: string
 *                   grupoUsuarioId:
 *                     type: integer
 *                   unidadeId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Nenhum usuário encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/nomeFuncionario/:nome",
  verifyToken,
  usuarioController.findByNomeFuncionario
);

/**
 * @swagger
 * /api/usuarios/email/{email}:
 *   get:
 *     summary: Busca usuário por e-mail
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: E-mail do usuário
 *         example: "joao.silva@empresa.com"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nomeUsuario:
 *                   type: string
 *                 nomeFuncionario:
 *                   type: string
 *                 email:
 *                   type: string
 *                 grupoUsuarioId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/email/:email", verifyToken, usuarioController.findByEmail);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado com dados relacionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nomeUsuario:
 *                   type: string
 *                 nomeFuncionario:
 *                   type: string
 *                 email:
 *                   type: string
 *                 grupoUsuarioId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 grupoUsuario:
 *                   type: object
 *                   properties:
 *                     descricao:
 *                       type: string
 *                 unidade:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *                 example: "joao.silva2"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha123"
 *               nomeFuncionario:
 *                 type: string
 *                 example: "João Silva Jr."
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva2@empresa.com"
 *               grupoUsuarioId:
 *                 type: integer
 *                 example: 2
 *               unidadeId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nomeUsuario:
 *                   type: string
 *                 nomeFuncionario:
 *                   type: string
 *                 email:
 *                   type: string
 *                 grupoUsuarioId:
 *                   type: integer
 *                 unidadeId:
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
 *         description: Usuário não encontrado
 *       409:
 *         description: Nome de usuário ou e-mail já cadastrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário excluído com sucesso"
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, usuarioController.findUsuarioById);
router.put("/:id", verifyToken, usuarioController.updateUsuario);
router.delete("/:id", verifyToken, usuarioController.deleteUsuario);

module.exports = router;
