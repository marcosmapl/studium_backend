/**
 * Testes para rotas de Grupos de Usuário
 * Endpoints: /api/gruposUsuario
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Grupos de Usuário - /api/gruposUsuario", () => {
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

  it("deve listar todos os grupos de usuário", async () => {
    const response = await request(app)
      .get("/api/gruposUsuario")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar um novo grupo de usuário", async () => {
    const response = await request(app)
      .post("/api/gruposUsuario")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Vendedores",
        descricao: "Equipe de vendas",
      });

    expect(response.status).toBe(201);
    expect(response.body.nome).toBe("Vendedores");
  });

  it("deve buscar grupo por ID", async () => {
    const response = await request(app)
      .get(`/api/gruposUsuario/${seedData.grupoAdmin.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedData.grupoAdmin.id);
  });

  it("deve atualizar um grupo", async () => {
    const response = await request(app)
      .put(`/api/gruposUsuario/${seedData.grupoAdmin.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "Descrição atualizada",
      });

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe("Descrição atualizada");
  });

  it("deve retornar 404 para grupo inexistente", async () => {
    const response = await request(app)
      .get("/api/gruposUsuario/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("deve validar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/api/gruposUsuario")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("deve rejeitar criação de grupo com nome duplicado", async () => {
    const response = await request(app)
      .post("/api/gruposUsuario")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Administradores", // Nome já existente
        descricao: "Teste duplicado",
      });

    expect(response.status).toBe(409);
  });
});
