/**
 * Testes para rotas de situação de plano de estudo
 * Endpoints: /api/situacaoPlano
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

describe("Situação de Plano de Estudo - /api/situacaoPlano", () => {
  let token;
  let situacaoTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    await seedBasicData();
    
    token = await getAuthToken(app);
  });

  describe("POST /api/situacaoPlano", () => {
    it("deve criar uma nova situação de plano de estudo", async () => {
      const situacaoData = {
        descricao: "Nova Situação Teste",
      };

      const response = await request(app)
        .post("/api/situacaoPlano")
        .set("Authorization", `Bearer ${token}`)
        .send(situacaoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.descricao).toBe("Nova Situação Teste");
      
      // Salvar a situação criada para usar nos demais testes
      situacaoTeste = response.body;
    });

    it("deve validar ausência de descricao", async () => {
      const response = await request(app)
        .post("/api/situacaoPlano")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/situacaoPlano", () => {
    it("deve listar todas as situações de plano de estudo", async () => {
      const response = await request(app)
        .get("/api/situacaoPlano")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/situacaoPlano/:id", () => {
    it("deve buscar situação de plano de estudo por ID", async () => {
      const response = await request(app)
        .get(`/api/situacaoPlano/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(situacaoTeste.id);
      expect(response.body.descricao).toBe("Nova Situação Teste");
    });

    it("deve retornar 404 para situação inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoPlano/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoPlano/descricao/exact/:descricao", () => {
    it("deve buscar situação de plano de estudo por descrição exata", async () => {
      const response = await request(app)
        .get(`/api/situacaoPlano/descricao/exact/${encodeURIComponent(situacaoTeste.descricao)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
      expect(response.body.descricao).toBe(situacaoTeste.descricao);
    });

    it("deve retornar 404 quando nenhuma situação de plano de estudo for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoPlano/descricao/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoPlano/descricao/search/:descricao", () => {
    it("deve buscar situações de plano de estudo por descrição parcial", async () => {
      const response = await request(app)
        .get(`/api/situacaoPlano/descricao/search/${encodeURIComponent("Nova")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(g => g.descricao.includes("Nova"))).toBe(true);
    });

    it("deve retornar 404 quando nenhuma situação de plano de estudo for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoPlano/descricao/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/situacaoPlano/:id", () => {
    it("deve atualizar uma situação de plano de estudo existente", async () => {
      const response = await request(app)
        .put(`/api/situacaoPlano/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Situação Teste Atualizada",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Situação Teste Atualizada");
      
      // Atualizar a referência local
      situacaoTeste = response.body;
    });

    it("deve retornar 404 ao atualizar situação de plano de estudo inexistente", async () => {
      const response = await request(app)
        .put("/api/situacaoPlano/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ descricao: "Teste" });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/situacaoPlano/:id", () => {
    it("deve retornar 404 ao excluir situação de plano de estudo inexistente", async () => {
      const response = await request(app)
        .delete("/api/situacaoPlano/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma situação de plano de estudo existente", async () => {
      const response = await request(app)
        .delete(`/api/situacaoPlano/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.situacaoPlano.findUnique({
        where: { id: situacaoTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
