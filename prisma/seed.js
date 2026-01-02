const { PrismaClient } = require("../src/orm/prismaClient");
const logger = require("../src/config/logger");
const prisma = require("../src/orm/prismaClient");

async function main() {

    logger.info("Seeding database...");

    // Seed UnidadeFederativa
    const ufs = await prisma.unidadeFederativa.createMany({
        data: [
            {
                nome: "Acre",
                sigla: "AC",
            },
            {
                nome: "Alagoas",
                sigla: "AL",
            },
            {
                nome: "Amazonas",
                sigla: "AM",
            },
            {
                nome: "Bahia",
                sigla: "BA",
            },
            {
                nome: "Ceará",
                sigla: "CE",
            },
            {
                nome: "Distrito Federal",
                sigla: "DF",
            },
            {
                nome: "Espirito Santo",
                sigla: "ES",
            },
            {
                nome: "Goiás",
                sigla: "GO",
            },
            {
                nome: "Maranhão",
                sigla: "MA",
            },
            {
                nome: "Mato Grosso",
                sigla: "MT",
            },
            {
                nome: "Mato Grosso do Sul",
                sigla: "MS",
            },
            {
                nome: "Minas Gerais",
                sigla: "MG",
            },
            {
                nome: "Pará",
                sigla: "PA",
            },
            {
                nome: "Pernambuco",
                sigla: "PE",
            },
            {
                nome: "Piauí",
                sigla: "PI",
            },
            {
                nome: "Rio de Janeiro",
                sigla: "RJ",
            },
            {
                nome: "Rio Grande do Norte",
                sigla: "RN",
            },
            {
                nome: "Rio Grande do Sul",
                sigla: "RS",
            },
            {
                nome: "Rondônia",
                sigla: "RO",
            },
            {
                nome: "Roraima",
                sigla: "RR",
            },
            {
                nome: "Santa Catarina",
                sigla: "SC",
            },
            {
                nome: "São Paulo",
                sigla: "SP",
            },
            {
                nome: "Sergipe",
                sigla: "SE",
            },
            {
                nome: "Tocantins",
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
                cidade: "Manaus",
                unidadeFederativaId: ufAM.id,
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created 01 Cidade`);

    const cidadeManaus = await prisma.cidade.findUnique({
        where: { cidade: "Manaus" },
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
                nome: "Studium",
                sobrenome: "Admin",
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
