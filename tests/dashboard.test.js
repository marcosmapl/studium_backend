/**
 * Testes para rotas de dashboard
 * Endpoints: /api/dashboard
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Dashboard - /api/dashboard", () => {
  let token;
  let seedData;

  beforeEach(async () => {
    await cleanDatabase();
    seedData = await seedBasicData();
    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/dashboard/kpis", () => {
    let estadoSeminovo;

    beforeEach(async () => {
      // Criar estado SEMINOVO para os testes
      estadoSeminovo = await prisma.estadoVeiculo.create({
        data: { descricao: "SEMINOVO" },
      });

      // Criar alguns veículos de teste com diferentes estados
      await prisma.veiculo.createMany({
        data: [
          {
            placa: "KPI1111",
            renavam: "11111111111",
            ano: 2023,
            marca: "Toyota",
            modelo: "Corolla",
            categoriaVeiculoId: seedData.categoriaVeiculo.id,
            cor: "Prata",
            portas: 4,
            motorizacao: "2.0",
            tipoCombustivelId: seedData.tipoCombustivel.id,
            unidadeId: seedData.unidade.id,
            tipoTransmissaoId: seedData.tipoTransmissao.id,
            tipoDirecaoId: seedData.tipoDirecao.id,
            kilometragem: 15000,
            situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
            situacaoVeiculoId: seedData.situacaoVeiculo.id,
            estadoVeiculoId: estadoSeminovo.id, // SEMINOVO
          },
          {
            placa: "KPI2222",
            renavam: "22222222222",
            ano: 2024,
            marca: "Honda",
            modelo: "Civic",
            categoriaVeiculoId: seedData.categoriaVeiculo.id,
            cor: "Preto",
            portas: 4,
            motorizacao: "1.5",
            tipoCombustivelId: seedData.tipoCombustivel.id,
            unidadeId: seedData.unidade.id,
            tipoTransmissaoId: seedData.tipoTransmissao.id,
            tipoDirecaoId: seedData.tipoDirecao.id,
            kilometragem: 5000,
            situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
            situacaoVeiculoId: seedData.situacaoVeiculo.id,
            estadoVeiculoId: estadoSeminovo.id, // SEMINOVO
          },
        ],
      });
    });

    it("deve retornar KPIs sem filtros (mês atual)", async () => {
      const response = await request(app)
        .get("/api/dashboard/kpis")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("totalVeiculos");
      expect(response.body).toHaveProperty("quantidadeSeminovos");
      expect(response.body).toHaveProperty("quantidadeVendasMes");
      expect(response.body).toHaveProperty("faturamentoMes");
      expect(response.body).toHaveProperty("periodo");
      expect(response.body.periodo).toHaveProperty("dataInicial");
      expect(response.body.periodo).toHaveProperty("dataFinal");

      // Verificar que temos pelo menos 2 veículos seminovos criados
      expect(response.body.totalVeiculos).toBeGreaterThanOrEqual(2);
      expect(response.body.quantidadeSeminovos).toBeGreaterThanOrEqual(2);
    });

    it("deve retornar KPIs com período específico", async () => {
      // Criar uma venda no período
      const veiculo = await prisma.veiculo.findFirst({
        where: { placa: "KPI1111" },
      });

      const cliente = await prisma.cliente.create({
        data: {
          nomeCompleto: "Cliente KPI Teste",
          dataNascimento: new Date("1990-01-01"),
          cpf: "99999999999",
          sexo: "M",
          telefone1: "+5585999999999",
          email: "cliente.kpi@test.com",
          endereco: "Rua Teste",
          cidade: "Fortaleza",
          uf: "CE",
          cep: "60000000",
        },
      });

      const tipoVenda = await prisma.tipoVenda.create({
        data: { descricao: "À VISTA TESTE KPI" },
      });

      const situacaoVenda = await prisma.situacaoVenda.create({
        data: { descricao: "CONCLUÍDA TESTE KPI" },
      });

      const usuario = await prisma.usuario.findFirst();

      await prisma.vendaVeiculo.create({
        data: {
          dataVenda: new Date("2024-11-15"),
          valorVenda: 50000.0,
          valorEntrada: 50000.0,
          valorFinanciado: 0.0,
          comissaoVendedor: 1500.0,
          veiculoId: veiculo.id,
          clienteId: cliente.id,
          usuarioId: usuario.id,
          tipoVendaId: tipoVenda.id,
          situacaoVendaId: situacaoVenda.id,
        },
      });

      const response = await request(app)
        .get("/api/dashboard/kpis?dataInicial=2024-11-01&dataFinal=2024-11-30")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.periodo.dataInicial).toBe("2024-11-01");
      expect(response.body.periodo.dataFinal).toBe("2024-11-30");
      expect(response.body.quantidadeVendasMes).toBeGreaterThanOrEqual(1);
      expect(response.body.faturamentoMes).toBeGreaterThanOrEqual(50000.0);
    });

    it("deve retornar KPIs filtrados por unidade", async () => {
      // Criar segunda unidade
      const unidade2 = await prisma.unidade.create({
        data: {
          nome: "Unidade Teste 2",
          endereco: "Rua Teste 2",
          cidade: "Manaus",
          uf: "AM",
          cep: "69000000",
          telefone1: "+5592999999999",
          telefone2: "+5592988888888",
        },
      });

      // Criar veículo na segunda unidade
      await prisma.veiculo.create({
        data: {
          placa: "KPI3333",
          renavam: "33333333333",
          ano: 2023,
          marca: "Ford",
          modelo: "Ranger",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Branco",
          portas: 4,
          motorizacao: "3.2",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: unidade2.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 30000,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: estadoSeminovo.id,
        },
      });

      const response = await request(app)
        .get(`/api/dashboard/kpis?unidadeId=${seedData.unidade.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("unidade");
      expect(response.body.unidade.id).toBe(seedData.unidade.id);
      expect(response.body.unidade.nome).toBeDefined();
      // Deve ter 2 veículos da unidade principal
      expect(response.body.totalVeiculos).toBeGreaterThanOrEqual(2);
    });

    it("deve retornar erro 400 com data inicial inválida", async () => {
      const response = await request(app)
        .get("/api/dashboard/kpis?dataInicial=invalid&dataFinal=2024-12-31")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Datas inválidas");
    });

    it("deve retornar erro 400 quando data inicial > data final", async () => {
      const response = await request(app)
        .get("/api/dashboard/kpis?dataInicial=2024-12-31&dataFinal=2024-01-01")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("data inicial não pode ser maior");
    });

    it("deve retornar erro 400 com unidadeId inválido", async () => {
      const response = await request(app)
        .get("/api/dashboard/kpis?unidadeId=abc")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("unidadeId");
    });

    it("deve retornar erro 404 com unidadeId inexistente", async () => {
      const response = await request(app)
        .get("/api/dashboard/kpis?unidadeId=99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("Unidade não encontrada");
    });

    it("deve retornar erro 401 sem autenticação", async () => {
      const response = await request(app).get("/api/dashboard/kpis");

      expect(response.status).toBe(401);
    });

    it("deve calcular faturamento zero quando não há vendas", async () => {
      const response = await request(app)
        .get("/api/dashboard/kpis?dataInicial=2020-01-01&dataFinal=2020-01-31")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.quantidadeVendasMes).toBe(0);
      expect(response.body.faturamentoMes).toBe(0);
    });
  });
});
