const { Prisma } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const BaseController = require("./BaseController");
const repository = require("../repositories/UsuarioRepository");
const logger = require("../config/logger");
const HttpStatus = require("../utils/httpStatus");

class UsuarioController extends BaseController {

    constructor() {
        super(repository, "usuário", {
            entityNamePlural: "usuários",
            requiredFields: ["username", "password", "email", "nome", "sobrenome", "generoUsuarioId", "cidadeId", "situacaoUsuarioId", "grupoUsuarioId"]
        });
    }

    /**
     * Sobrescreve o método create para adicionar validações específicas de usuário
     */
    async create(req, res, next) {
        try {
            const {
                username,
                nome,
                sobrenome,
                password,
                email,
                generoUsuarioId,
                situacaoUsuarioId,
                cidadeId,
                grupoUsuarioId,
                dataNascimento,
                fotoUrl
            } = req.body;

            // Validação de campos obrigatórios
            const missingFields = this.requiredFields.filter((field) => !req.body[field]);

            if (missingFields.length > 0) {
                logger.warn("Campos obrigatórios ausentes ao criar usuário", {
                    route: req.originalUrl,
                    missingFields,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
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
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Email inválido",
                });
            }

            // Validação de senha (mínimo 6 caracteres)
            if (password.length < 6) {
                logger.warn("Senha com menos de 6 caracteres ao criar usuário", {
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "A senha deve ter no mínimo 6 caracteres",
                });
            }

            // Hash da senha usando bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            const usuario = await this.repository.create({
                username,
                nome,
                sobrenome,
                password: hashedPassword,
                email,
                generoUsuarioId: parseInt(generoUsuarioId),
                cidadeId: parseInt(cidadeId),
                situacaoUsuarioId: parseInt(situacaoUsuarioId),
                grupoUsuarioId: parseInt(grupoUsuarioId),
                dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
                fotoUrl: fotoUrl || null
            });

            // Remove a senha da resposta
            const { password: _, ...usuarioSemSenha } = usuario;

            logger.info("Usuário criado com sucesso", {
                usuarioId: usuario.id,
                username: usuario.username,
            });
            return res.status(HttpStatus.CREATED).json(usuarioSemSenha);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    const field = error.meta?.target?.[0] || "campo único";
                    logger.warn("Tentativa de criar usuário com valor duplicado", {
                        route: req.originalUrl,
                        field,
                    });
                    return res.status(HttpStatus.CONFLICT).json({
                        error: `Já existe um usuário com este ${field}`,
                    });
                }
                if (error.code === "P2003") {
                    logger.warn("Relação não encontrada ao criar usuário", {
                        route: req.originalUrl,
                    });
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: "Gênero, cidade, situação ou grupo de usuário não encontrado",
                    });
                }
                if (error.code === "P2022") {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
            const usuariosSemSenha = usuarios.map(({ password, ...usuario }) => usuario);

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
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "ID inválido" });
            }

            const usuario = await this.repository.findById(id);

            if (!usuario) {
                logger.info("Usuário não encontrado", {
                    usuarioId: id,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({ error: "Usuário não encontrado" });
            }

            // Remove a senha da resposta
            const { password: _, ...usuarioSemSenha } = usuario;

            return res.json(usuarioSemSenha);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2022"
            ) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
                username,
                nome,
                sobrenome,
                password,
                email,
                generoUsuarioId,
                cidadeId,
                situacaoUsuarioId,
                unidadeFederativaId,
                grupoUsuarioId,
                dataNascimento,
                fotoUrl
            } = req.body;

            if (isNaN(id)) {
                logger.warn("ID inválido fornecido para atualização", {
                    route: req.originalUrl,
                    providedId: req.params.id,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "ID inválido" });
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
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: "Email inválido",
                    });
                }
            }

            // Validação de senha se fornecida
            if (password && password.length < 6) {
                logger.warn("Senha com menos de 6 caracteres ao atualizar usuário", {
                    route: req.originalUrl,
                    usuarioId: id,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "A senha deve ter no mínimo 6 caracteres",
                });
            }

            const updateData = {};
            if (username) updateData.username = username;
            if (nome) updateData.nome = nome;
            if (sobrenome) updateData.sobrenome = sobrenome;
            if (password) {
                // Hash da senha usando bcrypt
                updateData.password = await bcrypt.hash(password, 10);
            }
            if (email) updateData.email = email;
            if (generoUsuarioId !== undefined) updateData.generoUsuarioId = parseInt(generoUsuarioId);
            if (cidadeId !== undefined) updateData.cidadeId = parseInt(cidadeId);
            if (situacaoUsuarioId !== undefined) updateData.situacaoUsuarioId = parseInt(situacaoUsuarioId);
            if (unidadeFederativaId !== undefined) updateData.unidadeFederativaId = parseInt(unidadeFederativaId);
            if (grupoUsuarioId !== undefined) updateData.grupoUsuarioId = parseInt(grupoUsuarioId);
            if (dataNascimento) updateData.dataNascimento = new Date(dataNascimento);
            if (fotoUrl !== undefined) updateData.fotoUrl = fotoUrl;

            const usuario = await this.repository.update(id, updateData);

            // Remove a senha da resposta
            const { password: _, ...usuarioSemSenha } = usuario;

            logger.info("Usuário atualizado com sucesso", {
                usuarioId: id,
                username: usuario.username,
            });
            return res.json(usuarioSemSenha);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    logger.info("Tentativa de atualizar usuário inexistente", {
                        usuarioId: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(HttpStatus.NOT_FOUND).json({ error: "Usuário não encontrado" });
                }
                if (error.code === "P2002") {
                    const field = error.meta?.target?.[0] || "campo único";
                    logger.warn("Tentativa de atualizar usuário com valor duplicado", {
                        usuarioId: req.params.id,
                        route: req.originalUrl,
                        field,
                    });
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: `Já existe um usuário com este ${field}`,
                    });
                }
                if (error.code === "P2003") {
                    logger.warn("Relação não encontrada ao atualizar usuário", {
                        usuarioId: req.params.id,
                        route: req.originalUrl,
                    });
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        error: "Gênero, cidade, situação, unidade federativa ou grupo de usuário não encontrado",
                    });
                }
                if (error.code === "P2022") {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "ID inválido" });
            }

            await this.repository.delete(id);
            logger.info("Usuário excluído com sucesso", {
                usuarioId: id,
            });
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return res.status(HttpStatus.NOT_FOUND).json({ error: "Usuário não encontrado" });
                }
                if (error.code === "P2022") {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
    async findByUsername(req, res, next) {
        try {
            const { username } = req.params;

            if (
                !username ||
                typeof username !== "string" ||
                username.trim().length === 0
            ) {
                logger.warn("Nome de usuário inválido fornecido", {
                    route: req.originalUrl,
                    username,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Nome de usuário inválido" });
            }

            const usuario = await this.repository.findByUsername(username);

            if (!usuario) {
                logger.info("Usuário não encontrado por nome", {
                    username,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({ error: "Usuário não encontrado" });
            }

            // Remove a senha da resposta
            const { password: _, ...usuarioSemSenha } = usuario;

            return res.json(usuarioSemSenha);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca usuários por nome do funcionário
     */
    async findByNome(req, res, next) {
        try {
            const { nome } = req.params;

            if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
                logger.warn("Nome inválido fornecido para busca", {
                    route: req.originalUrl,
                    nome,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Nome inválido" });
            }

            const usuarios = await this.repository.findByNome(nome);

            // Remove as senhas da resposta
            const usuariosSemSenha = usuarios.map(({ password, ...usuario }) => usuario);

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
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Email inválido" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.warn("Formato de email inválido fornecido para busca", {
                    route: req.originalUrl,
                    email,
                });
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Formato de email inválido",
                });
            }

            const usuario = await this.repository.findByEmail(email);

            if (!usuario) {
                logger.info("Usuário não encontrado por email", {
                    email,
                    route: req.originalUrl,
                });
                return res.status(HttpStatus.NOT_FOUND).json({ error: "Usuário não encontrado" });
            }

            // Remove a senha da resposta
            const { password: _, ...usuarioSemSenha } = usuario;

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
    findByUsername: controller.findByUsername.bind(controller),
    findByNome: controller.findByNome.bind(controller),
    findByEmail: controller.findByEmail.bind(controller)
};
