/**
 * Testes para rotas de autenticação
 * Endpoints: /api/usuarios/login e /api/usuarios/logout
 */

const request = require("supertest");
const app = require("../src/app");
const { cleanDatabase, seedBasicData, prisma } = require("./testUtils");

describe("Autenticação - /api/usuarios", () => {
  beforeEach(async () => {
    await cleanDatabase();
    await seedBasicData();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/usuarios/login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const response = await request(app).post("/api/usuarios/login").send({
        nomeUsuario: "admin",
        senha: "admin123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).toBeTruthy();
    });

    it("deve rejeitar login com senha incorreta", async () => {
      const response = await request(app).post("/api/usuarios/login").send({
        nomeUsuario: "admin",
        senha: "senhaerrada",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve rejeitar login com usuário inexistente", async () => {
      const response = await request(app).post("/api/usuarios/login").send({
        nomeUsuario: "usuarioinexistente",
        senha: "qualquersenha",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app).post("/api/usuarios/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/usuarios/logout", () => {
    it("deve fazer logout com sucesso", async () => {
      // Primeiro fazer login
      const loginResponse = await request(app)
        .post("/api/usuarios/login")
        .send({
          nomeUsuario: "admin",
          senha: "admin123",
        });

      const token = loginResponse.body.token;

      // Fazer logout
      const response = await request(app)
        .post("/api/usuarios/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });

    it("deve rejeitar logout sem token", async () => {
      const response = await request(app).post("/api/usuarios/logout");

      expect(response.status).toBe(401);
    });
  });
});
