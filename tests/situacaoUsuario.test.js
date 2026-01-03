/**
 * Testes para rotas de situação de usuário
 * Endpoints: /api/situacaoUsuario
 */
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const {
  cleanDatabase,
  getAuthToken,
  seedBasicData,
  prisma,
} = require("./testUtils");

describe("Situação de Usuário - /api/situacaoUsuario", () => {
  let token;
  let situacaoTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    await seedBasicData();
    
    token = await getAuthToken(app);
  });

  describe("POST /api/situacaoUsuario", () => {
    it("deve criar uma nova situação de usuário", async () => {
      const generoData = {
        descricao: "Nova Situação Teste",
      };

      const response = await request(app)
        .post("/api/situacaoUsuario")
        .set("Authorization", `Bearer ${token}`)
        .send(generoData);

      expect(response.status).toBe(201);
      expect(response.body.descricao).toBe("Nova Situação Teste");
      
      // Salvar a situação criada para usar nos demais testes
      situacaoTeste = response.body;
    });

    it("deve validar ausência de descricao", async () => {
      const response = await request(app)
        .post("/api/situacaoUsuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/situacaoUsuario", () => {
    it("deve listar todas as situações de usuário", async () => {
      const response = await request(app)
        .get("/api/situacaoUsuario")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/situacaoUsuario/:id", () => {
    it("deve buscar situação de usuário por ID", async () => {
      const response = await request(app)
        .get(`/api/situacaoUsuario/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(situacaoTeste.id);
      expect(response.body.descricao).toBe("Nova Situação Teste");
    });

    it("deve retornar 404 para situação inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoUsuario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/situacaoUsuario/descricao/exact/:descricao", () => {
    it("deve buscar situação por descrição exata", async () => {
      const response = await request(app)
        .get(`/api/situacaoUsuario/descricao/exact/${encodeURIComponent(situacaoTeste.descricao)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.descricao).toBe(situacaoTeste.descricao);
    });

    it("deve retornar 404 quando nenhuma situação for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoUsuario/descricao/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/situacaoUsuario/descricao/search/:descricao", () => {
    it("deve buscar situações por descrição parcial", async () => {
      const response = await request(app)
        .get(`/api/situacaoUsuario/descricao/search/${encodeURIComponent("Nova")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(g => g.descricao.includes("Nova"))).toBe(true);
    });

    it("deve retornar 404 quando nenhuma situação for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoUsuario/descricao/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/situacaoUsuario/:id", () => {
    it("deve atualizar uma situaçaõ existente", async () => {
      const response = await request(app)
        .put(`/api/situacaoUsuario/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Situação Teste Atualizada",
        });

      expect(response.status).toBe(200);
      expect(response.body.descricao).toBe("Situação Teste Atualizada");
      
      // Atualizar a referência local
      situacaoTeste = response.body;
    });

    it("deve retornar 404 ao atualizar situação inexistente", async () => {
      const response = await request(app)
        .put("/api/situacaoUsuario/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ descricao: "Teste" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/situacaoUsuario/:id", () => {
    it("deve retornar 404 ao excluir situação inexistente", async () => {
      const response = await request(app)
        .delete("/api/situacaoUsuario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("deve excluir uma situação existente", async () => {
      const response = await request(app)
        .delete(`/api/situacaoUsuario/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.situacaoUsuario.findUnique({
        where: { id: situacaoTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
