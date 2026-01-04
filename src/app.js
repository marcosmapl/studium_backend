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
const authRouter = require("./routes/authRouter");
const cidadeRouter = require("./routes/cidadeRouter");
const generoUsuarioRouter = require("./routes/generoUsuarioRouter");
const grupoUsuarioRouter = require("./routes/grupoUsuarioRouter");
const situacaoUsuarioRouter = require("./routes/situacaoUsuarioRouter");
const situacaoPlanoRouter = require("./routes/situacaoPlanoRouter");
const situacaoTopicoRouter = require("./routes/situacaoTopicoRouter");
const unidadeFederativaRouter = require("./routes/unidadeFederativaRouter");
const usuarioRouter = require("./routes/usuarioRouter");
const planoEstudoRouter = require("./routes/planoEstudoRouter");
const disciplinaRouter = require("./routes/disciplinaRouter");
const topicoRouter = require("./routes/topicoRouter");
const categoriaSessaoRouter = require("./routes/categoriaSessaoRouter");
const situacaoSessaoRouter = require("./routes/situacaoSessaoRouter");
const sessaoEstudoRouter = require("./routes/sessaoEstudoRouter");
const categoriaRevisaoRouter = require("./routes/categoriaRevisaoRouter");
const situacaoRevisaoRouter = require("./routes/situacaoRevisaoRouter");

const healthRouter = require("./routes/healthRouter");

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
 *                   example: 1.1.0
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
    version: "1.3.0",
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
app.use("/api/cidade", cidadeRouter);
app.use("/api/generoUsuario", generoUsuarioRouter);
app.use("/api/grupoUsuario", grupoUsuarioRouter);
app.use("/api/situacaoUsuario", situacaoUsuarioRouter);
app.use("/api/situacaoPlano", situacaoPlanoRouter);
app.use("/api/situacaoTopico", situacaoTopicoRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/unidadeFederativa", unidadeFederativaRouter);
app.use("/api/planoEstudo", planoEstudoRouter);
app.use("/api/disciplina", disciplinaRouter);
app.use("/api/topico", topicoRouter);
app.use("/api/categoriaSessao", categoriaSessaoRouter);
app.use("/api/situacaoSessao", situacaoSessaoRouter);
app.use("/api/sessaoEstudo", sessaoEstudoRouter);
app.use("/api/categoriaRevisao", categoriaRevisaoRouter);
app.use("/api/situacaoRevisao", situacaoRevisaoRouter);
app.use("/health", healthRouter);

// Tratamento de erros
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
