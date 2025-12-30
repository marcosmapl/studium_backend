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
const categoriaAtendimentoRouter = require("./routes/categoriaAtendimento");
const categoriaVeiculoRouter = require("./routes/categoriaVeiculo");
const clienteRouter = require("./routes/cliente");
const compraVeiculoRouter = require("./routes/compraVeiculo");
const dashboardRouter = require("./routes/dashboard");
const estadoVeiculoRouter = require("./routes/estadoVeiculo");
const fornecedorRouter = require("./routes/fornecedor");
const grupoUsuarioRouter = require("./routes/grupoUsuario");
const healthRouter = require("./routes/health");
const situacaoCompraRouter = require("./routes/situacaoCompra");
const situacaoLicenciamentoRouter = require("./routes/situacaoLicenciamento");
const situacaoVeiculoRouter = require("./routes/situacaoVeiculo");
const situacaoVendaRouter = require("./routes/situacaoVenda");
const tipoTransmissaoRouter = require("./routes/tipoTransmissao");
const tipoDirecaoRouter = require("./routes/tipoDirecao");
const tipoCombustivelRouter = require("./routes/tipoCombustivel");
const tipoCompraRouter = require("./routes/tipoCompra");
const tipoVendaRouter = require("./routes/tipoVenda");
const unidadesRouter = require("./routes/unidade");
const usuarioRouter = require("./routes/usuario");
const vehiclesRouter = require("./routes/veiculo");
const vendaVeiculoRouter = require("./routes/vendaVeiculo");

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
 *                   example: SIGA Backend API
 *                 version:
 *                   type: string
 *                   example: 1.2.0
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
 *                       example: https://github.com/marcosmapl/siga_backend
 */
app.get("/", (req, res) =>
  res.json({
    ok: true,
    message: "SIGA Backend API",
    version: "1.2.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/health",
      healthDb: "/health/db",
      api: "/api-docs",
      documentation: "https://github.com/marcosmapl/siga_backend",
    },
  })
);

// Swagger UI - Documentação da API
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "SIGA API Documentation",
  })
);

// Rota /api redireciona para documentação
app.get("/api", (req, res) => res.redirect("/api-docs"));

/**
 * Registro de Rotas da API
 * Cada módulo da aplicação possui seu próprio conjunto de rotas
 */

// ===== CONFIGURAÇÕES DE VEÍCULOS =====
app.use("/api/categoriasVeiculo", categoriaVeiculoRouter); // Categorias (SUV, Sedan, etc)
app.use("/api/estadosVeiculo", estadoVeiculoRouter); // Estado físico (Novo, Usado, Revisado)
app.use("/api/tiposCombustivel", tipoCombustivelRouter); // Tipos de combustível (Gasolina, Diesel, etc)
app.use("/api/tiposTransmissao", tipoTransmissaoRouter); // Transmissão (Manual, Automática)
app.use("/api/tiposDirecao", tipoDirecaoRouter); // Tipos de direção (Hidráulica, Elétrica)

// ===== GESTÃO DE VEÍCULOS =====
app.use("/api/veiculos", vehiclesRouter); // CRUD de veículos
app.use("/api/situacoesVeiculo", situacaoVeiculoRouter); // Situação do veículo (Disponível, Vendido)

// ===== GESTÃO DE CLIENTES =====
app.use("/api/clientes", clienteRouter); // CRUD de clientes

// ===== GESTÃO DE UNIDADES =====
app.use("/api/unidades", unidadesRouter); // Filiais/Unidades da empresa

// ===== GESTÃO DE USUÁRIOS E PERMISSÕES =====
app.use("/api/usuarios", usuarioRouter); // CRUD de usuários
app.use("/api/gruposUsuario", grupoUsuarioRouter); // Grupos de permissões

// ===== GESTÃO DE COMPRAS =====
app.use("/api/fornecedores", fornecedorRouter); // CRUD de fornecedores
app.use("/api/comprasVeiculos", compraVeiculoRouter); // Registro de compras de veículos
app.use("/api/tiposCompra", tipoCompraRouter); // Tipos de compra (Direta, Leilão, etc)
app.use("/api/situacoesCompra", situacaoCompraRouter); // Status da compra (Pendente, Concluída)

// ===== GESTÃO DE VENDAS =====
app.use("/api/vendasVeiculos", vendaVeiculoRouter); // Registro de vendas de veículos
app.use("/api/tiposVenda", tipoVendaRouter); // Tipos de venda (À Vista, Financiamento, etc)
app.use("/api/situacoesVenda", situacaoVendaRouter); // Status da venda (Em Negociação, Concluída)
app.use("/api/situacoesLicenciamento", situacaoLicenciamentoRouter); // Gestão de situações de licenciamento

// ===== GESTÃO DE ATENDIMENTOS =====
app.use("/api/categoriasAtendimento", categoriaAtendimentoRouter); // Categorias de atendimento (Dúvida, Reclamação, etc)

// ===== MONITORAMENTO E ANALYTICS =====
app.use("/api/dashboard", dashboardRouter); // KPIs e métricas do dashboard
app.use("/health", healthRouter); // Health check da aplicação

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
const prisma = require("./orm/prismaClient");

// Escuta sinais de término do sistema operacional
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, async () => {
    logger.info("Iniciando desligamento gracioso do servidor...", { signal });

    // Desconecta do banco de dados Prisma
    await prisma.$disconnect();

    logger.info("Servidor desligado com sucesso");
    process.exit(0);
  });
});

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
