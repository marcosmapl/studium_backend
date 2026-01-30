/**
 * Arquivo principal da aplicação Studium Backend
 *
 * Responsável por:
 * - Inicializar o servidor Express
 * - Gerenciar graceful shutdown
 * - Tratar exceções não capturadas
 */

// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importa a aplicação Express configurada
const app = require("./app");

// Sistema de logging Winston
const logger = require("./config/logger");

// Porta do servidor (configurável via variável de ambiente)
const port = process.env.PORT || 3333;

/**
 * Inicialização do Servidor
 * Inicia o servidor Express na porta configurada
 */
const server = app.listen(port, () => {
    logger.info(`Servidor iniciado`, {
        port,
        environment: process.env.NODE_ENV || "development",
        url: `http://localhost:${port}`,
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
