const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Vendas de Veículos - /api/vendasVeiculos", () => {
  let token;
  let seedData;
  let veiculoId;
  let clienteId;
  let usuarioId;
  let tipoVendaId;
  let situacaoVendaId;

  beforeEach(async () => {
    await cleanDatabase();
    seedData = await seedBasicData();
    token = await getAuthToken(app);
    usuarioId = seedData.usuario.id;

    // Criar dados auxiliares
    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: "Cliente Teste Venda",
        dataNascimento: new Date("1990-01-01"),
        cpf: `${Date.now()}`,
        sexo: "M",
        telefone1: "11999999999",
        email: `cliente_venda_${Date.now()}@test.com`,
        endereco: "Rua Teste, 123",
      },
    });
    clienteId = cliente.id;

    const veiculo = await prisma.veiculo.create({
      data: {
        placa: `VND${Date.now().toString().slice(-4)}`,
        renavam: `${Date.now()}`,
        ano: 2020,
        marca: "Toyota",
        modelo: "Corolla",
        cor: "Prata",
        portas: 4,
        motorizacao: "2.0",
        kilometragem: 30000,
        categoriaVeiculoId: seedData.categoriaVeiculo.id,
        estadoVeiculoId: seedData.estadoVeiculo.id,
        situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
        situacaoVeiculoId: seedData.situacaoVeiculo.id,
        tipoCombustivelId: seedData.tipoCombustivel.id,
        tipoDirecaoId: seedData.tipoDirecao.id,
        tipoTransmissaoId: seedData.tipoTransmissao.id,
        unidadeId: seedData.unidade.id,
      },
    });
    veiculoId = veiculo.id;

    const tipoVenda = await prisma.tipoVenda.create({
      data: {
        descricao: `À VISTA_${Date.now()}`,
      },
    });
    tipoVendaId = tipoVenda.id;

    const situacaoVenda = await prisma.situacaoVenda.create({
      data: {
        descricao: `CONCLUÍDA_${Date.now()}`,
      },
    });
    situacaoVendaId = situacaoVenda.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve criar uma nova venda de veículo com dados válidos", async () => {
    const response = await request(app)
      .post("/api/vendasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dataVenda: new Date().toISOString(),
        valorVenda: 50000.0,
        valorEntrada: 10000.0,
        valorFinanciado: 40000.0,
        quantidadeParcelas: 48,
        valorParcela: 833.33,
        comissaoVendedor: 2500.0,
        observacoes: "Venda teste",
        veiculoId,
        clienteId,
        usuarioId,
        tipoVendaId,
        situacaoVendaId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.veiculoId).toBe(veiculoId);
    expect(response.body.clienteId).toBe(clienteId);
    expect(response.body.usuarioId).toBe(usuarioId);
    expect(parseFloat(response.body.valorVenda)).toBe(50000.0);
  });

  it("deve validar campos obrigatórios", async () => {
    const response = await request(app)
      .post("/api/vendasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        valorVenda: 50000.0,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("missingFields");
  });

  it("deve rejeitar criação sem autenticação", async () => {
    const response = await request(app).post("/api/vendasVeiculos").send({
      dataVenda: new Date().toISOString(),
      valorVenda: 50000.0,
      veiculoId,
      clienteId,
      usuarioId,
      tipoVendaId,
      situacaoVendaId,
    });

    expect(response.status).toBe(401);
  });

  it("deve listar todas as vendas de veículos", async () => {
    const response = await request(app)
      .get("/api/vendasVeiculos?limit=0&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve retornar vendas com limit e offset", async () => {
    const response = await request(app)
      .get("/api/vendasVeiculos?limit=0&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve buscar uma venda de veículo por ID", async () => {
    const venda = await prisma.vendaVeiculo.create({
      data: {
        dataVenda: new Date(),
        valorVenda: 45000.0,
        valorEntrada: 15000.0,
        valorFinanciado: 30000.0,
        veiculoId,
        clienteId,
        usuarioId,
        tipoVendaId,
        situacaoVendaId,
      },
    });

    const response = await request(app)
      .get(`/api/vendasVeiculos/${venda.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(venda.id);
    expect(response.body).toHaveProperty("veiculo");
    expect(response.body).toHaveProperty("cliente");
    expect(response.body).toHaveProperty("usuario");
  });

  it("deve retornar 404 para venda inexistente", async () => {
    const response = await request(app)
      .get("/api/vendasVeiculos/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("deve atualizar uma venda existente", async () => {
    const venda = await prisma.vendaVeiculo.create({
      data: {
        dataVenda: new Date(),
        valorVenda: 40000.0,
        veiculoId,
        clienteId,
        usuarioId,
        tipoVendaId,
        situacaoVendaId,
      },
    });

    const response = await request(app)
      .put(`/api/vendasVeiculos/${venda.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        valorVenda: 42000.0,
        comissaoVendedor: 2100.0,
        observacoes: "Valor atualizado após negociação",
      });

    expect(response.status).toBe(200);
    expect(parseFloat(response.body.valorVenda)).toBe(42000.0);
    expect(parseFloat(response.body.comissaoVendedor)).toBe(2100.0);
  });

  it("deve retornar 404 ao atualizar venda inexistente", async () => {
    const response = await request(app)
      .put("/api/vendasVeiculos/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        valorVenda: 42000.0,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("deve excluir uma venda existente", async () => {
    const venda = await prisma.vendaVeiculo.create({
      data: {
        dataVenda: new Date(),
        valorVenda: 35000.0,
        veiculoId,
        clienteId,
        usuarioId,
        tipoVendaId,
        situacaoVendaId,
      },
    });

    const response = await request(app)
      .delete(`/api/vendasVeiculos/${venda.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const verificacao = await prisma.vendaVeiculo.findUnique({
      where: { id: venda.id },
    });
    expect(verificacao).toBeNull();
  });

  it("deve retornar 404 ao excluir venda inexistente", async () => {
    const response = await request(app)
      .delete("/api/vendasVeiculos/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("deve validar IDs inválidos na criação", async () => {
    const response = await request(app)
      .post("/api/vendasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dataVenda: new Date().toISOString(),
        valorVenda: 50000.0,
        veiculoId: "abc",
        clienteId,
        usuarioId,
        tipoVendaId,
        situacaoVendaId,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve rejeitar venda com referência inválida", async () => {
    const response = await request(app)
      .post("/api/vendasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dataVenda: new Date().toISOString(),
        valorVenda: 50000.0,
        veiculoId: 999999,
        clienteId,
        usuarioId,
        tipoVendaId,
        situacaoVendaId,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
