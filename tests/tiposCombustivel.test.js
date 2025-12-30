/**
 * Testes para rotas de Tipos de Combustível
 * Endpoints: /api/tiposCombustivel
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Tipos de Combustível - /api/tiposCombustivel", () => {
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

  it("deve listar todos os tipos de combustível", async () => {
    const response = await request(app)
      .get("/api/tiposCombustivel")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar um novo tipo de combustível", async () => {
    const response = await request(app)
      .post("/api/tiposCombustivel")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "DIESEL" });

    expect(response.status).toBe(201);
    expect(response.body.descricao).toBe("DIESEL");
    expect(response.body.id).toBeDefined();
  });

  it("deve buscar tipo de combustível por ID", async () => {
    const response = await request(app)
      .get(`/api/tiposCombustivel/${seedData.tipoCombustivel.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.tipoCombustivel.id);
  });

  it("deve atualizar um tipo de combustível", async () => {
    const response = await request(app)
      .put(`/api/tiposCombustivel/${seedData.tipoCombustivel.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "FLEX ATUALIZADO" });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("FLEX ATUALIZADO");
  });

  it("deve retornar 404 para tipo de combustível inexistente", async () => {
    const response = await request(app)
      .get("/api/tiposCombustivel/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("deve validar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/api/tiposCombustivel")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("deve rejeitar criação com descrição duplicada", async () => {
    await request(app)
      .post("/api/tiposCombustivel")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "HÍBRIDO" });

    const response = await request(app)
      .post("/api/tiposCombustivel")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "HÍBRIDO" });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("existe");
  });



  it("deve excluir um tipo de combustível", async () => {
    const tipo = await prisma.tipoCombustivel.create({
      data: { descricao: "GNV" },
    });

    const response = await request(app)
      .delete(`/api/tiposCombustivel/${tipo.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const verificacao = await prisma.tipoCombustivel.findUnique({
      where: { id: tipo.id },
    });
    expect(verificacao).toBeNull();
  });

  it("deve rejeitar atualização com descrição duplicada", async () => {
    const tipo1 = await prisma.tipoCombustivel.create({
      data: { descricao: "TIPO1" },
    });

    const tipo2 = await prisma.tipoCombustivel.create({
      data: { descricao: "TIPO2" },
    });

    const response = await request(app)
      .put(`/api/tiposCombustivel/${tipo2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "TIPO1" });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("existe");
  });

  it("deve retornar 404 ao tentar atualizar tipo inexistente", async () => {
    const response = await request(app)
      .put("/api/tiposCombustivel/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "TESTE" });

    expect(response.status).toBe(404);
  });

  it("deve retornar 404 ao tentar excluir tipo inexistente", async () => {
    const response = await request(app)
      .delete("/api/tiposCombustivel/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("deve impedir exclusão de tipo com veículos associados", async () => {
    // Criar um tipo de combustível e um veículo associado
    const tipo = await prisma.tipoCombustivel.create({
      data: { descricao: "ELÉTRICO" },
    });

    await prisma.veiculo.create({
      data: {
        placa: "TEST123",
        renavam: "12345678901",
        ano: 2023,
        marca: "Tesla",
        modelo: "Model 3",
        cor: "Branco",
        portas: 4,
        motorizacao: "Elétrico",
        kilometragem: 0,
        categoriaVeiculoId: seedData.categoriaVeiculo.id,
        estadoVeiculoId: seedData.estadoVeiculo.id,
        situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
        situacaoVeiculoId: seedData.situacaoVeiculo.id,
        tipoCombustivelId: tipo.id,
        tipoDirecaoId: seedData.tipoDirecao.id,
        tipoTransmissaoId: seedData.tipoTransmissao.id,
        unidadeId: seedData.unidade.id,
      },
    });

    const response = await request(app)
      .delete(`/api/tiposCombustivel/${tipo.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("registros associados");
  });
});
