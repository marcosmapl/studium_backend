/**
 * Utilitários para testes
 */
const request = require("supertest");
const bcrypt = require("bcryptjs");
const prisma = require("../src/orm/prismaClient");
const { UnidadeFederativa, GeneroUsuario, SituacaoUsuario, SituacaoPlano } = require("../src/utils/enum");

/**
 * Limpa tabelas do banco de dados de teste
 * Deve ser usado com cuidado, apenas em ambiente de teste
 */
const cleanDatabase = async () => {
    try {
        // Desabilitar verificação de chaves estrangeiras temporariamente
        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

        // Limpar tabelas na ordem correta para respeitar foreign keys
        await prisma.bloco.deleteMany();
        await prisma.revisao.deleteMany();
        await prisma.sessaoEstudo.deleteMany();
        await prisma.topico.deleteMany();
        await prisma.disciplina.deleteMany();
        await prisma.planoEstudo.deleteMany();
        await prisma.usuario.deleteMany();
        await prisma.cidade.deleteMany();
        await prisma.grupoUsuario.deleteMany();

        // Reabilitar verificação de chaves estrangeiras
        await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    } catch (error) {
        console.error('Erro ao limpar banco de dados:', error);
        // Garantir que as chaves estrangeiras sejam reabilitadas mesmo em caso de erro
        try {
            await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
        } catch (e) {
            console.error('Erro ao reabilitar chaves estrangeiras:', e);
        }
        throw error;
    }
};

/**
 * Cria dados de seed básicos para testes
 */
const seedBasicData = async () => {

    // Criar cidade
    const cidade = await prisma.cidade.create({
        data: {
            descricao: "Cidade Teste",
            unidadeFederativa: UnidadeFederativa.AC,
        },
    });

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
            generoUsuario: GeneroUsuario.OUTRO,
            situacaoUsuario: SituacaoUsuario.ATIVO,
            cidadeId: cidade.id,
            grupoUsuarioId: grupoUsuario.id,
        },
    });

    // Criar plano de estudo para testes
    const planoEstudo = await prisma.planoEstudo.create({
        data: {
            titulo: "Plano Teste",
            concurso: "Plano para Concurso Teste",
            banca: "Banca Realizadora Teste",
            cargo: "Cargo de Concurso Teste",
            dataProva: new Date("2026-01-06T00:00:00.000Z"),
            situacao: SituacaoPlano.NOVO,
            usuarioId: usuario.id,
            concluido: false,
        },
    });

    return {
        cidade,
        generoUsuario: GeneroUsuario.OUTRO,
        grupoUsuario,
        planoEstudo,
        situacaoPlano: SituacaoPlano.NOVO,
        situacaoUsuario: SituacaoUsuario.ATIVO,
        unidadeFederativa: UnidadeFederativa.AC,
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
