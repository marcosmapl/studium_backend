/**
 * Testes para rotas de Situações de Veículo
 * Endpoints: /api/situacoesVeiculo
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Situações de Veículo - /api/situacoesVeiculo", () => {
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

  it("deve listar todas as situações de veículo", async () => {
    const response = await request(app)
      .get("/api/situacoesVeiculo")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar uma nova situação de veículo", async () => {
    const response = await request(app)
      .post("/api/situacoesVeiculo")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "VENDIDO" });

    expect(response.status).toBe(201);
    expect(response.body.descricao).toBe("VENDIDO");
  });

  it("deve buscar situação de veículo por ID", async () => {
    const response = await request(app)
      .get(`/api/situacoesVeiculo/${seedData.situacaoVeiculo.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.situacaoVeiculo.id);
  });

  it("deve atualizar uma situação de veículo", async () => {
    const response = await request(app)
      .put(`/api/situacoesVeiculo/${seedData.situacaoVeiculo.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "EM MANUTENÇÃO" });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("EM MANUTENÇÃO");
  });

  it("deve retornar 404 para situação inexistente", async () => {
    const response = await request(app)
      .get("/api/situacoesVeiculo/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
