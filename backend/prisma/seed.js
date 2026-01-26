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

    // Buscar o usuário básico criado
    const usuarioBasico = await prisma.usuario.findUnique({
        where: { username: "usuario_basico" },
    });

    // Seed SituacaoPlano
    await prisma.situacaoPlano.createMany({
        data: [
            { descricao: "Em Andamento" },
            { descricao: "Novo" },
            { descricao: "Pausado" },
            { descricao: "Concluído" },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 4 SituacaoPlano");

    const situacaoNovo = await prisma.situacaoPlano.findUnique({
        where: { descricao: "Novo" },
    });

    // Seed 3 Planos de Estudo para o usuário básico
    const plano1 = await prisma.planoEstudo.upsert({
        where: {
            titulo_usuarioId: {
                titulo: "Preparação TRF 2024",
                usuarioId: usuarioBasico.id,
            },
        },
        update: {},
        create: {
            titulo: "Preparação TRF 2024",
            concurso: "Concurso Tribunal Regional Federal da 1ª Região",
            cargo: "Técnico Judiciário - Área Administrativa",
            banca: "CESPE/CEBRASPE",
            dataProva: new Date("2024-06-15"),
            usuarioId: usuarioBasico.id,
            situacaoId: situacaoNovo.id,
        },
    });

    const plano2 = await prisma.planoEstudo.upsert({
        where: {
            titulo_usuarioId: {
                titulo: "Concurso Polícia Federal 2024",
                usuarioId: usuarioBasico.id,
            },
        },
        update: {},
        create: {
            titulo: "Concurso Polícia Federal 2024",
            concurso: "Concurso Nacional Unificado da Polícia Federal",
            cargo: "Agente de Polícia Federal",
            banca: "Fundação Carlos Chagas (FCC)",
            dataProva: new Date("2024-09-20"),
            usuarioId: usuarioBasico.id,
            situacaoId: situacaoNovo.id,
        },
    });

    const plano3 = await prisma.planoEstudo.upsert({
        where: {
            titulo_usuarioId: {
                titulo: "Preparação TCU 2024",
                usuarioId: usuarioBasico.id,
            },
        },
        update: {},
        create: {
            titulo: "Preparação TCU 2024",
            concurso: "Tribunal de Contas da União",
            cargo: "Auditor Federal de Controle Externo",
            banca: "CESPE/CEBRASPE",
            dataProva: new Date("2024-12-10"),
            usuarioId: usuarioBasico.id,
            situacaoId: situacaoNovo.id,
        },
    });
    logger.info("Created 3 PlanoEstudo for usuario_basico");

    // Seed Disciplinas para o Plano 1 (TRF)
    const discConstPlano1 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Direito Constitucional",
                planoId: plano1.id,
            },
        },
        update: {},
        create: {
            titulo: "Direito Constitucional",
            cor: "#FF6B6B",
            planoId: plano1.id,
        },
    });

    const discAdmPlano1 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Direito Administrativo",
                planoId: plano1.id,
            },
        },
        update: {},
        create: {
            titulo: "Direito Administrativo",
            cor: "#4ECDC4",
            planoId: plano1.id,
        },
    });

    const discPortPlano1 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Língua Portuguesa",
                planoId: plano1.id,
            },
        },
        update: {},
        create: {
            titulo: "Língua Portuguesa",
            cor: "#95E1D3",
            planoId: plano1.id,
        },
    });
    logger.info("Created 3 Disciplinas for Plano 1 (TRF)");

    // Seed Disciplinas para o Plano 2 (Polícia Federal)
    const discPenalPlano2 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Direito Penal",
                planoId: plano2.id,
            },
        },
        update: {},
        create: {
            titulo: "Direito Penal",
            cor: "#F38181",
            planoId: plano2.id,
        },
    });

    const discProcPenalPlano2 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Direito Processual Penal",
                planoId: plano2.id,
            },
        },
        update: {},
        create: {
            titulo: "Direito Processual Penal",
            cor: "#AA96DA",
            planoId: plano2.id,
        },
    });

    const discLegEspPlano2 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Legislação Especial",
                planoId: plano2.id,
            },
        },
        update: {},
        create: {
            titulo: "Legislação Especial",
            cor: "#FCBAD3",
            planoId: plano2.id,
        },
    });
    logger.info("Created 3 Disciplinas for Plano 2 (Polícia Federal)");

    // Seed Disciplinas para o Plano 3 (TCU)
    const discControlePlano3 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Controle Externo",
                planoId: plano3.id,
            },
        },
        update: {},
        create: {
            titulo: "Controle Externo",
            cor: "#A8E6CF",
            planoId: plano3.id,
        },
    });

    const discAuditoriaPlano3 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Auditoria Governamental",
                planoId: plano3.id,
            },
        },
        update: {},
        create: {
            titulo: "Auditoria Governamental",
            cor: "#FFD3B6",
            planoId: plano3.id,
        },
    });

    const discConstPlano3 = await prisma.disciplina.upsert({
        where: {
            titulo_planoId: {
                titulo: "Direito Constitucional",
                planoId: plano3.id,
            },
        },
        update: {},
        create: {
            titulo: "Direito Constitucional",
            cor: "#FFAAA5",
            planoId: plano3.id,
        },
    });
    logger.info("Created 3 Disciplinas for Plano 3 (TCU)");

    // Seed Tópicos para Direito Constitucional (Plano 1)
    await prisma.topico.createMany({
        data: [
            { titulo: "Princípios Fundamentais", ordem: 1, disciplinaId: discConstPlano1.id },
            { titulo: "Direitos e Garantias Fundamentais", ordem: 2, disciplinaId: discConstPlano1.id },
            { titulo: "Organização do Estado", ordem: 3, disciplinaId: discConstPlano1.id },
            { titulo: "Poder Legislativo", ordem: 4, disciplinaId: discConstPlano1.id },
            { titulo: "Poder Executivo", ordem: 5, disciplinaId: discConstPlano1.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 5 Tópicos for Direito Constitucional (Plano 1)");

    // Seed Tópicos para Direito Administrativo (Plano 1)
    await prisma.topico.createMany({
        data: [
            { titulo: "Princípios da Administração Pública", ordem: 1, disciplinaId: discAdmPlano1.id },
            { titulo: "Atos Administrativos", ordem: 2, disciplinaId: discAdmPlano1.id },
            { titulo: "Licitações e Contratos", ordem: 3, disciplinaId: discAdmPlano1.id },
            { titulo: "Servidores Públicos", ordem: 4, disciplinaId: discAdmPlano1.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 4 Tópicos for Direito Administrativo (Plano 1)");

    // Seed Tópicos para Língua Portuguesa (Plano 1)
    await prisma.topico.createMany({
        data: [
            { titulo: "Interpretação de Textos", ordem: 1, disciplinaId: discPortPlano1.id },
            { titulo: "Ortografia e Acentuação", ordem: 2, disciplinaId: discPortPlano1.id },
            { titulo: "Sintaxe", ordem: 3, disciplinaId: discPortPlano1.id },
            { titulo: "Concordância Verbal e Nominal", ordem: 4, disciplinaId: discPortPlano1.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 4 Tópicos for Língua Portuguesa (Plano 1)");

    // Seed Tópicos para Direito Penal (Plano 2)
    await prisma.topico.createMany({
        data: [
            { titulo: "Aplicação da Lei Penal", ordem: 1, disciplinaId: discPenalPlano2.id },
            { titulo: "Crime e Imputabilidade", ordem: 2, disciplinaId: discPenalPlano2.id },
            { titulo: "Crimes contra a Pessoa", ordem: 3, disciplinaId: discPenalPlano2.id },
            { titulo: "Crimes contra o Patrimônio", ordem: 4, disciplinaId: discPenalPlano2.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 4 Tópicos for Direito Penal (Plano 2)");

    // Seed Tópicos para Direito Processual Penal (Plano 2)
    await prisma.topico.createMany({
        data: [
            { titulo: "Inquérito Policial", ordem: 1, disciplinaId: discProcPenalPlano2.id },
            { titulo: "Ação Penal", ordem: 2, disciplinaId: discProcPenalPlano2.id },
            { titulo: "Provas", ordem: 3, disciplinaId: discProcPenalPlano2.id },
            { titulo: "Prisão e Liberdade Provisória", ordem: 4, disciplinaId: discProcPenalPlano2.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 4 Tópicos for Direito Processual Penal (Plano 2)");

    // Seed Tópicos para Legislação Especial (Plano 2)
    await prisma.topico.createMany({
        data: [
            { titulo: "Lei de Drogas", ordem: 1, disciplinaId: discLegEspPlano2.id },
            { titulo: "Estatuto do Desarmamento", ordem: 2, disciplinaId: discLegEspPlano2.id },
            { titulo: "Crimes Hediondos", ordem: 3, disciplinaId: discLegEspPlano2.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 3 Tópicos for Legislação Especial (Plano 2)");

    // Seed Tópicos para Controle Externo (Plano 3)
    await prisma.topico.createMany({
        data: [
            { titulo: "Tribunal de Contas da União", ordem: 1, disciplinaId: discControlePlano3.id },
            { titulo: "Competências do TCU", ordem: 2, disciplinaId: discControlePlano3.id },
            { titulo: "Fiscalização Contábil e Financeira", ordem: 3, disciplinaId: discControlePlano3.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 3 Tópicos for Controle Externo (Plano 3)");

    // Seed Tópicos para Auditoria Governamental (Plano 3)
    await prisma.topico.createMany({
        data: [
            { titulo: "Normas de Auditoria", ordem: 1, disciplinaId: discAuditoriaPlano3.id },
            { titulo: "Auditoria de Conformidade", ordem: 2, disciplinaId: discAuditoriaPlano3.id },
            { titulo: "Auditoria Operacional", ordem: 3, disciplinaId: discAuditoriaPlano3.id },
            { titulo: "Técnicas de Auditoria", ordem: 4, disciplinaId: discAuditoriaPlano3.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 4 Tópicos for Auditoria Governamental (Plano 3)");

    // Seed Tópicos para Direito Constitucional (Plano 3)
    await prisma.topico.createMany({
        data: [
            { titulo: "Controle de Constitucionalidade", ordem: 1, disciplinaId: discConstPlano3.id },
            { titulo: "Direitos Sociais", ordem: 2, disciplinaId: discConstPlano3.id },
            { titulo: "Orçamento Público", ordem: 3, disciplinaId: discConstPlano3.id },
        ],
        skipDuplicates: true,
    });
    logger.info("Created 3 Tópicos for Direito Constitucional (Plano 3)");

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

