const logger = require("../config/logger");

/**
 * Middleware de logging para requisições HTTP
 * Registra informações sobre cada requisição e resposta
 */
const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Informações da requisição
  const requestInfo = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    userId: req.user?.id || "anonymous",
  };

  // Log da requisição recebida
  logger.info("Requisição recebida", {
    ...requestInfo,
    headers: req.headers,
    query: req.query,
    body: sanitizeBody(req.body),
  });

  // Interceptar o fim da resposta
  const originalSend = res.send;
  res.send = function (data) {
    res.send = originalSend;

    const duration = Date.now() - startTime;
    const responseInfo = {
      ...requestInfo,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Log baseado no status da resposta
    if (res.statusCode >= 500) {
      logger.error("Erro no servidor", {
        ...responseInfo,
        response: sanitizeResponse(data),
      });
    } else if (res.statusCode >= 400) {
      logger.warn("Requisição com erro do cliente", {
        ...responseInfo,
        response: sanitizeResponse(data),
      });
    } else {
      logger.info("Requisição completada", responseInfo);
    }

    return res.send(data);
  };

  next();
};

/**
 * Middleware para capturar erros não tratados
 */
const errorLoggerMiddleware = (err, req, res, next) => {
  const errorInfo = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || "anonymous",
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    body: sanitizeBody(req.body),
    query: req.query,
    params: req.params,
  };

  logger.error("Erro não tratado na aplicação", errorInfo);

  // Passar o erro para o próximo middleware de erro
  next(err);
};

/**
 * Sanitiza o body da requisição removendo campos sensíveis
 */
const sanitizeBody = (body) => {
  if (!body || typeof body !== "object") {
    return body;
  }

  const sensitiveFields = ["senha", "password", "token", "secret", "apiKey"];
  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = "***REDACTED***";
    }
  }

  return sanitized;
};

/**
 * Sanitiza a resposta para logging
 */
const sanitizeResponse = (data) => {
  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (parsed && typeof parsed === "object") {
      return sanitizeBody(parsed);
    }
    return parsed;
  } catch (e) {
    return data;
  }
};

/**
 * Middleware para log de rotas não encontradas
 */
const notFoundLogger = (req, res, next) => {
  logger.warn("Rota não encontrada", {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
  });
  next();
};

module.exports = {
  loggerMiddleware,
  errorLoggerMiddleware,
  notFoundLogger,
};
