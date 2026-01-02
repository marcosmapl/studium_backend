/**
 * Configuração do Swagger para documentação da API
 */

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Studium Backend API",
            version: "1.0.0",
            description: "API REST integrada para planejamento e gestão do seu estudo",
            contact: {
                name: "MAPL IT Solutions",
                email: "suporte@maplitsolutions.com.br",
                url: "https://github.com/marcosmapl/studium_backend",
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
                url: "https://api.studium.com.br",
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
                name: "Cidade",
                description: "Endpoints de cidades",
            },
            {
                name: "Gênero de Usuário",
                description: "Endpoints de gêneros de usuários",
            },
            {
                name: "Grupo de Usuário",
                description: "Endpoints de grupos de usuários",
            },
            {
                name: "Unidade Federativa",
                description: "Gerenciamento de unidades federativas",
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
