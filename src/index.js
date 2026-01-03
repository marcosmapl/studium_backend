/**
 * Arquivo principal da aplicação SIGA Backend
 *
 * Responsável por:
 * - Configurar o servidor Express
 * - Registrar middlewares globais
 * - Definir rotas da API
 * - Configurar tratamento de erros
 * - Gerenciar graceful shutdown
 */

// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// Dependências principais
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Sistema de logging Winston
const logger = require("./config/logger");

// Middlewares de logging customizados
const {
  loggerMiddleware, // Loga todas as requisições HTTP
  errorLoggerMiddleware, // Loga erros da aplicação
  notFoundLogger, // Loga rotas não encontradas (404)
} = require("./middleware/loggerMiddleware");

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

const healthRouter = require("./routes/healthRouter");

// Inicialização da aplicação Express
const app = express();

// Porta do servidor (configurável via variável de ambiente)
const port = process.env.PORT || 3333;

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
    version: "1.1.0",
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

/**
 * Registro de Rotas da API
 * Cada módulo da aplicação possui seu próprio conjunto de rotas
 */
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
app.use("/health", healthRouter);

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

/**
 * Inicialização do Servidor
 * Inicia o servidor Express na porta configurada
 */
app.listen(port, () => {
  logger.info(`Servidor iniciado`, {
    port,
    environment: process.env.NODE_ENV || "development",
    url: `http://localhost:${port}`,
  });
});

/**
 * Graceful Shutdown
 * Garante que o servidor feche todas as conexões adequadamente
 * antes de encerrar o processo
 */
// const prisma = require("./orm/prismaClient");

// // Escuta sinais de término do sistema operacional
// ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
//   process.on(signal, async () => {
//     logger.info("Iniciando desligamento gracioso do servidor...", { signal });

//     // Desconecta do banco de dados Prisma
//     await prisma.$disconnect();

//     logger.info("Servidor desligado com sucesso");
//     process.exit(0);
//   });
// });

/**
 * Tratamento de Exceções Não Capturadas
 * Captura erros síncronos não tratados no código
 */
process.on("uncaughtException", (error) => {
  logger.error("Exceção não capturada", {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });
  process.exit(1);
});

/**
 * Tratamento de Promises Rejeitadas
 * Captura promises rejeitadas sem .catch()
 */
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Promise rejeitada não tratada", {
    reason,
    promise,
  });
});
