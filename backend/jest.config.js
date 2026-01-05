module.exports = {
    // Ambiente de testes
    testEnvironment: "node",

    // Padrão de busca dos arquivos de teste
    testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],

    // Coletar coverage de todos os arquivos src
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/index.js", // Excluir arquivo principal
        "!**/node_modules/**",
        "!**/coverage/**",
    ],

    // Diretório de saída do coverage
    coverageDirectory: "coverage",

    // Timeout padrão para testes (30 segundos para operações de banco)
    testTimeout: 30000,

    // Limpar mocks automaticamente entre testes
    clearMocks: true,

    // Verbose output
    verbose: true,

    // Setup files antes dos testes
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

    // Global teardown
    globalTeardown: "<rootDir>/tests/globalTeardown.js",

    // Executar testes em série para evitar conflitos de banco de dados
    maxWorkers: 1,

    // Força saída após testes
    forceExit: true,
};
