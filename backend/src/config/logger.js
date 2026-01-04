const winston = require("winston");
const path = require("path");
require("dotenv").config();

// Formato customizado para incluir informações detalhadas
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: process.env.LOG_TIMESTAMP_FORMAT || "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, metadata, ...rest } = info;

    // Extrair informações do stack trace se disponível
    let fileInfo = "";
    if (stack) {
      const stackLines = stack.split("\n");
      if (stackLines.length > 1) {
        const callerLine = stackLines[1].trim();
        const match = callerLine.match(/\((.+):(\d+):(\d+)\)/);
        if (match) {
          const filePath = match[1];
          const line = match[2];
          const fileName = path.basename(filePath);
          fileInfo = ` [${fileName}:${line}]`;
        }
      }
    }

    // Formatar a mensagem base
    let logMessage = `${timestamp} [${level.toUpperCase()}]${fileInfo}: ${message}`;

    // Adicionar metadados e objetos adicionais se existirem
    const additionalData = { ...rest, ...metadata };
    if (Object.keys(additionalData).length > 0) {
      // Converter BigInt para Number antes de serializar
      const replacer = (key, value) => typeof value === 'bigint' ? Number(value) : value;
      logMessage += `\n${JSON.stringify(additionalData, replacer, 2)}`;
    }

    // Adicionar stack trace completo para erros
    if (stack && level === "error") {
      logMessage += `\n${stack}`;
    }

    return logMessage;
  })
);

// Formato JSON para logs estruturados
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: process.env.LOG_TIMESTAMP_FORMAT || "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    // Converter BigInt para Number antes de serializar
    const replacer = (key, value) => typeof value === 'bigint' ? Number(value) : value;
    return JSON.stringify(info, replacer);
  })
);

// Configuração dos transports por nível
const transports = [
  // Console - todos os níveis em desenvolvimento
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), customFormat),
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  }),

  // Arquivo de DEBUG
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/debug.log"),
    level: "debug",
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 5242880,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  }),

  // Arquivo de INFO
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/info.log"),
    level: "info",
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 5242880,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  }),

  // Arquivo de WARN
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/warn.log"),
    level: "warn",
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 5242880,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  }),

  // Arquivo de ERROR
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/error.log"),
    level: "error",
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 5242880,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  }),

  // Arquivo combinado (todos os logs)
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/combined.log"),
    format: jsonFormat,
    maxsize: (parseInt(process.env.LOG_MAX_SIZE) || 5242880) * 2,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  }),
];

// Criar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  transports,
  exitOnError: false,
});

// Função auxiliar para capturar informações do caller
const getCallerInfo = () => {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack;
  Error.prepareStackTrace = originalPrepareStackTrace;

  // Pular os primeiros frames (getCallerInfo e a função de log do logger)
  const callerFrame = stack[3];
  if (callerFrame) {
    const fileName = path.basename(callerFrame.getFileName() || "");
    const lineNumber = callerFrame.getLineNumber();
    return { fileName, lineNumber };
  }
  return { fileName: "unknown", lineNumber: 0 };
};

// Wrapper para adicionar informações de contexto
const logWithContext = (level, message, meta = {}) => {
  const callerInfo = getCallerInfo();
  const enhancedMeta = {
    ...meta,
    file: callerInfo.fileName,
    line: callerInfo.lineNumber,
  };

  logger.log(level, message, { metadata: enhancedMeta });
};

// Exportar logger com métodos customizados
module.exports = {
  debug: (message, meta) => logWithContext("debug", message, meta),
  info: (message, meta) => logWithContext("info", message, meta),
  warn: (message, meta) => logWithContext("warn", message, meta),
  error: (message, meta) => logWithContext("error", message, meta),
  logger, // Logger original do Winston para casos especiais
};
