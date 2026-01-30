/**
 * Arquivo de configuração da aplicação Express
 * Configura todos os middlewares, rotas e tratamento de erros
 * Não inicia o servidor - isso é feito no index.js
 * Pode ser importado para testes sem iniciar o servidor
 */

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Middlewares de logging customizados
const {
    loggerMiddleware, // Loga todas as requisições HTTP
    errorLoggerMiddleware, // Loga erros da aplicação
    notFoundLogger, // Loga rotas não encontradas (404)
} = require("./middleware/loggerMiddleware");

// Importação de todas as rotas da API
const authRouter = require("./routes/authRouter");
const blocoEstudoRouter = require("./routes/blocoEstudoRouter");
const cidadeRouter = require("./routes/cidadeRouter");
const disciplinaRouter = require("./routes/disciplinaRouter");
const grupoUsuarioRouter = require("./routes/grupoUsuarioRouter");
const planoEstudoRouter = require("./routes/planoEstudoRouter");
const revisaoRouter = require("./routes/revisaoRouter");
const sessaoEstudoRouter = require("./routes/sessaoEstudoRouter");
const topicoRouter = require("./routes/topicoRouter");
const usuarioRouter = require("./routes/usuarioRouter");

const healthRouter = require("./routes/healthRouter");

const app = express();

/**
 * Configuração de Middlewares Globais
 * Aplicados a todas as requisições antes de chegar nas rotas
 */

// CORS - Permite requisições de diferentes origens
app.use(cors());

// Body Parser - Converte corpo das requisições JSON em objetos JavaScript
app.use(bodyParser.json());

// Logger Middleware - Registra todas as requisições HTTP com detalhes
app.use(loggerMiddleware);

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
app.use("/api/auth", authRouter);
app.use("/api/blocoEstudo", blocoEstudoRouter);
app.use("/api/cidade", cidadeRouter);
app.use("/api/disciplina", disciplinaRouter);
app.use("/api/grupoUsuario", grupoUsuarioRouter);
app.use("/health", healthRouter);
app.use("/api/planoEstudo", planoEstudoRouter);
app.use("/api/revisao", revisaoRouter);
app.use("/api/sessaoEstudo", sessaoEstudoRouter);
app.use("/api/topico", topicoRouter);
app.use("/api/usuario", usuarioRouter);

/**
 * Tratamento de Erros e Rotas Não Encontradas
 * Deve ser registrado APÓS todas as rotas válidas
 */
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Middleware para logar requisições a rotas não existentes
app.use(notFoundLogger);

// Middleware para retornar 404 para rotas não encontradas
app.use(notFound);

// Middleware para logar todos os erros da aplicação
app.use(errorLoggerMiddleware);

// Middleware global para tratamento de erros
app.use(errorHandler);

module.exports = app;
