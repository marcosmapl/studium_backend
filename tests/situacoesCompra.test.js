/**
 * Testes para rotas de Situações de Compra
 * Endpoints: /api/situacoesCompra
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Situações de Compra - /api/situacoesCompra", () => {
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

  it("deve listar todas as situações de compra", async () => {
    const response = await request(app)
      .get("/api/situacoesCompra")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("deve criar uma nova situação de compra", async () => {
    const response = await request(app)
      .post("/api/situacoesCompra")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "EM ANDAMENTO" });

    expect(response.status).toBe(201);
    expect(response.body.descricao).toBe("EM ANDAMENTO");
  });

  it("deve buscar situação de compra por ID", async () => {
    const response = await request(app)
      .get(`/api/situacoesCompra/${seedData.situacaoCompra.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.situacaoCompra.id);
  });

  it("deve atualizar uma situação de compra", async () => {
    const response = await request(app)
      .put(`/api/situacoesCompra/${seedData.situacaoCompra.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "FINALIZADA" });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("FINALIZADA");
  });

  it("deve retornar 404 para situação de compra inexistente", async () => {
    const response = await request(app)
      .get("/api/situacoesCompra/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("deve rejeitar criação com descrição duplicada", async () => {
    await request(app)
      .post("/api/situacoesCompra")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "PENDENTE" });

    const response = await request(app)
      .post("/api/situacoesCompra")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "PENDENTE" });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("existe");
  });

  it("deve rejeitar criação sem descrição", async () => {
    const response = await request(app)
      .post("/api/situacoesCompra")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("missingFields");
    expect(response.body.missingFields).toContain("descricao");
  });

  it("deve buscar situação de compra por descrição", async () => {
    const situacao = await prisma.situacaoCompra.create({
      data: { descricao: "APROVADA" },
    });

    const response = await request(app)
      .get(`/api/situacoesCompra/descricao/${situacao.descricao}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("APROVADA");
  });

  it("deve excluir uma situação de compra", async () => {
    const situacao = await prisma.situacaoCompra.create({
      data: { descricao: "CANCELADA" },
    });

    const response = await request(app)
      .delete(`/api/situacoesCompra/${situacao.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const verificacao = await prisma.situacaoCompra.findUnique({
      where: { id: situacao.id },
    });
    expect(verificacao).toBeNull();
  });

  it("deve rejeitar atualização com descrição duplicada", async () => {
    const situacao1 = await prisma.situacaoCompra.create({
      data: { descricao: "STATUS1" },
    });

    const situacao2 = await prisma.situacaoCompra.create({
      data: { descricao: "STATUS2" },
    });

    const response = await request(app)
      .put(`/api/situacoesCompra/${situacao2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "STATUS1" });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("existe");
  });



  it("deve retornar 404 ao tentar atualizar situação inexistente", async () => {
    const response = await request(app)
      .put("/api/situacoesCompra/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao: "TESTE" });

    expect(response.status).toBe(404);
  });

  it("deve retornar 404 ao tentar excluir situação inexistente", async () => {
    const response = await request(app)
      .delete("/api/situacoesCompra/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
