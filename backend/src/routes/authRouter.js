const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/login:
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
 *       403:
 *         description: Conta bloqueada por excesso de tentativas
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/logout:
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
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
