const logger = require("../config/logger");

// Exemplo de uso do logger em diferentes contextos

// 1. Log de DEBUG - informações detalhadas para desenvolvimento
logger.debug("Iniciando processamento de dados", {
  usuario: "john.doe@example.com",
  operacao: "consulta",
  parametros: { filtro: "ativo", limite: 50 },
});

// 2. Log de INFO - informações gerais do sistema
logger.info("Usuário autenticado com sucesso", {
  userId: 123,
  username: "john.doe",
  timestamp: new Date().toISOString(),
});

// 3. Log de WARN - avisos que não são erros mas merecem atenção
logger.warn("Tentativa de acesso a recurso restrito", {
  userId: 456,
  recurso: "/admin/settings",
  ip: "192.168.1.100",
});

// 4. Log de ERROR - erros que precisam ser investigados
try {
  // Simular um erro
  throw new Error("Falha na conexão com o banco de dados");
} catch (error) {
  logger.error("Erro ao conectar com o banco de dados", {
    errorMessage: error.message,
    errorStack: error.stack,
    tentativas: 3,
    database: "postgres",
  });
}

// 5. Log com múltiplos objetos e estruturas complexas
logger.info("Transação processada", {
  transacao: {
    id: "txn_123456",
    tipo: "compra",
    valor: 1500.0,
    moeda: "BRL",
  },
  cliente: {
    id: 789,
    nome: "Maria Silva",
    categoria: "premium",
  },
  metadados: {
    origem: "mobile-app",
    versao: "2.5.1",
    dispositivo: "iPhone 13",
  },
});

// 6. Log de performance/métricas
logger.debug("Tempo de execução da query", {
  query: "SELECT * FROM veiculos WHERE status = ?",
  duracao: "45ms",
  registrosRetornados: 150,
  cache: "miss",
});

// 7. Log de segurança
logger.warn("Múltiplas tentativas de login falhadas", {
  username: "admin",
  tentativas: 5,
  ip: "203.0.113.42",
  bloqueado: true,
  proximaLiberacao: new Date(Date.now() + 30 * 60000).toISOString(),
});

console.log("\n✅ Exemplos de logs gerados!");
console.log("📁 Verifique os arquivos na pasta logs/:");
console.log("   - logs/debug.log");
console.log("   - logs/info.log");
console.log("   - logs/warn.log");
console.log("   - logs/error.log");
console.log("   - logs/combined.log");
