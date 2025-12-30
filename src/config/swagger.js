/**
 * Configuração do Swagger para documentação da API
 */

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SIGA Backend API",
            version: "1.2.0",
            description: "API REST para gestão integrada de concessionária de carros",
            contact: {
                name: "MAPL IT Solutions",
                email: "suporte@maplitsolutions.com.br",
                url: "https://github.com/marcosmapl/siga_backend",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:3333",
                description: "Servidor de Desenvolvimento",
            },
            {
                url: "https://api.siga.com.br",
                description: "Servidor de Produção",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Insira o token JWT recebido no login",
                },
            },
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            description: "Mensagem de erro",
                        },
                        message: {
                            type: "string",
                            description: "Descrição detalhada do erro",
                        },
                    },
                },
                Success: {
                    type: "object",
                    properties: {
                        ok: {
                            type: "boolean",
                            example: true,
                        },
                        message: {
                            type: "string",
                            example: "Operação realizada com sucesso",
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            {
                name: "Sistema",
                description: "Endpoints públicos de informações do sistema",
            },
            {
                name: "Autenticação",
                description: "Endpoints de autenticação e gerenciamento de usuários",
            },
            {
                name: "Categorias de Veículos",
                description: "Gerenciamento de categorias de veículos",
            },
            {
                name: "Clientes",
                description: "Gerenciamento de clientes",
            },
            {
                name: "Compras de Veículos",
                description: "Gerenciamento de compras de veículos de fornecedores",
            },
            {
                name: "Estados de Veículo",
                description: "Gerenciamento de estados de veículos",
            },
            {
                name: "Compras",
                description: "Gerenciamento de compras de veículos",
            },
            {
                name: "Fornecedores",
                description: "Gerenciamento de fornecedores",
            },
            {
                name: "Grupos de Usuário",
                description: "Gerenciamento de grupos de usuário",
            },
            {
                name: "Situações de Compra",
                description: "Gerenciamento de situações de compra",
            },
            {
                name: "Situações de Licenciamento",
                description: "Gerenciamento de situações de licenciamento",
            },
            {
                name: "Situações de Veículo",
                description: "Gerenciamento de situações de veículo",
            },
            {
                name: "Situações de Venda",
                description: "Gerenciamento de situações de venda",
            },
            {
                name: "Tipos de Combustível",
                description: "Gerenciamento de tipos de combustível",
            },
            {
                name: "Tipos de Compra",
                description: "Gerenciamento de tipos de compra",
            },
            {
                name: "Tipos de Direção",
                description: "Gerenciamento de tipos de direção",
            },
            {
                name: "Tipos de Transmissão",
                description: "Gerenciamento de tipos de transmissão",
            },
            {
                name: "Tipos de Venda",
                description: "Gerenciamento de tipos de venda",
            },
            {
                name: "Unidades",
                description: "Gerenciamento de tipos de unidades",
            },
            {
                name: "Veículos",
                description: "Gerenciamento de veículos",
            },
            {
                name: "Vendas de Veículos",
                description: "Gerenciamento de vendas de veículos",
            },
            {
                name: "Dashboard",
                description: "Indicadores e métricas do sistema",
            },
        ],
    },
    apis: [
        "./src/routes/*.js",
        "./src/index.js",
        "./src/app.js",
        "./src/controllers/*.js",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
