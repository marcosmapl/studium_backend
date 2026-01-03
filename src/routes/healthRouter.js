const express = require("express");
const router = express.Router();
const prisma = require("../orm/prismaClient");

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Health check básico da aplicação
 *     description: Verifica se a API está respondendo
 *     security: []
 *     responses:
 *       200:
 *         description: API está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API is running
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  try {
    return res.json({ status: "ok", message: "API is running" });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

/**
 * @swagger
 * /health/db:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Health check do banco de dados
 *     description: Verifica se a conexão com o banco de dados está funcionando
 *     security: []
 *     responses:
 *       200:
 *         description: Banco de dados conectado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 db:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: Erro na conexão com o banco
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Connection timeout
 */
router.get("/db", async (req, res) => {
  try {
    // minimal check: run a simple select
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ ok: true, db: "connected" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
