const { PrismaClient } = require("@prisma/client");
const logger = require("../src/config/logger");

const prisma = new PrismaClient();

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

    // Seed Admin User
    await prisma.usuario.createMany({
        data: [
            {
                nome: "Studium",
                sobrenome: "Admin",
                username: "studium_admin",
                email: "admin@studium.com",
                dataNascimento: new Date("2026-01-01"),
                generoUsuarioId: generoMasculino.id,
                cidadeId: cidadeManaus.id,
                situacaoUsuarioId: situacaoAtivo.id,
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created Admin User`);

    // Seed Fornecedores with camelCase field names (Prisma Client format)
    const fornecedores = await prisma.fornecedor.createMany({
        data: [
            {
                razaoSocial: "Auto Peças Silva Ltda",
                cpfCnpj: "12345678000190",
                tipo: "PJ",
                endereco: "Av. Principal, 1000",
                cidade: "Fortaleza",
                uf: "CE",
                cep: "60000000",
                telefone1: "+5585988887777",
                telefone2: "+5585977776666",
                site: "https://autopecassilva.com.br",
                email: "contato@autopecassilva.com.br",
                situacao: "ATIVO",
                observacoes: "Fornecedor principal de peças automotivas",
                updatedAt: new Date(),
            },
            {
                razaoSocial: "João Carlos Veículos ME",
                cpfCnpj: "98765432000111",
                tipo: "PJ",
                endereco: "Rua das Flores, 500",
                cidade: "Manaus",
                uf: "AM",
                cep: "69000000",
                telefone1: "+5592991234567",
                email: "joao.veiculos@email.com",
                situacao: "ATIVO",
                observacoes: null,
                updatedAt: new Date(),
            },
            {
                razaoSocial: "Maria Santos Comércio",
                cpfCnpj: "12345678901",
                tipo: "PF",
                endereco: "Av. Beira Mar, 200",
                cidade: "Fortaleza",
                uf: "CE",
                cep: "60165000",
                telefone1: "+5585999887766",
                email: "maria.santos@email.com",
                situacao: "ATIVO",
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${fornecedores.count} fornecedores`);

    // Seed TipoCombustivel
    const tiposCombustivel = await prisma.tipoCombustivel.createMany({
        data: [
            { descricao: "GASOLINA" },
            { descricao: "ETANOL" },
            { descricao: "DIESEL" },
            { descricao: "FLEX" },
            { descricao: "GNV" },
            { descricao: "ELÉTRICO" },
            { descricao: "HÍBRIDO" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${tiposCombustivel.count} tipos de combustível`);

    // Seed CategoriaVeiculo
    const categorias = await prisma.categoriaVeiculo.createMany({
        data: [
            { descricao: "CONVERSÍVEL" },
            { descricao: "CUPÊ" },
            { descricao: "ESPORTIVO" },
            { descricao: "HATCH" },
            { descricao: "PICAPE" },
            { descricao: "SEDÃ" },
            { descricao: "SUV" },
            { descricao: "SW/PERUA" },
            { descricao: "VAN" },
            { descricao: "OUTRO" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${categorias.count} categorias de veículo`);

    // Seed TipoTransmissao
    const tiposTransmissao = await prisma.tipoTransmissao.createMany({
        data: [
            { descricao: "MANUAL" },
            { descricao: "AUTOMÁTICA" },
            { descricao: "SEMI AUTOMÁTICA" },
            { descricao: "CVT" },
            { descricao: "OUTRA" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${tiposTransmissao.count} tipos de transmissão`);

    // Seed TipoDirecao
    const tiposDirecao = await prisma.tipoDirecao.createMany({
        data: [
            { descricao: "MANUAL" },
            { descricao: "HIDRÁULICA" },
            { descricao: "ELÉTRICA" },
            { descricao: "ELETRO-HIDRÁULICA" },
            { descricao: "OUTRA" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${tiposDirecao.count} tipos de direção`);

    // Seed SituacaoLicenciamento
    const situacoesLic = await prisma.situacaoLicenciamento.createMany({
        data: [
            { descricao: "EM ATRASO" },
            { descricao: "IRREGULAR" },
            { descricao: "PENDENTE" },
            { descricao: "REGULAR" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${situacoesLic.count} situações de licenciamento`);

    // Seed SituacaoVeiculo
    const situacoesVeic = await prisma.situacaoVeiculo.createMany({
        data: [
            { descricao: "DISPONÍVEL" },
            { descricao: "VENDIDO" },
            { descricao: "EM MANUTENÇÃO" },
            { descricao: "RESERVADO" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${situacoesVeic.count} situações de veículo`);

    // Seed EstadoVeiculo
    const estadosVeiculo = await prisma.estadoVeiculo.createMany({
        data: [
            { descricao: "NOVO" },
            { descricao: "SEMINOVO" },
            { descricao: "USADO" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${estadosVeiculo.count} estados de veículo`);

    // Get IDs for vehicle creation
    const gasolina = await prisma.tipoCombustivel.findUnique({
        where: { descricao: "GASOLINA" },
    });
    const sedan = await prisma.categoriaVeiculo.findUnique({
        where: { descricao: "SEDÃ" },
    });
    const automatic = await prisma.tipoTransmissao.findUnique({
        where: { descricao: "AUTOMÁTICA" },
    });
    const electric = await prisma.tipoDirecao.findUnique({
        where: { descricao: "ELÉTRICA" },
    });
    const regular = await prisma.situacaoLicenciamento.findUnique({
        where: { descricao: "REGULAR" },
    });
    const available = await prisma.situacaoVeiculo.findUnique({
        where: { descricao: "DISPONÍVEL" },
    });
    const usado = await prisma.estadoVeiculo.findUnique({
        where: { descricao: "USADO" },
    });

    // Seed Unidades with camelCase field names (Prisma Client format)
    const unidades = await prisma.unidade.createMany({
        data: [
            {
                nome: "Unidade Fortaleza",
                endereco: "Av. Washington Soares, 2100 - Loja 6 - Edson Queiroz",
                cidade: "Fortaleza",
                uf: "CE",
                cep: "60810-350",
                telefone1: "+5592993351689",
                telefone2: "0800 591 5937",
                updatedAt: new Date(),
            },
            {
                nome: "Unidade Manaus",
                endereco: "Av. Constantino Nery, 2022 - São Geraldo",
                cidade: "Manaus",
                uf: "AM",
                cep: "69050-000",
                telefone1: "+5592982420010",
                telefone2: "0800 591 5937",
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${unidades.count} unidades`);

    // Get unidade IDs
    const fortaleza = await prisma.unidade.findFirst({
        where: { nome: "Unidade Manaus" },
    });
    const manaus = await prisma.unidade.findFirst({
        where: { nome: "Unidade Fortaleza" },
    });

    // Get additional categories and types for vehicles
    const suv = await prisma.categoriaVeiculo.findUnique({
        where: { descricao: "SUV" },
    });
    const hatch = await prisma.categoriaVeiculo.findUnique({
        where: { descricao: "HATCH" },
    });
    const picape = await prisma.categoriaVeiculo.findUnique({
        where: { descricao: "PICAPE" },
    });
    const flex = await prisma.tipoCombustivel.findUnique({
        where: { descricao: "FLEX" },
    });
    const diesel = await prisma.tipoCombustivel.findUnique({
        where: { descricao: "DIESEL" },
    });
    const manual = await prisma.tipoTransmissao.findUnique({
        where: { descricao: "MANUAL" },
    });
    const hydraulic = await prisma.tipoDirecao.findUnique({
        where: { descricao: "HIDRÁULICA" },
    });
    const seminovo = await prisma.estadoVeiculo.findUnique({
        where: { descricao: "SEMINOVO" },
    });
    const novo = await prisma.estadoVeiculo.findUnique({
        where: { descricao: "NOVO" },
    });

    const cliente1 = await prisma.cliente.findFirst({
        where: { nomeCompleto: "João da Silva Santos" },
    });
    const cliente2 = await prisma.cliente.findFirst({
        where: { nomeCompleto: "Carlos Roberto Pereira" },
    });

    // Seed Vehicles with camelCase field names (Prisma Client format)
    await prisma.veiculo.createMany({
        data: [
            {
                placa: "ABC1D23",
                renavam: "12345678901",
                ano: 2025,
                marca: "Toyota",
                modelo: "Corolla XEi",
                categoriaVeiculoId: sedan.id,
                cor: "Prata",
                portas: 4,
                motorizacao: "2.0 16V",
                tipoCombustivelId: flex.id,
                unidadeId: fortaleza.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                clienteId: cliente1.id,
                kilometragem: 15000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: usado.id,
                updatedAt: new Date(),
            },
            {
                placa: "XYZ9F88",
                renavam: "98765432109",
                ano: 2024,
                marca: "Honda",
                modelo: "Civic Touring",
                categoriaVeiculoId: sedan.id,
                cor: "Preto",
                portas: 4,
                motorizacao: "1.5 Turbo",
                tipoCombustivelId: gasolina.id,
                unidadeId: fortaleza.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                clienteId: cliente1.id,
                kilometragem: 8000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: seminovo.id,
                updatedAt: new Date(),
            },
            {
                placa: "JKL4H56",
                renavam: "11223344556",
                ano: 2023,
                marca: "Volkswagen",
                modelo: "T-Cross Highline",
                categoriaVeiculoId: suv.id,
                cor: "Branco",
                portas: 4,
                motorizacao: "1.4 TSI",
                tipoCombustivelId: flex.id,
                unidadeId: manaus.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                clienteId: cliente2.id,
                kilometragem: 22000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: usado.id,
                updatedAt: new Date(),
            },
            {
                placa: "MNO7P89",
                renavam: "55667788990",
                ano: 2025,
                marca: "Jeep",
                modelo: "Compass Sport",
                categoriaVeiculoId: suv.id,
                cor: "Cinza",
                portas: 4,
                motorizacao: "1.3 Turbo",
                tipoCombustivelId: flex.id,
                unidadeId: manaus.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                kilometragem: 5000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: novo.id,
                updatedAt: new Date(),
            },
            {
                placa: "QRS1T23",
                renavam: "99887766554",
                ano: 2022,
                marca: "Chevrolet",
                modelo: "Onix Plus Premier",
                categoriaVeiculoId: sedan.id,
                cor: "Vermelho",
                portas: 4,
                motorizacao: "1.0 Turbo",
                tipoCombustivelId: flex.id,
                unidadeId: fortaleza.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                clienteId: cliente2.id,
                kilometragem: 35000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: usado.id,
                updatedAt: new Date(),
            },
            {
                placa: "UVW3X45",
                renavam: "33445566778",
                ano: 2023,
                marca: "Hyundai",
                modelo: "HB20 Evolution",
                categoriaVeiculoId: hatch.id,
                cor: "Azul",
                portas: 4,
                motorizacao: "1.0 Turbo",
                tipoCombustivelId: flex.id,
                unidadeId: fortaleza.id,
                tipoTransmissaoId: manual.id,
                tipoDirecaoId: hydraulic.id,
                kilometragem: 18000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: usado.id,
                updatedAt: new Date(),
            },
            {
                placa: "YZA5B67",
                renavam: "22334455667",
                ano: 2024,
                marca: "Ford",
                modelo: "Ranger XLT",
                categoriaVeiculoId: picape.id,
                cor: "Preto",
                portas: 4,
                motorizacao: "2.2 Diesel",
                tipoCombustivelId: diesel.id,
                unidadeId: manaus.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                kilometragem: 12000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: seminovo.id,
                updatedAt: new Date(),
            },
            {
                placa: "CDE7F89",
                renavam: "66778899001",
                ano: 2023,
                marca: "Fiat",
                modelo: "Pulse Abarth",
                categoriaVeiculoId: suv.id,
                cor: "Branco",
                portas: 4,
                motorizacao: "1.3 Turbo",
                tipoCombustivelId: flex.id,
                unidadeId: fortaleza.id,
                tipoTransmissaoId: automatic.id,
                tipoDirecaoId: electric.id,
                kilometragem: 10000,
                situacaoLicenciamentoId: regular.id,
                situacaoVeiculoId: available.id,
                estadoVeiculoId: seminovo.id,
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created vehicles");

    // Seed TipoCompra
    const tiposCompra = await prisma.tipoCompra.createMany({
        data: [
            { descricao: "COMPRA DIRETA" },
            { descricao: "ENTRADA" },
            { descricao: "CONSIGNAÇÃO" },
            { descricao: "LEILÃO" },
            { descricao: "PERMUTA" },
            { descricao: "TRANSFERÊNCIA ENTRE UNIDADES" },
            { descricao: "OUTROS" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${tiposCompra.count} tipos de compra`);

    // Seed SituacaoCompra
    const situacoesCompra = await prisma.situacaoCompra.createMany({
        data: [
            { descricao: "EM NEGOCIAÇÃO" },
            { descricao: "AGUARDANDO DOCUMENTAÇÃO" },
            { descricao: "AGUARDANDO ENTRADA" },
            { descricao: "EM VISTORIA" },
            { descricao: "EM RECONDICIONAMENTO" },
            { descricao: "CONCLUÍDA" },
            { descricao: "CANCELADA" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${situacoesCompra.count} situações de compra`);

    // Seed TipoVenda
    const tiposVenda = await prisma.tipoVenda.createMany({
        data: [
            { descricao: "À VISTA" },
            { descricao: "FINANCIAMENTO BANCÁRIO" },
            { descricao: "FINANCIAMENTO PRÓPRIO" },
            { descricao: "CONSÓRCIO" },
            { descricao: "PERMUTA" },
            { descricao: "LEASING" },
            { descricao: "OUTROS" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${tiposVenda.count} tipos de venda`);

    // Seed SituacaoVenda
    const situacoesVenda = await prisma.situacaoVenda.createMany({
        data: [
            { descricao: "EM NEGOCIAÇÃO" },
            { descricao: "AGUARDANDO DOCUMENTAÇÃO" },
            { descricao: "AGUARDANDO FINANCIAMENTO" },
            { descricao: "AGUARDANDO TRANSFERÊNCIA" },
            { descricao: "EM PREPARAÇÃO" },
            { descricao: "CONCLUÍDA" },
            { descricao: "CANCELADA" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${situacoesVenda.count} situações de venda`);

    // Get tipos e situações for compras e vendas
    const compraCompradireta = await prisma.tipoCompra.findUnique({
        where: { descricao: "COMPRA DIRETA" },
    });
    const compraEntrada = await prisma.tipoCompra.findUnique({
        where: { descricao: "ENTRADA" },
    });
    const compraPermuta = await prisma.tipoCompra.findUnique({
        where: { descricao: "PERMUTA" },
    });
    const compraConcluida = await prisma.situacaoCompra.findUnique({
        where: { descricao: "CONCLUÍDA" },
    });
    const compraEmRecondicionamento = await prisma.situacaoCompra.findUnique({
        where: { descricao: "EM RECONDICIONAMENTO" },
    });

    const vendaAVista = await prisma.tipoVenda.findUnique({
        where: { descricao: "À VISTA" },
    });
    const vendaFinanciamento = await prisma.tipoVenda.findUnique({
        where: { descricao: "FINANCIAMENTO BANCÁRIO" },
    });
    const vendaFinanciamentoProprio = await prisma.tipoVenda.findUnique({
        where: { descricao: "FINANCIAMENTO PRÓPRIO" },
    });
    const vendaPermuta = await prisma.tipoVenda.findUnique({
        where: { descricao: "PERMUTA" },
    });
    const vendaConcluida = await prisma.situacaoVenda.findUnique({
        where: { descricao: "CONCLUÍDA" },
    });
    const vendaEmNegociacao = await prisma.situacaoVenda.findUnique({
        where: { descricao: "EM NEGOCIAÇÃO" },
    });
    const vendaAguardandoFinanciamento = await prisma.situacaoVenda.findUnique({
        where: { descricao: "AGUARDANDO FINANCIAMENTO" },
    });

    // Get fornecedores
    const fornecedor1 = await prisma.fornecedor.findFirst({
        where: { razaoSocial: "Auto Peças Silva Ltda" },
    });
    const fornecedor2 = await prisma.fornecedor.findFirst({
        where: { razaoSocial: "João Carlos Veículos ME" },
    });
    const fornecedor3 = await prisma.fornecedor.findFirst({
        where: { razaoSocial: "Maria Santos Comércio" },
    });

    // Get veiculos
    const veiculo1 = await prisma.veiculo.findFirst({
        where: { placa: "ABC1D23" },
    });
    const veiculo2 = await prisma.veiculo.findFirst({
        where: { placa: "XYZ9F88" },
    });
    const veiculo3 = await prisma.veiculo.findFirst({
        where: { placa: "JKL4H56" },
    });
    const veiculo4 = await prisma.veiculo.findFirst({
        where: { placa: "MNO7P89" },
    });
    const veiculo5 = await prisma.veiculo.findFirst({
        where: { placa: "QRS1T23" },
    });
    const veiculo6 = await prisma.veiculo.findFirst({
        where: { placa: "UVW3X45" },
    });
    const veiculo7 = await prisma.veiculo.findFirst({
        where: { placa: "YZA5B67" },
    });
    const veiculo8 = await prisma.veiculo.findFirst({
        where: { placa: "CDE7F89" },
    });

    // Get usuarios (vendedores)
    const vendedor1 = await prisma.usuario.findFirst({
        where: { nomeUsuario: "carlos.silva" },
    });
    const vendedor2 = await prisma.usuario.findFirst({
        where: { nomeUsuario: "ana.santos" },
    });
    const vendedor3 = await prisma.usuario.findFirst({
        where: { nomeUsuario: "julia.costa" },
    });
    const vendedor4 = await prisma.usuario.findFirst({
        where: { nomeUsuario: "roberto.lima" },
    });

    // Seed CompraVeiculo
    await prisma.compraVeiculo.createMany({
        data: [
            {
                dataCompra: new Date("2024-11-01"),
                dataEntrega: new Date("2024-11-05"),
                custoAquisicao: 75000.0,
                custoOficina: 2500.0,
                custoEstetica: 1200.0,
                outrosCustos: 500.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 200.0,
                valorCompra: 79700.0,
                valorAvaliado: 95000.0,
                observacoes: "Veículo em bom estado, necessita revisão completa",
                fornecedorId: fornecedor1.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: fortaleza.id,
                veiculoId: veiculo1.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-10-15"),
                dataEntrega: new Date("2024-10-20"),
                custoAquisicao: 95000.0,
                custoOficina: 1800.0,
                custoEstetica: 900.0,
                outrosCustos: 300.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 150.0,
                valorCompra: 98450.0,
                valorAvaliado: 115000.0,
                observacoes: "Veículo seminovo, documentação em dia",
                fornecedorId: fornecedor2.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: fortaleza.id,
                veiculoId: veiculo2.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-09-20"),
                dataEntrega: new Date("2024-09-25"),
                custoAquisicao: 80000.0,
                custoOficina: 3000.0,
                custoEstetica: 1500.0,
                outrosCustos: 800.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 250.0,
                valorCompra: 85850.0,
                valorAvaliado: 105000.0,
                observacoes: "Entrada como parte de pagamento em venda",
                fornecedorId: fornecedor3.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraEntrada.id,
                unidadeId: manaus.id,
                veiculoId: veiculo3.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-11-10"),
                dataEntrega: null,
                custoAquisicao: 120000.0,
                custoOficina: 0.0,
                custoEstetica: 0.0,
                outrosCustos: 0.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 200.0,
                valorCompra: 120500.0,
                valorAvaliado: 145000.0,
                observacoes: "Veículo novo, aguardando preparação",
                fornecedorId: fornecedor1.id,
                situacaoCompraId: compraEmRecondicionamento.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: manaus.id,
                veiculoId: veiculo4.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-08-05"),
                dataEntrega: new Date("2024-08-12"),
                custoAquisicao: 55000.0,
                custoOficina: 4500.0,
                custoEstetica: 2000.0,
                outrosCustos: 1000.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 300.0,
                valorCompra: 63100.0,
                valorAvaliado: 78000.0,
                observacoes: "Veículo com alta quilometragem, recondicionado",
                fornecedorId: fornecedor2.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: fortaleza.id,
                veiculoId: veiculo5.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-09-10"),
                dataEntrega: new Date("2024-09-15"),
                custoAquisicao: 60000.0,
                custoOficina: 2200.0,
                custoEstetica: 1100.0,
                outrosCustos: 600.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 200.0,
                valorCompra: 64400.0,
                valorAvaliado: 78000.0,
                observacoes: "Compra de particular, veículo bem conservado",
                fornecedorId: fornecedor3.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: fortaleza.id,
                veiculoId: veiculo6.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-10-01"),
                dataEntrega: new Date("2024-10-08"),
                custoAquisicao: 110000.0,
                custoOficina: 1500.0,
                custoEstetica: 800.0,
                outrosCustos: 400.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 250.0,
                valorCompra: 113250.0,
                valorAvaliado: 135000.0,
                observacoes: "Veículo diesel, ideal para trabalho",
                fornecedorId: fornecedor1.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: manaus.id,
                veiculoId: veiculo7.id,
                updatedAt: new Date(),
            },
            {
                dataCompra: new Date("2024-09-25"),
                dataEntrega: new Date("2024-10-02"),
                custoAquisicao: 85000.0,
                custoOficina: 1800.0,
                custoEstetica: 1000.0,
                outrosCustos: 500.0,
                taxaTransferencia: 300.0,
                taxaLeilao: 0.0,
                outrasTaxas: 200.0,
                valorCompra: 88800.0,
                valorAvaliado: 108000.0,
                observacoes: "SUV esportivo, grande procura",
                fornecedorId: fornecedor2.id,
                situacaoCompraId: compraConcluida.id,
                tipoCompraId: compraCompradireta.id,
                unidadeId: fortaleza.id,
                veiculoId: veiculo8.id,
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created compras de veículos");

    // Get cliente Maria para uma venda
    const cliente3 = await prisma.cliente.findFirst({
        where: { nomeCompleto: "Maria Oliveira Costa" },
    });

    // Seed VendaVeiculo
    await prisma.vendaVeiculo.createMany({
        data: [
            {
                dataVenda: new Date("2024-11-20"),
                valorVenda: 98000.0,
                valorEntrada: 98000.0,
                valorFinanciado: 0.0,
                quantidadeParcelas: null,
                valorParcela: null,
                comissaoVendedor: 2940.0, // 3% do valor da venda
                observacoes: "Venda à vista com desconto",
                veiculoId: veiculo1.id,
                clienteId: cliente1.id,
                usuarioId: vendedor1.id,
                tipoVendaId: vendaAVista.id,
                situacaoVendaId: vendaConcluida.id,
                updatedAt: new Date(),
            },
            {
                dataVenda: new Date("2024-11-15"),
                valorVenda: 118000.0,
                valorEntrada: 30000.0,
                valorFinanciado: 88000.0,
                quantidadeParcelas: 48,
                valorParcela: 2450.0,
                comissaoVendedor: 3540.0, // 3% do valor da venda
                observacoes: "Financiamento aprovado banco Itaú",
                veiculoId: veiculo2.id,
                clienteId: cliente3.id,
                usuarioId: vendedor2.id,
                tipoVendaId: vendaFinanciamento.id,
                situacaoVendaId: vendaConcluida.id,
                updatedAt: new Date(),
            },
            {
                dataVenda: new Date("2024-10-25"),
                valorVenda: 108000.0,
                valorEntrada: 20000.0,
                valorFinanciado: 88000.0,
                quantidadeParcelas: 36,
                valorParcela: 3100.0,
                comissaoVendedor: 3240.0, // 3% do valor da venda
                observacoes: "Cliente entregou veículo usado como parte do pagamento",
                veiculoId: veiculo3.id,
                clienteId: cliente2.id,
                usuarioId: vendedor3.id,
                tipoVendaId: vendaFinanciamento.id,
                situacaoVendaId: vendaConcluida.id,
                updatedAt: new Date(),
            },
            {
                dataVenda: new Date("2024-11-25"),
                valorVenda: 80000.0,
                valorEntrada: 15000.0,
                valorFinanciado: 65000.0,
                quantidadeParcelas: 48,
                valorParcela: 1950.0,
                comissaoVendedor: 2400.0, // 3% do valor da venda
                observacoes: "Venda em negociação, aguardando aprovação do crédito",
                veiculoId: veiculo5.id,
                clienteId: cliente1.id,
                usuarioId: vendedor4.id,
                tipoVendaId: vendaFinanciamento.id,
                situacaoVendaId: vendaAguardandoFinanciamento.id,
                updatedAt: new Date(),
            },
            {
                dataVenda: new Date("2024-12-01"),
                valorVenda: 82000.0,
                valorEntrada: 12000.0,
                valorFinanciado: 70000.0,
                quantidadeParcelas: 60,
                valorParcela: 1850.0,
                comissaoVendedor: 2460.0, // 3% do valor da venda
                observacoes: "Financiamento próprio da loja",
                veiculoId: veiculo6.id,
                clienteId: cliente3.id,
                usuarioId: vendedor1.id,
                tipoVendaId: vendaFinanciamentoProprio.id,
                situacaoVendaId: vendaEmNegociacao.id,
                updatedAt: new Date(),
            },
            {
                dataVenda: new Date("2024-11-28"),
                valorVenda: 138000.0,
                valorEntrada: 50000.0,
                valorFinanciado: 88000.0,
                quantidadeParcelas: 48,
                valorParcela: 2680.0,
                comissaoVendedor: 4140.0, // 3% do valor da venda
                observacoes: "Cliente trocou picape usada por SUV nova",
                veiculoId: veiculo7.id,
                clienteId: cliente2.id,
                usuarioId: vendedor2.id,
                tipoVendaId: vendaPermuta.id,
                situacaoVendaId: vendaConcluida.id,
                updatedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    logger.info("Created vendas de veículos");

    // Seed Categorias de Atendimento
    const categoriasAtendimento = await prisma.categoriaAtendimento.createMany({
        data: [
            { descricao: "DÚVIDA" },
            { descricao: "RECLAMAÇÃO" },
            { descricao: "SUGESTÃO" },
            { descricao: "MANUTENÇÃO" },
            { descricao: "GARANTIA" },
            { descricao: "REVISÃO" },
            { descricao: "VENDA" },
            { descricao: "PÓS-VENDA" },
        ],
        skipDuplicates: true,
    });
    logger.info(
        `Created ${categoriasAtendimento.count} categorias de atendimento`
    );

    // Seed Prioridades de Atendimento
    const prioridadesAtendimento = await prisma.prioridadeAtendimento.createMany({
        data: [
            { descricao: "BAIXA" },
            { descricao: "NORMAL" },
            { descricao: "ALTA" },
            { descricao: "URGENTE" },
        ],
        skipDuplicates: true,
    });
    logger.info(
        `Created ${prioridadesAtendimento.count} prioridades de atendimento`
    );

    // Seed Situações de Atendimento
    const situacoesAtendimento = await prisma.situacaoAtendimento.createMany({
        data: [
            { descricao: "ABERTO" },
            { descricao: "EM ATENDIMENTO" },
            { descricao: "AGUARDANDO CLIENTE" },
            { descricao: "RESOLVIDO" },
            { descricao: "CANCELADO" },
        ],
        skipDuplicates: true,
    });
    logger.info(`Created ${situacoesAtendimento.count} situações de atendimento`);

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
