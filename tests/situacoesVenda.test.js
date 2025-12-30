const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Situações de Venda - /api/situacoesVenda", () => {
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

  it("deve listar todas as situações de venda", async () => {
    const response = await request(app)
      .get("/api/situacoesVenda")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar uma nova situação de venda", async () => {
    const response = await request(app)
      .post("/api/situacoesVenda")
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "PENDENTE",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.descricao).toBe("PENDENTE");
  });

  it("deve buscar situação de venda por ID", async () => {
    const situacaoVenda = await prisma.situacaoVenda.create({
      data: {
        descricao: `CONCLUÍDA_${Date.now()}`,
      },
    });

    const response = await request(app)
      .get(`/api/situacoesVenda/${situacaoVenda.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(situacaoVenda.id);
    expect(response.body.descricao).toBe(situacaoVenda.descricao);
  });

  it("deve atualizar uma situação de venda", async () => {
    const situacaoVenda = await prisma.situacaoVenda.create({
      data: {
        descricao: `CANCELADA_${Date.now()}`,
      },
    });

    const response = await request(app)
      .put(`/api/situacoesVenda/${situacaoVenda.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "CANCELADA PELO CLIENTE",
      });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("CANCELADA PELO CLIENTE");
  });

  it("deve retornar 404 para situação de venda inexistente", async () => {
    const response = await request(app)
      .get("/api/situacoesVenda/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("deve validar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/api/situacoesVenda")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve rejeitar criação com descrição duplicada", async () => {
    const descricao = `SITUACAO_DUPLICADA_${Date.now()}`;

    await prisma.situacaoVenda.create({
      data: { descricao },
    });

    const response = await request(app)
      .post("/api/situacoesVenda")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
  });

  it("deve excluir uma situação de venda", async () => {
    const situacaoVenda = await prisma.situacaoVenda.create({
      data: {
        descricao: `SITUACAO_DELETE_${Date.now()}`,
      },
    });

    const response = await request(app)
      .delete(`/api/situacoesVenda/${situacaoVenda.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const verificacao = await prisma.situacaoVenda.findUnique({
      where: { id: situacaoVenda.id },
    });
    expect(verificacao).toBeNull();
  });

  it("deve retornar 404 ao excluir situação de venda inexistente", async () => {
    const response = await request(app)
      .delete("/api/situacoesVenda/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
