/**
 * Testes para rotas de Tipos de Transmissão
 * Endpoints: /api/tiposTransmissao
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Tipos de Transmissão - /api/tiposTransmissao", () => {
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

  it("deve listar todos os tipos de transmissão", async () => {
    const response = await request(app)
      .get("/api/tiposTransmissao")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar um novo tipo de transmissão", async () => {
    const response = await request(app)
      .post("/api/tiposTransmissao")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "MANUAL" });

    expect(response.status).toBe(201);
    expect(response.body.descricao).toBe("MANUAL");
  });

  it("deve buscar tipo de transmissão por ID", async () => {
    const response = await request(app)
      .get(`/api/tiposTransmissao/${seedData.tipoTransmissao.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.tipoTransmissao.id);
  });

  it("deve atualizar um tipo de transmissão", async () => {
    const response = await request(app)
      .put(`/api/tiposTransmissao/${seedData.tipoTransmissao.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "AUTOMÁTICA CVT" });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("AUTOMÁTICA CVT");
  });

  it("deve retornar 404 para tipo de transmissão inexistente", async () => {
    const response = await request(app)
      .get("/api/tiposTransmissao/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
