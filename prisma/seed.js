const { PrismaClient } = require("../src/orm/prismaClient");
const logger = require("../src/config/logger");
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

    const ufAM = await prisma.unidadeFederativa.findUnique({
        where: { sigla: "AM" },
    });

    // Seed Cidade
    await prisma.cidade.createMany({
        data: [
            {
                descricao: "Manaus",
                unidadeFederativaId: ufAM.id,
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created 01 Cidade`);

    const cidadeManaus = await prisma.cidade.findUnique({
        where: { descricao: "Manaus" },
    });

    // Seed GeneroUsuario
    await prisma.generoUsuario.createMany({
        data: [
            {
                genero: "Feminino",
            },
            {
                genero: "Masculino",
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 2 GeneroUsuario");

    const generoMasculino = await prisma.generoUsuario.findUnique({
        where: { genero: "Masculino" },
    });

    // Seed SituacaoUsuario
    await prisma.situacaoUsuario.createMany({
        data: [
            {
                situacao: "Inativo",
            },
            {
                situacao: "Ativo",
            },
            {
                situacao: "Bloqueado",
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 3 SituacaoUsuario");

    const situacaoAtivo = await prisma.situacaoUsuario.findUnique({
        where: { situacao: "Ativo" },
    });

    // Seed Grupo Usuário
    await prisma.grupoUsuario.createMany({
        data: [
            {
                grupo: "Administrador",
            },
            {
                grupo: "Básico"
            },
            {
                grupo: "Assinante"
            }
        ]
    });
    logger.info("Created 3 GrupoUsuario");

    const grupoAdmin = await prisma.grupoUsuario.findUnique({
        where: { grupo: "Administrador" },
    });

    // Seed Admin User
    await prisma.usuario.createMany({
        data: [
            {
                descricao: "Studium",
                sobredescricao: "Admin",
                username: "studium_admin",
                password: "123456",
                email: "admin@studium.com",
                dataNascimento: new Date("2026-01-01"),
                generoUsuarioId: generoMasculino.id,
                situacaoUsuarioId: situacaoAtivo.id,
                cidadeId: cidadeManaus.id,
                unidadeFederativaId: ufAM.id,
                grupoUsuarioId: grupoAdmin.id,
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created Admin User`);

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

