const prisma = require("../src/orm/prismaClient");
const bcrypt = require("bcryptjs");
const logger = require("../src/config/logger");

async function main() {
    logger.info("Seeding database...");

    // Criar GrupoUsuario
    const grupoAdmin = await prisma.grupoUsuario.upsert({
        where: { descricao: "Administrador" },
        update: {},
        create: { descricao: "Administrador" },
    });

    const grupoUsuario = await prisma.grupoUsuario.upsert({
        where: { descricao: "Usuário" },
        update: {},
        create: { descricao: "Usuário" },
    });

    logger.info("GrupoUsuario criados");

    // Criar Cidades
    const cidadeSP = await prisma.cidade.upsert({
        where: {
            descricao_unidadeFederativa: {
                descricao: "São Paulo",
                unidadeFederativa: "SP",
            },
        },
        update: {},
        create: {
            descricao: "São Paulo",
            unidadeFederativa: "SP",
        },
    });

    const cidadeRJ = await prisma.cidade.upsert({
        where: {
            descricao_unidadeFederativa: {
                descricao: "Rio de Janeiro",
                unidadeFederativa: "RJ",
            },
        },
        update: {},
        create: {
            descricao: "Rio de Janeiro",
            unidadeFederativa: "RJ",
        },
    });

    const cidadeBH = await prisma.cidade.upsert({
        where: {
            descricao_unidadeFederativa: {
                descricao: "Belo Horizonte",
                unidadeFederativa: "MG",
            },
        },
        update: {},
        create: {
            descricao: "Belo Horizonte",
            unidadeFederativa: "MG",
        },
    });

    logger.info("Cidades criadas");

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Criar Usuário Admin
    const usuarioAdmin = await prisma.usuario.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            nome: "Administrador",
            sobrenome: "Sistema",
            username: "admin",
            password: hashedPassword,
            email: "admin@studium.com",
            generoUsuario: "OUTRO",
            situacaoUsuario: "ATIVO",
            cidadeId: cidadeSP.id,
            grupoUsuarioId: grupoAdmin.id,
        },
    });

    logger.info("Usuário admin criado");

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PLANO 1: TRF - Tribunal Regional Federal
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const planoTRF = await prisma.planoEstudo.upsert({
        where: {
            titulo_usuarioId: {
                titulo: "Preparação TRF 2026",
                usuarioId: usuarioAdmin.id,
            },
        },
        update: {},
        create: {
            titulo: "Preparação TRF 2026",
            concurso: "Tribunal Regional Federal da 1ª Região",
            cargo: "Técnico Judiciário - Área Administrativa",
            banca: "CESPE/CEBRASPE",
            dataProva: new Date("2026-08-20"),
            situacao: "NOVO",
            segunda_horas: 0.0,
            segunda_ativo: false,
            terca_horas: 0.0,
            terca_ativo: false,
            quarta_horas: 0.0,
            quarta_ativo: false,
            quinta_horas: 0.0,
            quinta_ativo: false,
            sexta_horas: 0.0,
            sexta_ativo: false,
            sabado_horas: 0.0,
            sabado_ativo: false,
            domingo_horas: 0.0,
            domingo_ativo: false,
            usuarioId: usuarioAdmin.id,
        },
    });

    // Limpar disciplinas antigas do TRF
    await prisma.disciplina.deleteMany({
        where: { planoId: planoTRF.id }
    });

    // Limpar disciplinas antigas do TRF
    await prisma.disciplina.deleteMany({
        where: { planoId: planoTRF.id }
    });

    // Disciplinas do TRF
    const disciplinaDirAdm = await prisma.disciplina.create({
        data: {
            titulo: "Direito Administrativo",
            cor: "#4ECDC4",
            importancia: 5.0,
            conhecimento: 2.0,
            horasSemanais: 0.0,
            planoId: planoTRF.id,
        },
    });

    const disciplinaDirConst = await prisma.disciplina.create({
        data: {
            titulo: "Direito Constitucional",
            cor: "#FF6B6B",
            importancia: 5.0,
            conhecimento: 2.5,
            horasSemanais: 0.0,
            planoId: planoTRF.id,
        },
    });

    const disciplinaInformatica = await prisma.disciplina.create({
        data: {
            titulo: "Noções de Informática",
            cor: "#95E1D3",
            importancia: 3.0,
            conhecimento: 4.0,
            horasSemanais: 0.0,
            planoId: planoTRF.id,
        },
    });

    // Tópicos para Direito Administrativo
    await prisma.topico.createMany({
        data: [
            { titulo: "Princípios da Administração Pública", ordem: 1, estabilidade: 2.0, dificuldade: 3.0, disciplinaId: disciplinaDirAdm.id },
            { titulo: "Atos Administrativos", ordem: 2, estabilidade: 2.5, dificuldade: 4.0, disciplinaId: disciplinaDirAdm.id },
            { titulo: "Licitações e Contratos", ordem: 3, estabilidade: 1.5, dificuldade: 4.5, disciplinaId: disciplinaDirAdm.id },
            { titulo: "Servidores Públicos", ordem: 4, estabilidade: 2.0, dificuldade: 3.5, disciplinaId: disciplinaDirAdm.id },
        ],
    });

    // Tópicos para Direito Constitucional
    await prisma.topico.createMany({
        data: [
            { titulo: "Princípios Fundamentais", ordem: 1, estabilidade: 3.0, dificuldade: 2.5, disciplinaId: disciplinaDirConst.id },
            { titulo: "Direitos e Garantias Fundamentais", ordem: 2, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaDirConst.id },
            { titulo: "Organização do Estado", ordem: 3, estabilidade: 2.0, dificuldade: 3.0, disciplinaId: disciplinaDirConst.id },
        ],
    });

    // Tópicos para Informática
    await prisma.topico.createMany({
        data: [
            { titulo: "Sistemas Operacionais", ordem: 1, estabilidade: 3.5, dificuldade: 2.0, disciplinaId: disciplinaInformatica.id },
            { titulo: "Segurança da Informação", ordem: 2, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaInformatica.id },
        ],
    });

    logger.info("Plano TRF criado com disciplinas e tópicos");

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PLANO 2: Polícia Federal
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const planoPF = await prisma.planoEstudo.upsert({
        where: {
            titulo_usuarioId: {
                titulo: "Concurso Polícia Federal 2026",
                usuarioId: usuarioAdmin.id,
            },
        },
        update: {},
        create: {
            titulo: "Concurso Polícia Federal 2026",
            concurso: "Polícia Federal - Agente",
            cargo: "Agente de Polícia Federal",
            banca: "CESPE/CEBRASPE",
            dataProva: new Date("2026-10-15"),
            situacao: "CONCLUIDO",
            segunda_horas: 0.0,
            segunda_ativo: false,
            terca_horas: 0.0,
            terca_ativo: false,
            quarta_horas: 0.0,
            quarta_ativo: false,
            quinta_horas: 0.0,
            quinta_ativo: false,
            sexta_horas: 0.0,
            sexta_ativo: false,
            sabado_horas: 0.0,
            sabado_ativo: false,
            domingo_horas: 0.0,
            domingo_ativo: false,
            usuarioId: usuarioAdmin.id,
        },
    });

    // Limpar disciplinas antigas da Polícia Federal
    await prisma.disciplina.deleteMany({
        where: { planoId: planoPF.id }
    });

    // Limpar disciplinas antigas da Polícia Federal
    await prisma.disciplina.deleteMany({
        where: { planoId: planoPF.id }
    });

    // Disciplinas da Polícia Federal
    const disciplinaDirPenal = await prisma.disciplina.create({
        data: {
            titulo: "Direito Penal",
            cor: "#F38181",
            importancia: 5.0,
            conhecimento: 1.5,
            horasSemanais: 0.0,
            planoId: planoPF.id,
        },
    });

    const disciplinaDirProcPenal = await prisma.disciplina.create({
        data: {
            titulo: "Direito Processual Penal",
            cor: "#AA96DA",
            importancia: 1.0,
            conhecimento: 1.5,
            horasSemanais: 0.0,
            planoId: planoPF.id,
        },
    });

    const disciplinaLegEsp = await prisma.disciplina.create({
        data: {
            titulo: "Legislação Especial",
            cor: "#FCBAD3",
            importancia: 4.5,
            conhecimento: 2.0,
            horasSemanais: 0.0,
            planoId: planoPF.id,
        },
    });

    // Tópicos para Direito Penal
    await prisma.topico.createMany({
        data: [
            { titulo: "Aplicação da Lei Penal", ordem: 1, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaDirPenal.id },
            { titulo: "Crime e Imputabilidade", ordem: 2, estabilidade: 2.0, dificuldade: 4.0, disciplinaId: disciplinaDirPenal.id },
            { titulo: "Crimes contra a Pessoa", ordem: 3, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaDirPenal.id },
            { titulo: "Crimes contra o Patrimônio", ordem: 4, estabilidade: 2.0, dificuldade: 4.0, disciplinaId: disciplinaDirPenal.id },
        ],
    });

    // Tópicos para Direito Processual Penal
    await prisma.topico.createMany({
        data: [
            { titulo: "Inquérito Policial", ordem: 1, estabilidade: 3.0, dificuldade: 3.0, disciplinaId: disciplinaDirProcPenal.id },
            { titulo: "Ação Penal", ordem: 2, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaDirProcPenal.id },
            { titulo: "Provas", ordem: 3, estabilidade: 2.0, dificuldade: 4.0, disciplinaId: disciplinaDirProcPenal.id },
        ],
    });

    // Tópicos para Legislação Especial
    await prisma.topico.createMany({
        data: [
            { titulo: "Lei de Drogas", ordem: 1, estabilidade: 2.5, dificuldade: 4.0, disciplinaId: disciplinaLegEsp.id },
            { titulo: "Estatuto do Desarmamento", ordem: 2, estabilidade: 2.0, dificuldade: 3.5, disciplinaId: disciplinaLegEsp.id },
            { titulo: "Crimes Hediondos", ordem: 3, estabilidade: 2.5, dificuldade: 4.0, disciplinaId: disciplinaLegEsp.id },
        ],
    });

    logger.info("Plano Polícia Federal criado com disciplinas e tópicos");

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PLANO 3: TCU - Tribunal de Contas da União
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const planoTCU = await prisma.planoEstudo.upsert({
        where: {
            titulo_usuarioId: {
                titulo: "Preparação TCU 2027",
                usuarioId: usuarioAdmin.id,
            },
        },
        update: {},
        create: {
            titulo: "Preparação TCU 2027",
            concurso: "Tribunal de Contas da União",
            cargo: "Auditor Federal de Controle Externo",
            banca: "CESPE/CEBRASPE",
            dataProva: new Date("2027-03-10"),
            situacao: "NOVO",
            segunda_horas: 0.0,
            segunda_ativo: false,
            terca_horas: 0.0,
            terca_ativo: false,
            quarta_horas: 0.0,
            quarta_ativo: false,
            quinta_horas: 0.0,
            quinta_ativo: false,
            sexta_horas: 0.0,
            sexta_ativo: false,
            sabado_horas: 0.0,
            sabado_ativo: false,
            domingo_horas: 0.0,
            domingo_ativo: false,
            usuarioId: usuarioAdmin.id,
        },
    });

    // Limpar disciplinas antigas do TCU
    await prisma.disciplina.deleteMany({
        where: { planoId: planoTCU.id }
    });

    // Limpar disciplinas antigas do TCU
    await prisma.disciplina.deleteMany({
        where: { planoId: planoTCU.id }
    });

    // Disciplinas do TCU
    const disciplinaControleExt = await prisma.disciplina.create({
        data: {
            titulo: "Controle Externo",
            cor: "#A8E6CF",
            importancia: 5.0,
            conhecimento: 1.0,
            horasSemanais: 0.0,
            planoId: planoTCU.id,
        },
    });

    const disciplinaAuditoria = await prisma.disciplina.create({
        data: {
            titulo: "Auditoria Governamental",
            cor: "#FFD3B6",
            importancia: 5.0,
            conhecimento: 1.5,
            horasSemanais: 0.0,
            planoId: planoTCU.id,
        },
    });

    const disciplinaContabilidade = await prisma.disciplina.create({
        data: {
            titulo: "Contabilidade Pública",
            cor: "#FFAAA5",
            importancia: 4.5,
            conhecimento: 2.0,
            horasSemanais: 0.0,
            planoId: planoTCU.id,
        },
    });

    // Tópicos para Controle Externo
    await prisma.topico.createMany({
        data: [
            { titulo: "Tribunal de Contas da União", ordem: 1, estabilidade: 2.0, dificuldade: 4.0, disciplinaId: disciplinaControleExt.id },
            { titulo: "Competências do TCU", ordem: 2, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaControleExt.id },
            { titulo: "Fiscalização Contábil e Financeira", ordem: 3, estabilidade: 2.0, dificuldade: 4.5, disciplinaId: disciplinaControleExt.id },
        ],
    });

    // Tópicos para Auditoria Governamental
    await prisma.topico.createMany({
        data: [
            { titulo: "Normas de Auditoria", ordem: 1, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaAuditoria.id },
            { titulo: "Auditoria de Conformidade", ordem: 2, estabilidade: 2.0, dificuldade: 4.0, disciplinaId: disciplinaAuditoria.id },
            { titulo: "Auditoria Operacional", ordem: 3, estabilidade: 1.5, dificuldade: 4.5, disciplinaId: disciplinaAuditoria.id },
            { titulo: "Técnicas de Auditoria", ordem: 4, estabilidade: 2.0, dificuldade: 4.0, disciplinaId: disciplinaAuditoria.id },
        ],
    });

    // Tópicos para Contabilidade Pública
    await prisma.topico.createMany({
        data: [
            { titulo: "Orçamento Público", ordem: 1, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaContabilidade.id },
            { titulo: "Receita Pública", ordem: 2, estabilidade: 2.5, dificuldade: 3.0, disciplinaId: disciplinaContabilidade.id },
            { titulo: "Despesa Pública", ordem: 3, estabilidade: 2.5, dificuldade: 3.5, disciplinaId: disciplinaContabilidade.id },
        ],
    });

    logger.info("Plano TCU criado com disciplinas e tópicos");

    logger.info("✅ Seed completo!");
}

main()
    .catch((e) => {
        logger.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

