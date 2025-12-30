/**
 * Testes para rotas de Situações de Licenciamento
 * Endpoints: /api/situacoesLicenciamento
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Situações de Licenciamento - /api/situacoesLicenciamento", () => {
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

  it("deve listar todas as situações de licenciamento", async () => {
    const response = await request(app)
      .get("/api/situacoesLicenciamento")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar uma nova situação de licenciamento", async () => {
    const response = await request(app)
      .post("/api/situacoesLicenciamento")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "PENDENTE" });

    expect(response.status).toBe(201);
    expect(response.body.descricao).toBe("PENDENTE");
  });

  it("deve buscar situação de licenciamento por ID", async () => {
    const response = await request(app)
      .get(`/api/situacoesLicenciamento/${seedData.situacaoLicenciamento.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.situacaoLicenciamento.id);
  });

  it("deve atualizar uma situação de licenciamento", async () => {
    const response = await request(app)
      .put(`/api/situacoesLicenciamento/${seedData.situacaoLicenciamento.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "REGULAR ATUALIZADO" });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("REGULAR ATUALIZADO");
  });

  it("deve retornar 404 para situação inexistente", async () => {
    const response = await request(app)
      .get("/api/situacoesLicenciamento/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
