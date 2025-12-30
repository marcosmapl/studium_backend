const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Tipos de Venda - /api/tiposVenda", () => {
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

  it("deve listar todos os tipos de venda", async () => {
    const response = await request(app)
      .get("/api/tiposVenda")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar um novo tipo de venda", async () => {
    const response = await request(app)
      .post("/api/tiposVenda")
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "À VISTA",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.descricao).toBe("À VISTA");
  });

  it("deve buscar tipo de venda por ID", async () => {
    const tipoVenda = await prisma.tipoVenda.create({
      data: {
        descricao: `FINANCIADO_${Date.now()}`,
      },
    });

    const response = await request(app)
      .get(`/api/tiposVenda/${tipoVenda.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(tipoVenda.id);
    expect(response.body.descricao).toBe(tipoVenda.descricao);
  });

  it("deve atualizar um tipo de venda", async () => {
    const tipoVenda = await prisma.tipoVenda.create({
      data: {
        descricao: `CONSÓRCIO_${Date.now()}`,
      },
    });

    const response = await request(app)
      .put(`/api/tiposVenda/${tipoVenda.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "CONSÓRCIO CONTEMPLADO",
      });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("CONSÓRCIO CONTEMPLADO");
  });

  it("deve retornar 404 para tipo de venda inexistente", async () => {
    const response = await request(app)
      .get("/api/tiposVenda/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("deve validar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/api/tiposVenda")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve rejeitar criação com descrição duplicada", async () => {
    const descricao = `TIPO_DUPLICADO_${Date.now()}`;

    await prisma.tipoVenda.create({
      data: { descricao },
    });

    const response = await request(app)
      .post("/api/tiposVenda")
      .set("Authorization", `Bearer ${token}`)
      .send({ descricao });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
  });

  it("deve excluir um tipo de venda", async () => {
    const tipoVenda = await prisma.tipoVenda.create({
      data: {
        descricao: `TIPO_DELETE_${Date.now()}`,
      },
    });

    const response = await request(app)
      .delete(`/api/tiposVenda/${tipoVenda.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const verificacao = await prisma.tipoVenda.findUnique({
      where: { id: tipoVenda.id },
    });
    expect(verificacao).toBeNull();
  });

  it("deve retornar 404 ao excluir tipo de venda inexistente", async () => {
    const response = await request(app)
      .delete("/api/tiposVenda/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
