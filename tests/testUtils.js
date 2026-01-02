/**
 * Utilitários para testes
 */
const request = require("supertest");
const bcrypt = require("bcryptjs");
const prisma = require("../src/orm/prismaClient");

/**
 * Limpa tabelas do banco de dados de teste
 * Deve ser usado com cuidado, apenas em ambiente de teste
 */
const cleanDatabase = async () => {

    // Desabilitar verificação de chaves estrangeiras temporariamente
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

    // Limpar tabelas na ordem correta para respeitar foreign keys
    await prisma.usuario.deleteMany();
    await prisma.cidade.deleteMany();
    await prisma.unidadeFederativa.deleteMany();
    await prisma.generoUsuario.deleteMany();
    await prisma.situacaoUsuario.deleteMany();

    // Reabilitar verificação de chaves estrangeiras
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
};

/**
 * Cria dados de seed básicos para testes
 */
const seedBasicData = async () => {
    // Criar unidade federativa
    const unidadeFederativa = await prisma.unidadeFederativa.create({
        data: { nome: "Amazonas", sigla: "AM" },
    });

    // Criar cidade
    const cidade = await prisma.cidade.create({
        data: {
            cidade: "Manaus",
            unidadeFederativaId: unidadeFederativa.id,
        },
    });

    // Criar gênero de usuário
    const generoUsuario = await prisma.generoUsuario.create({
        data: { genero: "Masculino" },
    });

    // Criar situação de usuário
    const situacaoUsuario = await prisma.situacaoUsuario.create({
        data: { situacao: "Ativo" },
    });

    // Criar ou buscar grupo de usuário
    const grupoUsuario = await prisma.grupoUsuario.upsert({
        where: { grupo: "Administrador" },
        update: {},
        create: { grupo: "Administrador" },
    });

    // Hash da senha
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Criar usuário admin para testes
    const usuario = await prisma.usuario.create({
        data: {
            nome: "Admin",
            sobrenome: "Teste",
            username: "admin",
            password: hashedPassword,
            email: "admin@test.com",
            generoUsuarioId: generoUsuario.id,
            cidadeId: cidade.id,
            situacaoUsuarioId: situacaoUsuario.id,
            unidadeFederativaId: unidadeFederativa.id,
            grupoUsuarioId: grupoUsuario.id,
        },
    });

    return {
        unidadeFederativa,
        cidade,
        generoUsuario,
        situacaoUsuario,
        grupoUsuario,
        usuario,
    };
};

/**
 * Gera um token JWT para testes autenticados
 */
const getAuthToken = async (app) => {
    const response = await request(app).post("/api/login").send({
        username: "admin",
        password: "admin123",
    });

    return response.body.token;
};

module.exports = {
    prisma,
    cleanDatabase,
    seedBasicData,
    getAuthToken,
};
