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
const vehiclesRouter = require("./routes/veiculo");
const tipoCombustivelRouter = require("./routes/tipoCombustivel");
const unidadesRouter = require("./routes/unidade");
const usuarioRouter = require("./routes/usuario");
const grupoUsuarioRouter = require("./routes/grupoUsuario");
const categoriaAtendimentoRouter = require("./routes/categoriaAtendimento");
const categoriaVeiculoRouter = require("./routes/categoriaVeiculo");
const tipoTransmissaoRouter = require("./routes/tipoTransmissao");
const tipoDirecaoRouter = require("./routes/tipoDirecao");
const situacaoLicenciamentoRouter = require("./routes/situacaoLicenciamento");
const situacaoVeiculoRouter = require("./routes/situacaoVeiculo");
const estadoVeiculoRouter = require("./routes/estadoVeiculo");
const clienteRouter = require("./routes/cliente");
const fornecedorRouter = require("./routes/fornecedor");
const compraVeiculoRouter = require("./routes/compraVeiculo");
const tipoCompraRouter = require("./routes/tipoCompra");
const situacaoCompraRouter = require("./routes/situacaoCompra");
const vendaVeiculoRouter = require("./routes/vendaVeiculo");
const tipoVendaRouter = require("./routes/tipoVenda");
const situacaoVendaRouter = require("./routes/situacaoVenda");
const dashboardRouter = require("./routes/dashboard");
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

// Registro de rotas
app.use("/api/veiculos", vehiclesRouter);
app.use("/api/tiposCombustivel", tipoCombustivelRouter);
app.use("/api/categoriasAtendimento", categoriaAtendimentoRouter);
app.use("/api/categoriasVeiculo", categoriaVeiculoRouter);
app.use("/api/tiposTransmissao", tipoTransmissaoRouter);
app.use("/api/tiposDirecao", tipoDirecaoRouter);
app.use("/api/situacoesLicenciamento", situacaoLicenciamentoRouter);
app.use("/api/situacoesVeiculo", situacaoVeiculoRouter);
app.use("/api/estadosVeiculo", estadoVeiculoRouter);
app.use("/api/unidades", unidadesRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/gruposUsuario", grupoUsuarioRouter);
app.use("/api/clientes", clienteRouter);
app.use("/api/fornecedores", fornecedorRouter);
app.use("/api/comprasVeiculos", compraVeiculoRouter);
app.use("/api/tiposCompra", tipoCompraRouter);
app.use("/api/situacoesCompra", situacaoCompraRouter);
app.use("/api/vendasVeiculos", vendaVeiculoRouter);
app.use("/api/tiposVenda", tipoVendaRouter);
app.use("/api/situacoesVenda", situacaoVendaRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/health", healthRouter);

// Tratamento de erros
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
