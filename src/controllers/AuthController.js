const authRepository = require("../repositories/AuthRepository");
const { generateToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class AuthController {

    /**
     * Método de login
     */
    async login(req, res, next) {
        try {
            // get user information
            const { username, password } = req.body;

            // bad request
            if (!username || !password) {
                logger.warn("Tentativa de login sem credenciais completas", {
                    route: req.originalUrl,
                    username: !!username,
                    password: !!password,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Nome de usuário e senha são obrigatórios",
                });
            }

            const usuario = await authRepository.findByUsername(username);

            if (!usuario) {
                logger.warn("Tentativa de login com usuário inexistente", {
                    route: req.originalUrl,
                    username,
                });
                return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Credenciais inválidas" });
            }

            // Comparar senha usando bcrypt
            const senhaValida = await bcrypt.compare(password, usuario.password);

            if (!senhaValida) {
                logger.warn("Tentativa de login com senha inválida", {
                    route: req.originalUrl,
                    usuarioId: usuario.id,
                    username: usuario.username,
                });

                // TODO: when user enters the wrong password, reduce the number o remaining attempts  

                return res.status(HttpStatus.UNAUTHORIZED).json({
                    error: "Credenciais inválidas",
                });
            }

            // Verificar se o usuário está ativo
            if (usuario.situacaoUsuario.situacao !== "Ativo") {
                logger.warn("Tentativa de login com usuário não ativo", {
                    route: req.originalUrl,
                    usuarioId: usuario.id,
                    username: usuario.username,
                    situacao: usuario.situacaoUsuario.situacao,
                });
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    error: "Usuário não ativo",
                });
            }

            // Login bem-sucedido - atualizar último acesso
            await authRepository.updateLastAccess(usuario.id);

            // Gerar token JWT
            const token = generateToken({
                id: usuario.id,
                username: usuario.username,
            });

            // Remove a senha da resposta
            const { password: _, ...usuarioSemSenha } = usuario;

            logger.info("Login realizado com sucesso", {
                usuarioId: usuario.id,
                username: usuario.username,
            });

            return res.json({
                ok: true,
                usuario: usuarioSemSenha,
                token,
            });

        } catch (error) {
            logger.error("Erro ao realizar login", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }

    /**
     * Método de logout
     */
    async logout(req, res, next) {
        try {
            // Em uma implementação real com blacklist de tokens ou refresh tokens,
            // você invalidaria o token aqui. Por enquanto, apenas retorna sucesso.
            logger.info("Logout realizado", {
                usuarioId: req.userId,
                username: req.username,
            });
            return res.json({ message: "Logout realizado com sucesso" });
        } catch (error) {
            logger.error("Erro ao realizar logout", {
                error: error.message,
                stack: error.stack,
            });
            next(error);
        }
    }
}

const controller = new AuthController();

module.exports = {
    login: controller.login.bind(controller),
    logout: controller.logout.bind(controller),
};
