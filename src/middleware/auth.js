/**
 * Middleware de Autenticação JWT
 *
 * Responsável por:
 * - Gerar tokens JWT para usuários autenticados
 * - Validar tokens em requisições protegidas
 * - Extrair informações do usuário do token
 */

const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

// Chave secreta para assinatura dos tokens (deve ser alterada em produção)
const JWT_SECRET = process.env.JWT_SECRET || "seu-secret-key-muito-seguro-aqui";

// Tempo de expiração dos tokens (padrão: 8 horas)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

const authMiddleware = {
  /**
   * Gera um token JWT para autenticação
   *
   * @param {Object} payload - Dados a serem incluídos no token
   * @param {number} payload.id - ID do usuário
   * @param {string} payload.nomeUsuario - Nome de usuário
   * @param {number} payload.grupoUsuarioId - ID do grupo de permissões
   * @returns {string} Token JWT assinado
   */
  generateToken(payload) {
    logger.debug("Iniciando geração de token de acesso", {
      usuario: payload.nomeUsuario,
    });
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  /**
   * Middleware para verificar e validar token JWT
   *
   * Extrai o token do header Authorization, valida sua assinatura
   * e adiciona as informações do usuário no objeto req
   *
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar ao próximo middleware
   * @returns {void}
   */
  verifyToken(req, res, next) {
    try {
      // Extrai o header Authorization da requisição
      const authHeader = req.headers.authorization;

      // Verifica se o token foi fornecido
      if (!authHeader) {
        logger.warn("Tentativa de acesso sem token", {
          route: req.originalUrl,
          ip: req.ip,
        });
        return res.status(401).json({ error: "Token não fornecido" });
      }

      // Divide o header em scheme e token (formato esperado: "Bearer <token>")
      const parts = authHeader.split(" ");

      // Valida se o formato está correto (deve ter exatamente 2 partes)
      if (parts.length !== 2) {
        logger.warn("Formato de token inválido", {
          route: req.originalUrl,
          ip: req.ip,
        });
        return res.status(401).json({ error: "Erro no token" });
      }

      const [scheme, token] = parts;

      // Verifica se o scheme é "Bearer" (case-insensitive)
      if (!/^Bearer$/i.test(scheme)) {
        logger.warn("Scheme de token inválido", {
          route: req.originalUrl,
          scheme,
          ip: req.ip,
        });
        return res.status(401).json({ error: "Token mal formatado" });
      }

      // Verifica e decodifica o token JWT
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          logger.warn("Token inválido ou expirado", {
            route: req.originalUrl,
            error: err.message,
            ip: req.ip,
          });
          return res.status(401).json({ error: "Token inválido ou expirado" });
        }

        req.userId = decoded.id;
        req.userNome = decoded.nomeUsuario;
        logger.info("Autenticação bem-sucedida", {
          userId: decoded.id,
          nomeUsuario: decoded.nomeUsuario,
          route: req.originalUrl,
        });
        return next();
      });
    } catch (error) {
      logger.error("Erro na verificação do token", {
        error: error.message,
        stack: error.stack,
        route: req.originalUrl,
        ip: req.ip,
      });
      return res.status(401).json({ error: "Token inválido" });
    }
  },
};

module.exports = authMiddleware;
