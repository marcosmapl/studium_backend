const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/UsuarioController");
const { verifyToken } = require("../middleware/auth");

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
 *               - nome
 *               - sobrenome
 *               - username
 *               - password
 *               - email
 *               - generoUsuarioId
 *               - situacaoUsuarioId
 *               - cidadeId
 *               - grupoUsuarioId
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Primeiro nome do usuário
 *                 example: "João"
 *               sobrenome:
 *                 type: string
 *                 description: Sobrenome do usuário
 *                 example: "Silva"
 *               username:
 *                 type: string
 *                 description: Nome de usuário único
 *                 example: "joao.silva"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: "senha123"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário
 *                 example: "joao.silva@empresa.com"
 *               dataNascimento:
 *                 type: string
 *                 format: date-time
 *                 description: Data de nascimento do usuário (opcional)
 *               fotoUrl:
 *                 type: string
 *                 description: URL da foto do usuário (opcional)
 *                 example: "https://exemplo.com/foto.jpg"
 *               generoUsuarioId:
 *                 type: integer
 *                 description: ID do gênero do usuário
 *                 example: 1
 *               situacaoUsuarioId:
 *                 type: integer
 *                 description: ID da situação do usuário (status)
 *                 example: 2
 *               grupoUsuarioId:
 *                 type: integer
 *                 description: ID do grupo de usuário
 *                 example: 1
 *               cidadeId:
 *                 type: integer
 *                 description: ID da cidade
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
 *                 nome:
 *                   type: string
 *                   example: "João"
 *                 sobrenome:
 *                   type: string
 *                   example: "Silva"
 *                 username:
 *                   type: string
 *                   example: "joao.silva"
 *                 email:
 *                   type: string
 *                   example: "joao.silva@empresa.com"
 *                 dataNascimento:
 *                   type: string
 *                   format: date-time
 *                 ultimoAcesso:
 *                   type: string
 *                   format: date-time
 *                 fotoUrl:
 *                   type: string
 *                 generoUsuarioId:
 *                   type: integer
 *                   example: 1
 *                 situacaoUsuarioId:
 *                   type: integer
 *                   example: 2
 *                 grupoUsuarioId:
 *                   type: integer
 *                   example: 1
 *                 cidadeId:
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
 *         description: Username ou e-mail já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários ordenados por username
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
 *                     example: "João"
 *                   sobrenome:
 *                     type: string
 *                     example: "Silva"
 *                   username:
 *                     type: string
 *                     example: "joao.silva"
 *                   email:
 *                     type: string
 *                     example: "joao.silva@empresa.com"
 *                   ultimoAcesso:
 *                     type: string
 *                     format: date-time
 *                   generoUsuarioId:
 *                     type: integer
 *                     example: 1
 *                   situacaoUsuarioId:
 *                     type: integer
 *                     example: 2
 *                   grupoUsuarioId:
 *                     type: integer
 *                     example: 1
 *                   cidadeId:
 *                     type: integer
 *                     example: 1
 *                   generoUsuario:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "Masculino"
 *                   situacaoUsuario:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "Ativo"
 *                   grupoUsuario:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "Administrador"
 *                   cidade:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "São Paulo"
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
router.post("/", usuarioController.createUsuario); // Rota pública para cadastro
router.get("/availability", usuarioController.checkAvailability);
router.get("/", verifyToken, usuarioController.findAllUsuarios);

/**
 * @swagger
 * /api/usuarios/username/{username}:
 *   get:
 *     summary: Busca usuário por username
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username do usuário
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
 *                 nome:
 *                   type: string
 *                 sobrenome:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dataNascimento:
 *                   type: string
 *                   format: date-time
 *                 ultimoAcesso:
 *                   type: string
 *                   format: date-time
 *                 fotoUrl:
 *                   type: string
 *                 generoUsuarioId:
 *                   type: integer
 *                 situacaoUsuarioId:
 *                   type: integer
 *                 grupoUsuarioId:
 *                   type: integer
 *                 cidadeId:
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
    "/username/:username",
    verifyToken,
    usuarioController.findByUsername
);

/**
 * @swagger
 * /api/usuarios/nome/{nome}:
 *   get:
 *     summary: Busca usuários por nome
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do usuário (busca parcial)
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
 *                   nome:
 *                     type: string
 *                   sobrenome:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   dataNascimento:
 *                     type: string
 *                     format: date-time
 *                   generoUsuarioId:
 *                     type: integer
 *                   situacaoUsuarioId:
 *                     type: integer
 *                   cidadeId:
 *                     type: integer
 *                   grupoUsuarioId:
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
    "/nome/:nome",
    verifyToken,
    usuarioController.findByNome
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
 *                 nome:
 *                   type: string
 *                 sobrenome:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dataNascimento:
 *                   type: string
 *                   format: date-time
 *                 ultimoAcesso:
 *                   type: string
 *                   format: date-time
 *                 generoUsuarioId:
 *                   type: integer
 *                 situacaoUsuarioId:
 *                   type: integer
 *                 grupoUsuarioId:
 *                   type: integer
 *                 cidadeId:
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
 *                 nome:
 *                   type: string
 *                 sobrenome:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dataNascimento:
 *                   type: string
 *                   format: date-time
 *                 ultimoAcesso:
 *                   type: string
 *                   format: date-time
 *                 fotoUrl:
 *                   type: string
 *                 generoUsuarioId:
 *                   type: integer
 *                 situacaoUsuarioId:
 *                   type: integer
 *                 grupoUsuarioId:
 *                   type: integer
 *                 cidadeId:
 *                   type: integer
 *                 generoUsuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     descricao:
 *                       type: string
 *                 situacaoUsuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     descricao:
 *                       type: string
 *                 grupoUsuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     descricao:
 *                       type: string
 *                 cidade:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     descricao:
 *                       type: string
 *                     unidadeFederativa:
 *                       type: object
 *                       properties:
 *                         sigla:
 *                           type: string
 *                         descricao:
 *                           type: string
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
 *               nome:
 *                 type: string
 *                 example: "João"
 *               sobrenome:
 *                 type: string
 *                 example: "Silva Jr."
 *               username:
 *                 type: string
 *                 example: "joao.silva2"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "novaSenha123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva2@empresa.com"
 *               dataNascimento:
 *                 type: string
 *                 format: date-time
 *               fotoUrl:
 *                 type: string
 *                 example: "https://exemplo.com/nova-foto.jpg"
 *               generoUsuarioId:
 *                 type: integer
 *                 example: 1
 *               situacaoUsuarioId:
 *                 type: integer
 *                 example: 2
 *               grupoUsuarioId:
 *                 type: integer
 *                 example: 2
 *               cidadeId:
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
 *                 nome:
 *                   type: string
 *                 sobrenome:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 dataNascimento:
 *                   type: string
 *                   format: date-time
 *                 ultimoAcesso:
 *                   type: string
 *                   format: date-time
 *                 fotoUrl:
 *                   type: string
 *                 generoUsuarioId:
 *                   type: integer
 *                 situacaoUsuarioId:
 *                   type: integer
 *                 grupoUsuarioId:
 *                   type: integer
 *                 cidadeId:
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
 *         description: Username ou e-mail já cadastrado
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
