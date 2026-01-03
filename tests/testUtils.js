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
    await prisma.disciplina.deleteMany();
    await prisma.planoEstudo.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.cidade.deleteMany();
    await prisma.unidadeFederativa.deleteMany();
    await prisma.generoUsuario.deleteMany();
    await prisma.situacaoUsuario.deleteMany();
    await prisma.situacaoPlano.deleteMany();
    await prisma.grupoUsuario.deleteMany();

    // Reabilitar verificação de chaves estrangeiras
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
};

/**
 * Cria dados de seed básicos para testes
 */
const seedBasicData = async () => {
    // Criar unidade federativa
    const unidadeFederativa = await prisma.unidadeFederativa.create({
        data: { descricao: "EstadoTeste", sigla: "ET" },
    });

    // Criar cidade
    const cidade = await prisma.cidade.create({
        data: {
            descricao: "Cidade Teste",
            unidadeFederativaId: unidadeFederativa.id,
        },
    });

    // Criar gênero de usuário
    const generoUsuario = await prisma.generoUsuario.create({
        data: { descricao: "Gênero Teste" },
    });

    // Criar situação de usuário
    const situacaoUsuario = await prisma.situacaoUsuario.create({
        data: { descricao: "Ativo" },
    });

    // Criar ou buscar grupo de usuário
    const grupoUsuario = await prisma.grupoUsuario.create({
        data: { descricao: "Grupo Teste" },
    });

    // Hash da senha
    const hashedPassword = await bcrypt.hash("teste123", 10);

    // Criar usuário admin para testes
    const usuario = await prisma.usuario.create({
        data: {
            nome: "Admin",
            sobrenome: "Teste",
            username: "teste",
            password: hashedPassword,
            email: "teste@studium.com",
            generoUsuarioId: generoUsuario.id,
            cidadeId: cidade.id,
            situacaoUsuarioId: situacaoUsuario.id,
            unidadeFederativaId: unidadeFederativa.id,
            grupoUsuarioId: grupoUsuario.id,
        },
    });

    
    // Criar situação de usuário
    const situacaoPlano = await prisma.situacaoPlano.create({
        data: { descricao: "Ativo" },
    });

    // Criar usuário admin para testes
    const planoEstudo = await prisma.planoEstudo.create({
        data: {
            titulo: "Plano Teste",
            descricao: "Plano de estudos para testes",
            questoesAcertos: 0,
            questoesErros: 0,
            tempoEstudo: 0.0,
            paginasLidas: 0,
            progresso: 0,
            concluido: false,
            usuarioId: usuario.id,
            situacaoId: situacaoPlano.id,
        },
    });

    return {
        cidade,
        generoUsuario,
        grupoUsuario,
        planoEstudo,
        situacaoUsuario,
        situacaoPlano,
        unidadeFederativa,
        usuario,
    };
};

/**
 * Gera um token JWT para testes autenticados
 */
const getAuthToken = async (app) => {
    const response = await request(app).post("/api/login").send({
        username: "teste",
        password: "teste123",
    });

    return response.body.token;
};

module.exports = {
    prisma,
    cleanDatabase,
    seedBasicData,
    getAuthToken,
};
