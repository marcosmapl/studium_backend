const { PrismaClient } = require("../src/orm/prismaClient");const bcrypt = require("bcryptjs");const logger = require("../src/config/logger");
const prisma = require("../src/orm/prismaClient");

async function main() {

    logger.info("Seeding database...");

    // Seed UnidadeFederativa
    const ufs = await prisma.unidadeFederativa.createMany({
        data: [
            {
                descricao: "Acre",
                sigla: "AC",
            },
            {
                descricao: "Alagoas",
                sigla: "AL",
            },
            {
                descricao: "Amazonas",
                sigla: "AM",
            },
            {
                descricao: "Bahia",
                sigla: "BA",
            },
            {
                descricao: "Ceará",
                sigla: "CE",
            },
            {
                descricao: "Distrito Federal",
                sigla: "DF",
            },
            {
                descricao: "Espirito Santo",
                sigla: "ES",
            },
            {
                descricao: "Goiás",
                sigla: "GO",
            },
            {
                descricao: "Maranhão",
                sigla: "MA",
            },
            {
                descricao: "Mato Grosso",
                sigla: "MT",
            },
            {
                descricao: "Mato Grosso do Sul",
                sigla: "MS",
            },
            {
                descricao: "Minas Gerais",
                sigla: "MG",
            },
            {
                descricao: "Pará",
                sigla: "PA",
            },
            {
                descricao: "Pernambuco",
                sigla: "PE",
            },
            {
                descricao: "Piauí",
                sigla: "PI",
            },
            {
                descricao: "Rio de Janeiro",
                sigla: "RJ",
            },
            {
                descricao: "Rio Grande do Norte",
                sigla: "RN",
            },
            {
                descricao: "Rio Grande do Sul",
                sigla: "RS",
            },
            {
                descricao: "Rondônia",
                sigla: "RO",
            },
            {
                descricao: "Roraima",
                sigla: "RR",
            },
            {
                descricao: "Santa Catarina",
                sigla: "SC",
            },
            {
                descricao: "São Paulo",
                sigla: "SP",
            },
            {
                descricao: "Sergipe",
                sigla: "SE",
            },
            {
                descricao: "Tocantins",
                sigla: "TO",
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${ufs.count} UnidadeFederativa`);

    // Buscar todas as UFs para criar as capitais
    const ufAC = await prisma.unidadeFederativa.findUnique({ where: { sigla: "AC" } });
    const ufAL = await prisma.unidadeFederativa.findUnique({ where: { sigla: "AL" } });
    const ufAM = await prisma.unidadeFederativa.findUnique({ where: { sigla: "AM" } });
    const ufBA = await prisma.unidadeFederativa.findUnique({ where: { sigla: "BA" } });
    const ufCE = await prisma.unidadeFederativa.findUnique({ where: { sigla: "CE" } });
    const ufDF = await prisma.unidadeFederativa.findUnique({ where: { sigla: "DF" } });
    const ufES = await prisma.unidadeFederativa.findUnique({ where: { sigla: "ES" } });
    const ufGO = await prisma.unidadeFederativa.findUnique({ where: { sigla: "GO" } });
    const ufMA = await prisma.unidadeFederativa.findUnique({ where: { sigla: "MA" } });
    const ufMT = await prisma.unidadeFederativa.findUnique({ where: { sigla: "MT" } });
    const ufMS = await prisma.unidadeFederativa.findUnique({ where: { sigla: "MS" } });
    const ufMG = await prisma.unidadeFederativa.findUnique({ where: { sigla: "MG" } });
    const ufPA = await prisma.unidadeFederativa.findUnique({ where: { sigla: "PA" } });
    const ufPE = await prisma.unidadeFederativa.findUnique({ where: { sigla: "PE" } });
    const ufPI = await prisma.unidadeFederativa.findUnique({ where: { sigla: "PI" } });
    const ufRJ = await prisma.unidadeFederativa.findUnique({ where: { sigla: "RJ" } });
    const ufRN = await prisma.unidadeFederativa.findUnique({ where: { sigla: "RN" } });
    const ufRS = await prisma.unidadeFederativa.findUnique({ where: { sigla: "RS" } });
    const ufRO = await prisma.unidadeFederativa.findUnique({ where: { sigla: "RO" } });
    const ufRR = await prisma.unidadeFederativa.findUnique({ where: { sigla: "RR" } });
    const ufSC = await prisma.unidadeFederativa.findUnique({ where: { sigla: "SC" } });
    const ufSP = await prisma.unidadeFederativa.findUnique({ where: { sigla: "SP" } });
    const ufSE = await prisma.unidadeFederativa.findUnique({ where: { sigla: "SE" } });
    const ufTO = await prisma.unidadeFederativa.findUnique({ where: { sigla: "TO" } });

    // Seed Capitais
    const cidades = await prisma.cidade.createMany({
        data: [
            { descricao: "Rio Branco", unidadeFederativaId: ufAC.id },
            { descricao: "Maceió", unidadeFederativaId: ufAL.id },
            { descricao: "Manaus", unidadeFederativaId: ufAM.id },
            { descricao: "Salvador", unidadeFederativaId: ufBA.id },
            { descricao: "Fortaleza", unidadeFederativaId: ufCE.id },
            { descricao: "Brasília", unidadeFederativaId: ufDF.id },
            { descricao: "Vitória", unidadeFederativaId: ufES.id },
            { descricao: "Goiânia", unidadeFederativaId: ufGO.id },
            { descricao: "São Luís", unidadeFederativaId: ufMA.id },
            { descricao: "Cuiabá", unidadeFederativaId: ufMT.id },
            { descricao: "Campo Grande", unidadeFederativaId: ufMS.id },
            { descricao: "Belo Horizonte", unidadeFederativaId: ufMG.id },
            { descricao: "Belém", unidadeFederativaId: ufPA.id },
            { descricao: "Recife", unidadeFederativaId: ufPE.id },
            { descricao: "Teresina", unidadeFederativaId: ufPI.id },
            { descricao: "Rio de Janeiro", unidadeFederativaId: ufRJ.id },
            { descricao: "Natal", unidadeFederativaId: ufRN.id },
            { descricao: "Porto Alegre", unidadeFederativaId: ufRS.id },
            { descricao: "Porto Velho", unidadeFederativaId: ufRO.id },
            { descricao: "Boa Vista", unidadeFederativaId: ufRR.id },
            { descricao: "Florianópolis", unidadeFederativaId: ufSC.id },
            { descricao: "São Paulo", unidadeFederativaId: ufSP.id },
            { descricao: "Aracaju", unidadeFederativaId: ufSE.id },
            { descricao: "Palmas", unidadeFederativaId: ufTO.id },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${cidades.count} Capitais`);

    const cidadeManaus = await prisma.cidade.findFirst({
        where: { descricao: "Manaus" },
    });

    // Seed GeneroUsuario
    await prisma.generoUsuario.createMany({
        data: [
            {
                descricao: "Feminino",
            },
            {
                descricao: "Masculino",
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 2 GeneroUsuario");

    const generoMasculino = await prisma.generoUsuario.findUnique({
        where: { descricao: "Masculino" },
    });

    // Seed SituacaoUsuario
    await prisma.situacaoUsuario.createMany({
        data: [
            {
                descricao: "Inativo",
            },
            {
                descricao: "Ativo",
            },
            {
                descricao: "Bloqueado",
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 3 SituacaoUsuario");

    const situacaoAtivo = await prisma.situacaoUsuario.findUnique({
        where: { descricao: "Ativo" },
    });

    // Seed Grupo Usuário
    await prisma.grupoUsuario.createMany({
        data: [
            {
                descricao: "Administrador",
            },
            {
                descricao: "Básico"
            },
            {
                descricao: "Assinante"
            }
        ],
        skipDuplicates: true,
    });
    logger.info("Created 3 GrupoUsuario");

    const grupoAdmin = await prisma.grupoUsuario.findUnique({
        where: { descricao: "Administrador" },
    });

    const grupoBasico = await prisma.grupoUsuario.findUnique({
        where: { descricao: "Básico" },
    });

    // Hash das senhas usando bcrypt
    const hashedPasswordAdmin = await bcrypt.hash("123456", 10);
    const hashedPasswordBasico = await bcrypt.hash("123456", 10);

    // Seed Admin User
    await prisma.usuario.createMany({
        data: [
            {
                nome: "Studium",
                sobrenome: "Admin",
                username: "studium_admin",
                password: hashedPasswordAdmin,
                email: "admin@studium.com",
                dataNascimento: new Date("2026-01-01"),
                generoUsuarioId: generoMasculino.id,
                situacaoUsuarioId: situacaoAtivo.id,
                cidadeId: cidadeManaus.id,
                grupoUsuarioId: grupoAdmin.id,
                updatedAt: new Date(),
            },
            {
                nome: "Usuario",
                sobrenome: "Básico",
                username: "usuario_basico",
                password: hashedPasswordBasico,
                email: "usuario_basico@studium.com",
                dataNascimento: new Date("2026-01-01"),
                generoUsuarioId: generoMasculino.id,
                situacaoUsuarioId: situacaoAtivo.id,
                cidadeId: cidadeManaus.id,
                grupoUsuarioId: grupoBasico.id,
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created Admin User and Basic User`);

    logger.info("Seed finished.");
}

main()
    .catch((e) => {
        logger.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

