/**
 * Setup global para testes
 * Executado antes de todos os testes
 */

const prisma = require("../src/orm/prismaClient");

// Aumenta o timeout para operações de banco de dados
jest.setTimeout(10000);

// Suprime logs durante os testes (opcional)
global.console = {
  ...console,
  // Descomentar para silenciar logs durante testes
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
};

