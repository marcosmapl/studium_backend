/**
 * Arquivo de configuração da aplicação Express para testes
 * Não inicia o servidor, apenas exporta a instância do app
 */

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Importação de todas as rotas da API
const authRouter = require("./routes/auth");
const unidadeFederativaRouter = require("./routes/unidadeFederativa");
const generoUsuarioRouter = require("./routes/generoUsuario");
const usuarioRouter = require("./routes/usuario");
// const grupoUsuarioRouter = require("./routes/grupoUsuario"); // Tabela não existe no schema
// const dashboardRouter = require("./routes/dashboard");
const healthRouter = require("./routes/health");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Sistema
 *     summary: Informações básicas da API
 *     description: Retorna metadados da aplicação incluindo versão, ambiente e endpoints principais
 *     security: []
 *     responses:
 *       200:
 *         description: Informações da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Studium Backend API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 environment:
 *                   type: string
 *                   example: development
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       example: /health
 *                     healthDb:
 *                       type: string
 *                       example: /health/db
 *                     api:
 *                       type: string
 *                       example: /api-docs
 *                     documentation:
 *                       type: string
 *                       example: https://github.com/marcosmapl/studium_backend
 */
app.get("/", (req, res) =>
  res.json({
    ok: true,
    message: "Studium Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/health",
      healthDb: "/health/db",
      api: "/api-docs",
      documentation: "https://github.com/marcosmapl/studium_backend",
    },
  })
);

// Swagger UI - Documentação da API
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Studium API Documentation",
  })
);

// Rota /api redireciona para documentação
app.get("/api", (req, res) => res.redirect("/api-docs"));

// Registro de rotas
app.use("/api", authRouter);
app.use("/api/unidadeFederativa", unidadeFederativaRouter);
app.use("/api/generoUsuario", generoUsuarioRouter);
app.use("/api/usuarios", usuarioRouter);
// app.use("/api/gruposUsuario", grupoUsuarioRouter); // Tabela não existe no schema
// app.use("/api/dashboard", dashboardRouter);
app.use("/health", healthRouter);

// Tratamento de erros
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
