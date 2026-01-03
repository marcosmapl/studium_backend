/**
 * Testes para rotas de autenticação
 * Endpoints: /api/login e /api/logout
 */

const request = require("supertest");
const app = require("../src/app");
const { cleanDatabase, seedBasicData, prisma } = require("./testUtils");

describe("Autenticação - /api", () => {
  beforeEach(async () => {
    await cleanDatabase();
    await seedBasicData();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const response = await request(app).post("/api/login").send({
        username: "teste",
        password: "teste123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).toBeTruthy();
    });

    it("deve rejeitar login com senha incorreta", async () => {
      const response = await request(app).post("/api/login").send({
        username: "admin",
        password: "senhaerrada",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve rejeitar login com usuário inexistente", async () => {
      const response = await request(app).post("/api/login").send({
        username: "usuarioinexistente",
        password: "qualquersenha",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app).post("/api/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/logout", () => {
    it("deve fazer logout com sucesso", async () => {
      // Primeiro fazer login
      const loginResponse = await request(app)
        .post("/api/login")
        .send({
          username: "admin",
          password: "admin123",
        });

      const token = loginResponse.body.token;

      // Fazer logout
      const response = await request(app)
        .post("/api/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });

    it("deve rejeitar logout sem token", async () => {
      const response = await request(app).post("/api/logout");

      expect(response.status).toBe(401);
    });
  });
});
