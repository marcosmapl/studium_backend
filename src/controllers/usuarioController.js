const BaseController = require("./BaseController");
const repository = require("../repositories/UsuarioRepository");
const { generateToken } = require("../middleware/auth");
const logger = require("../config/logger");
const { Prisma } = require("@prisma/client");

class UsuarioController extends BaseController {

    constructor() {
        super(repository, "usuário", {
            entityNamePlural: "usuários",
            requiredFields: ["nomeUsuario", "nomeFuncionario", "senha", "email", "grupoUsuarioId"]
        });
    }

    /**
     * Sobrescreve o método create para adicionar validações específicas de usuário
     */
    async create(req, res, next) {
        try {
            const {
                nomeUsuario,
                nomeFuncionario,
                senha,
                email,
                tentativasRestantes,
                grupoUsuarioId,
            } = req.body;

            // Validação de campos obrigatórios
            const requiredFields = [
                "nomeUsuario",
                "nomeFuncionario",
                "senha",
                "email",
                "grupoUsuarioId",
            ];
            const missingFields = requiredFields.filter((field) => !req.body[field]);

            if (missingFields.length > 0) {
                logger.warn("Campos obrigatórios ausentes ao criar usuário", {
                    route: req.originalUrl,
                    missingFields,
                });
                return res.status(400).json({
                    error: "Campos obrigatórios ausentes",
                    missingFields,
                });
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.warn("Email inválido fornecido ao criar usuário", {
                    route: req.originalUrl,
                    email,
                });
                return res.status(400).json({
                    error: "Email inválido",
                });
            }

            // Validação de senha (mínimo 6 caracteres)
            if (senha.length < 6) {
                logger.warn("Senha com menos de 6 caracteres ao criar usuário", {
                    route: req.originalUrl,
                });
                return res.status(400).json({
                    error: "A senha deve ter no mínimo 6 caracteres",
                });
            }

            // Coerção de tipos numéricos
            const grupoUsuarioIdInt = parseInt(grupoUsuarioId);
            if (isNaN(grupoUsuarioIdInt)) {
                logger.warn("grupoUsuarioId inválido ao criar usuário", {
                    route: req.originalUrl,
                    grupoUsuarioId,
                });
                return res.status(400).json({
                    error: "grupoUsuarioId deve ser um número inteiro",
                });
            }

            const tentativasRestantesInt =
                tentativasRestantes !== undefined ? parseInt(tentativasRestantes) : 5;

            const usuario = await this.repository.create({
                nomeUsuario,
                nomeFuncionario,
                senha, // NOTA: Em produção, a senha deveria ser hash usando bcrypt
                email,
                tentativasRestantes: tentativasRestantesInt,
                grupoUsuarioId: grupoUsuarioIdInt,
            });

            // Remove a senha da resposta
            const { senha: _, ...usuarioSemSenha } = usuario;

            logger.info("Usuário criado com sucesso", {
                usuarioId: usuario.id,
                nomeUsuario: usuario.nomeUsuario,
            });
            return res.status(201).json(usuarioSemSenha);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    const field = error.meta?.target?.[0] || "campo único";
                    logger.warn("Tentativa de criar usuário com valor duplicado", {
                        route: req.originalUrl,
                        field,
                    });
                    return res.status(400).json({
                        error: `Já existe um usuário com este ${field}`,
                    });
                }
                if (error.code === "P2003") {
                    logger.warn("Grupo de usuário não encontrado ao criar usuário", {
                        route: req.originalUrl,
                        grupoUsuarioId: req.body.grupoUsuarioId,
                    });
                    return res.status(400).json({
                        error: "Grupo de usuário não encontrado",
                    });
                }
                if (error.code === "P2022") {
                    return res.status(500).json({
                        error: "Erro no banco de dados: coluna não encontrada",
                        details:
                            'Execute "npx prisma migrate dev" para sincronizar o schema',
                    });
                }
            }
            next(error);
        }
    }

    /**
     * Sobrescreve o método findAll para remover senhas da resposta
     */
    async findAll(req, res, next) {
        try {
            const usuarios = await this.repository.findAll();

            // Remove as senhas da resposta
            const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);

            return res.json(usuariosSemSenha);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2022"
            ) {
                return res.status(500).json({
                    error: "Erro no banco de dados: coluna não encontrada",
                    details: 'Execute "npx prisma migrate dev" para sincronizar o schema',
                });
            }
            next(error);
        }
    }

    /**
     * Método de login específico
     */
    async login(req, res, next) {
        try {
            const { nomeUsuario, senha } = req.body;

            if (!nomeUsuario || !senha) {
                logger.warn("Tentativa de login sem credenciais completas", {
                    route: req.originalUrl,
                    nomeUsuario: !!nomeUsuario,
                    senha: !!senha,
                });
                return res.status(400).json({
                    error: "Nome de usuário e senha são obrigatórios",
                });
            }

            const usuario = await this.repository.findByNomeUsuario(nomeUsuario);

            if (!usuario) {
                logger.warn("Tentativa de login com usuário inexistente", {
                    route: req.originalUrl,
                    nomeUsuario,
                });
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            // Verificar se a conta está bloqueada
            if (usuario.tentativasRestantes <= 0) {
                logger.warn("Tentativa de login em conta bloqueada", {
                    route: req.originalUrl,
                    usuarioId: usuario.id,
                    nomeUsuario: usuario.nomeUsuario,
                });
                return res.status(403).json({
                    error:
                        "Conta bloqueada por excesso de tentativas. Entre em contato com o administrador.",
                });
            }

            // Comparar senha (se estiver usando bcrypt, usar bcrypt.compare)
            const senhaValida = senha === usuario.senha; // TODO: usar bcrypt.compare em produção

            if (!senhaValida) {
                // Decrementar tentativas
                const novasTentativas = usuario.tentativasRestantes - 1;
                await this.repository.updateLoginAttempts(
                    usuario.id,
                    novasTentativas
                );

                logger.warn("Tentativa de login com senha inválida", {
                    route: req.originalUrl,
                    usuarioId: usuario.id,
                    nomeUsuario: usuario.nomeUsuario,
                    tentativasRestantes: novasTentativas,
                });

                if (novasTentativas <= 0) {
                    logger.warn("Conta bloqueada por excesso de tentativas", {
                        route: req.originalUrl,
                        usuarioId: usuario.id,
                        nomeUsuario: usuario.nomeUsuario,
                    });
                    return res.status(403).json({
                        error:
                            "Conta bloqueada por excesso de tentativas. Entre em contato com o administrador.",
                    });
                }

                return res.status(401).json({
                    error: "Credenciais inválidas",
                    tentativasRestantes: novasTentativas,
                });
            }

            // Login bem-sucedido - resetar tentativas e atualizar último acesso
            await this.repository.updateUltimoAcesso(usuario.id);

            // Gerar token JWT
            const token = generateToken({
                id: usuario.id,
                nomeUsuario: usuario.nomeUsuario,
                grupoUsuarioId: usuario.grupoUsuarioId,
            });

            // Remove a senha da resposta
            const { senha: _, ...usuarioSemSenha } = usuario;

            logger.info("Login realizado com sucesso", {
                usuarioId: usuario.id,
                nomeUsuario: usuario.nomeUsuario,
            });

            return res.json({
                usuario: usuarioSemSenha,
                token,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Método de logout específico
     */
    async logout(req, res, next) {
        try {
            // Em uma implementação real com blacklist de tokens ou refresh tokens,
            // você invalidaria o token aqui. Por enquanto, apenas retorna sucesso.
            return res.json({ message: "Logout realizado com sucesso" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Sobrescreve o método findById para remover senha da resposta
     */
    async findById(req, res, next) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                logger.warn("ID inválido fornecido", {
                    route: req.originalUrl,
                    providedId: req.params.id,
                });
                return res.status(400).json({ error: "ID inválido" });
            }

            const usuario = await this.repository.findById(id);

            if (!usuario) {
                logger.info("Usuário não encontrado", {
                    usuarioId: id,
                    route: req.originalUrl,
                });
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Remove a senha da resposta
            const { senha: _, ...usuarioSemSenha } = usuario;

            return res.json(usuarioSemSenha);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2022"
            ) {
                return res.status(500).json({
                    error: "Erro no banco de dados: coluna não encontrada",
                    details: 'Execute "npx prisma migrate dev" para sincronizar o schema',
                });
            }
            next(error);
        }
    }

    /**
     * Sobrescreve o método update para adicionar validações específicas
     */
    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const {
                nomeUsuario,
                nomeFuncionario,
                senha,
                email,
                tentativasRestantes,
                grupoUsuarioId,
                tempoRestanteSessao,
            } = req.body;

            if (isNaN(id)) {
                logger.warn("ID inválido fornecido para atualização", {
                    route: req.originalUrl,
                    providedId: req.params.id,
                });
                return res.status(400).json({ error: "ID inválido" });
            }

            // Validação de email se fornecido
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    logger.warn("Email inválido fornecido ao atualizar usuário", {
                        route: req.originalUrl,
                        usuarioId: id,
                        email,
                    });
                    return res.status(400).json({
                        error: "Email inválido",
                    });
                }
            }

            // Validação de senha se fornecida
            if (senha && senha.length < 6) {
                logger.warn("Senha com menos de 6 caracteres ao atualizar usuário", {
                    route: req.originalUrl,
                    usuarioId: id,
                });
                return res.status(400).json({
                    error: "A senha deve ter no mínimo 6 caracteres",
                });
            }

            const updateData = {};
            if (nomeUsuario) updateData.nomeUsuario = nomeUsuario;
            if (nomeFuncionario) updateData.nomeFuncionario = nomeFuncionario;
            if (senha) updateData.senha = senha; // NOTA: Hash em produção
            if (email) updateData.email = email;
            if (tentativasRestantes !== undefined)
                updateData.tentativasRestantes = parseInt(tentativasRestantes);
            if (grupoUsuarioId !== undefined)
                updateData.grupoUsuarioId = parseInt(grupoUsuarioId);
            if (tempoRestanteSessao !== undefined)
                updateData.tempoRestanteSessao = parseInt(tempoRestanteSessao);

            const usuario = await this.repository.update(id, updateData);

            // Remove a senha da resposta
            const { senha: _, ...usuarioSemSenha } = usuario;

            logger.info("Usuário atualizado com sucesso", {
                usuarioId: id,
                nomeUsuario: usuario.nomeUsuario,
            });
            return res.json(usuarioSemSenha);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    logger.info("Tentativa de atualizar usuário inexistente", {
                        usuarioId: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(404).json({ error: "Usuário não encontrado" });
                }
                if (error.code === "P2002") {
                    const field = error.meta?.target?.[0] || "campo único";
                    logger.warn("Tentativa de atualizar usuário com valor duplicado", {
                        usuarioId: req.params.id,
                        route: req.originalUrl,
                        field,
                    });
                    return res.status(400).json({
                        error: `Já existe um usuário com este ${field}`,
                    });
                }
                if (error.code === "P2003") {
                    logger.warn("Grupo de usuário não encontrado ao atualizar", {
                        usuarioId: req.params.id,
                        route: req.originalUrl,
                        grupoUsuarioId: req.body.grupoUsuarioId,
                    });
                    return res.status(400).json({
                        error: "Grupo de usuário não encontrado",
                    });
                }
                if (error.code === "P2022") {
                    return res.status(500).json({
                        error: "Erro no banco de dados: coluna não encontrada",
                        details:
                            'Execute "npx prisma migrate dev" para sincronizar o schema',
                    });
                }
            }
            next(error);
        }
    }

    /**
     * Sobrescreve o método delete do BaseController
     */
    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                logger.warn("ID inválido fornecido para exclusão", {
                    route: req.originalUrl,
                    providedId: req.params.id,
                });
                return res.status(400).json({ error: "ID inválido" });
            }

            await this.repository.delete(id);
            logger.info("Usuário excluído com sucesso", {
                usuarioId: id,
            });
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return res.status(404).json({ error: "Usuário não encontrado" });
                }
                if (error.code === "P2022") {
                    return res.status(500).json({
                        error: "Erro no banco de dados: coluna não encontrada",
                        details:
                            'Execute "npx prisma migrate dev" para sincronizar o schema',
                    });
                }
            }
            next(error);
        }
    }

    /**
     * Busca usuário por nome de usuário
     */
    async findByNomeUsuario(req, res, next) {
        try {
            const { nomeUsuario } = req.params;

            if (
                !nomeUsuario ||
                typeof nomeUsuario !== "string" ||
                nomeUsuario.trim().length === 0
            ) {
                logger.warn("Nome de usuário inválido fornecido", {
                    route: req.originalUrl,
                    nomeUsuario,
                });
                return res.status(400).json({ error: "Nome de usuário inválido" });
            }

            const usuario = await this.repository.findByNomeUsuario(nomeUsuario);

            if (!usuario) {
                logger.info("Usuário não encontrado por nome", {
                    nomeUsuario,
                    route: req.originalUrl,
                });
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Remove a senha da resposta
            const { senha: _, ...usuarioSemSenha } = usuario;

            return res.json(usuarioSemSenha);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca usuários por nome do funcionário
     */
    async findByNomeFuncionario(req, res, next) {
        try {
            const { nome } = req.params;

            if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
                logger.warn("Nome inválido fornecido para busca", {
                    route: req.originalUrl,
                    nome,
                });
                return res.status(400).json({ error: "Nome inválido" });
            }

            const usuarios = await this.repository.findByNomeFuncionario(nome);

            // Remove as senhas da resposta
            const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);

            return res.json(usuariosSemSenha);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca usuário por email
     */
    async findByEmail(req, res, next) {
        try {
            const { email } = req.params;

            if (!email || typeof email !== "string" || email.trim().length === 0) {
                logger.warn("Email vazio fornecido para busca", {
                    route: req.originalUrl,
                });
                return res.status(400).json({ error: "Email inválido" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.warn("Formato de email inválido fornecido para busca", {
                    route: req.originalUrl,
                    email,
                });
                return res.status(400).json({
                    error: "Formato de email inválido",
                });
            }

            const usuario = await this.repository.findByEmail(email);

            if (!usuario) {
                logger.info("Usuário não encontrado por email", {
                    email,
                    route: req.originalUrl,
                });
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Remove a senha da resposta
            const { senha: _, ...usuarioSemSenha } = usuario;

            return res.json(usuarioSemSenha);
        } catch (error) {
            next(error);
        }
    }
}

const controller = new UsuarioController();

module.exports = {
    createUsuario: controller.create.bind(controller),
    findAllUsuarios: controller.findAll.bind(controller),
    findUsuarioById: controller.findById.bind(controller),
    updateUsuario: controller.update.bind(controller),
    deleteUsuario: controller.delete.bind(controller),
    login: controller.login.bind(controller),
    logout: controller.logout.bind(controller),
    findByNomeUsuario: controller.findByNomeUsuario.bind(controller),
    findByNomeFuncionario: controller.findByNomeFuncionario.bind(controller),
    findByEmail: controller.findByEmail.bind(controller)
};
