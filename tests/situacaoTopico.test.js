/**
 * Testes para rotas de situação de tópico
 * Endpoints: /api/situacaoTopico
 */
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const HttpStatus = require("../src/utils/httpStatus");
const {
  cleanDatabase,
  getAuthToken,
  seedBasicData,
  prisma,
} = require("./testUtils");

describe("Situação de Tópico - /api/situacaoTopico", () => {
  let token;
  let situacaoTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    await seedBasicData();
    
    token = await getAuthToken(app);
  });

  describe("POST /api/situacaoTopico", () => {
    it("deve criar uma nova situação de tópico", async () => {
      const situacaoData = {
        descricao: "Nova Situação Teste",
      };

      const response = await request(app)
        .post("/api/situacaoTopico")
        .set("Authorization", `Bearer ${token}`)
        .send(situacaoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.descricao).toBe("Nova Situação Teste");
      
      // Salvar a situação criada para usar nos demais testes
      situacaoTeste = response.body;
    });

    it("deve validar ausência de descricao", async () => {
      const response = await request(app)
        .post("/api/situacaoTopico")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/situacaoTopico", () => {
    it("deve listar todas as situações de tópico", async () => {
      const response = await request(app)
        .get("/api/situacaoTopico")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/situacaoTopico/:id", () => {
    it("deve buscar situação de tópico por ID", async () => {
      const response = await request(app)
        .get(`/api/situacaoTopico/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(situacaoTeste.id);
      expect(response.body.descricao).toBe("Nova Situação Teste");
    });

    it("deve retornar 404 para situação inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoTopico/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoTopico/descricao/exact/:descricao", () => {
    it("deve buscar situação de tópico por descrição exata", async () => {
      const response = await request(app)
        .get(`/api/situacaoTopico/descricao/exact/${encodeURIComponent(situacaoTeste.descricao)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
      expect(response.body.descricao).toBe(situacaoTeste.descricao);
    });

    it("deve retornar 404 quando nenhuma situação de tópico for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoTopico/descricao/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoTopico/descricao/search/:descricao", () => {
    it("deve buscar situações de tópico por descrição parcial", async () => {
      const response = await request(app)
        .get(`/api/situacaoTopico/descricao/search/${encodeURIComponent("Nova")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(g => g.descricao.includes("Nova"))).toBe(true);
    });

    it("deve retornar 404 quando nenhuma situação de tópico for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoTopico/descricao/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/situacaoTopico/:id", () => {
    it("deve atualizar uma situação de tópico existente", async () => {
      const response = await request(app)
        .put(`/api/situacaoTopico/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Situação Teste Atualizada",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Situação Teste Atualizada");
      
      // Atualizar a referência local
      situacaoTeste = response.body;
    });

    it("deve retornar 404 ao atualizar situação de tópico inexistente", async () => {
      const response = await request(app)
        .put("/api/situacaoTopico/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ descricao: "Teste" });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/situacaoTopico/:id", () => {
    it("deve retornar 404 ao excluir situação de tópico inexistente", async () => {
      const response = await request(app)
        .delete("/api/situacaoTopico/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma situação de tópico existente", async () => {
      const response = await request(app)
        .delete(`/api/situacaoTopico/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.situacaoTopico.findUnique({
        where: { id: situacaoTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
