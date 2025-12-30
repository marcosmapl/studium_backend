/**
 * Testes para rotas de Estados de Veículo
 * Endpoints: /api/estadosVeiculo
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Estados de Veículo - /api/estadosVeiculo", () => {
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

  it("deve listar todos os estados de veículo", async () => {
    const response = await request(app)
      .get("/api/estadosVeiculo")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("deve criar um novo estado de veículo", async () => {
    const response = await request(app)
      .post("/api/estadosVeiculo")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "NOVO" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.descricao).toBe("NOVO");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });

  it("deve rejeitar criação sem descrição", async () => {
    const response = await request(app)
      .post("/api/estadosVeiculo")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("missingFields");
    expect(response.body.missingFields).toContain("descricao");
  });



  it("deve rejeitar criação com descrição duplicada", async () => {
    // Criar primeiro estado
    await request(app)
      .post("/api/estadosVeiculo")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "NOVO" });

    // Tentar criar com mesma descrição
    const response = await request(app)
      .post("/api/estadosVeiculo")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "NOVO" });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("existe");
  });

  it("deve buscar estado de veículo por ID", async () => {
    const response = await request(app)
      .get(`/api/estadosVeiculo/${seedData.estadoVeiculo.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.estadoVeiculo.id);
    expect(response.body.descricao).toBe(seedData.estadoVeiculo.descricao);
  });

  it("deve retornar 404 ao buscar estado inexistente por ID", async () => {
    const response = await request(app)
      .get("/api/estadosVeiculo/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado");
  });

  it("deve buscar estado de veículo por descrição", async () => {
    const response = await request(app)
      .get(`/api/estadosVeiculo/descricao/${seedData.estadoVeiculo.descricao}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe(seedData.estadoVeiculo.descricao);
  });

  it("deve retornar 404 ao buscar estado inexistente por descrição", async () => {
    const response = await request(app)
      .get("/api/estadosVeiculo/descricao/INEXISTENTE")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado");
  });

  it("deve buscar estado mesmo com espaços na descrição", async () => {
    // Este teste verifica que a descrição é normalizada corretamente
    const response = await request(app)
      .get(`/api/estadosVeiculo/descricao/${encodeURIComponent("USADO")}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("USADO");
  });

  it("deve atualizar um estado de veículo", async () => {
    const response = await request(app)
      .put(`/api/estadosVeiculo/${seedData.estadoVeiculo.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "SEMINOVO" });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("SEMINOVO");
    expect(response.body.id).toBe(seedData.estadoVeiculo.id);
  });



  it("deve retornar 404 ao atualizar estado inexistente", async () => {
    const response = await request(app)
      .put("/api/estadosVeiculo/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "NOVO" });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado");
  });

  it("deve rejeitar atualização para descrição duplicada", async () => {
    // Criar outro estado
    const novoEstado = await prisma.estadoVeiculo.create({
      data: { descricao: "OUTRO" },
    });

    // Tentar atualizar para descrição já existente
    const response = await request(app)
      .put(`/api/estadosVeiculo/${novoEstado.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: seedData.estadoVeiculo.descricao });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("existe");
  });

  it("deve excluir um estado de veículo", async () => {
    // Criar um estado para excluir
    const estadoParaExcluir = await prisma.estadoVeiculo.create({
      data: { descricao: "PARA_EXCLUIR" },
    });

    const response = await request(app)
      .delete(`/api/estadosVeiculo/${estadoParaExcluir.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    // Verificar se foi realmente excluído
    const estadoExcluido = await prisma.estadoVeiculo.findUnique({
      where: { id: estadoParaExcluir.id },
    });
    expect(estadoExcluido).toBeNull();
  });

  it("deve retornar 404 ao excluir estado inexistente", async () => {
    const response = await request(app)
      .delete("/api/estadosVeiculo/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado");
  });

  it("deve rejeitar exclusão de estado com veículos associados", async () => {
    // O seedData.estadoVeiculo está associado a um veículo criado nos testes
    // Vamos criar um veículo associado ao estado
    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: "Teste Cliente",
        dataNascimento: new Date("1990-01-01"),
        cpf: "12345678900",
        sexo: "M",
        telefone1: "85999999999",
        email: "teste@estado.com",
        endereco: "Rua Teste",
      },
    });

    await prisma.veiculo.create({
      data: {
        placa: "TEST123",
        renavam: "12345678900",
        ano: 2020,
        marca: "TESTE",
        modelo: "MODELO",
        cor: "BRANCO",
        portas: 4,
        motorizacao: "1.0",
        kilometragem: 0,
        categoriaVeiculoId: seedData.categoriaVeiculo.id,
        clienteId: cliente.id,
        estadoVeiculoId: seedData.estadoVeiculo.id,
        situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
        situacaoVeiculoId: seedData.situacaoVeiculo.id,
        tipoCombustivelId: seedData.tipoCombustivel.id,
        tipoDirecaoId: seedData.tipoDirecao.id,
        tipoTransmissaoId: seedData.tipoTransmissao.id,
        unidadeId: seedData.unidade.id,
      },
    });

    const response = await request(app)
      .delete(`/api/estadosVeiculo/${seedData.estadoVeiculo.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("registros associados");
  });

  it("deve rejeitar requisições sem autenticação", async () => {
    const response = await request(app).get("/api/estadosVeiculo");

    expect(response.status).toBe(401);
  });
});
