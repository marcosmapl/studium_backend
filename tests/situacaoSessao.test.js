/**
 * Testes para rotas de situação de sessão
 * Endpoints: /api/situacaoSessao
 */
const request = require("supertest");
const app = require("../src/app");
const HttpStatus = require("../src/utils/httpStatus");
const {
  cleanDatabase,
  getAuthToken,
  seedBasicData,
  prisma,
} = require("./testUtils");

describe("Situação de Sessão - /api/situacaoSessao", () => {
  let token;
  let situacaoTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    await seedBasicData();
    
    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/situacaoSessao", () => {
    it("deve criar uma nova situação de sessão", async () => {
      const situacaoData = {
        descricao: "Planejada",
      };

      const response = await request(app)
        .post("/api/situacaoSessao")
        .set("Authorization", `Bearer ${token}`)
        .send(situacaoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.descricao).toBe("Planejada");
      
      // Salvar a situação criada para usar nos demais testes
      situacaoTeste = response.body;
    });

    it("deve validar ausência de descricao", async () => {
      const response = await request(app)
        .post("/api/situacaoSessao")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/situacaoSessao", () => {
    it("deve listar todas as situações de sessão", async () => {
      const response = await request(app)
        .get("/api/situacaoSessao")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/situacaoSessao/:id", () => {
    it("deve buscar situação de sessão por ID", async () => {
      const response = await request(app)
        .get(`/api/situacaoSessao/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(situacaoTeste.id);
      expect(response.body.descricao).toBe("Planejada");
    });

    it("deve retornar 404 para situação inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoSessao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoSessao/descricao/exact/:descricao", () => {
    it("deve buscar situação de sessão por descrição exata", async () => {
      const response = await request(app)
        .get(`/api/situacaoSessao/descricao/exact/${encodeURIComponent(situacaoTeste.descricao)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
      expect(response.body.descricao).toBe(situacaoTeste.descricao);
    });

    it("deve retornar 404 quando nenhuma situação de sessão for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoSessao/descricao/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoSessao/descricao/search/:descricao", () => {
    it("deve buscar situações de sessão por descrição parcial", async () => {
      const response = await request(app)
        .get(`/api/situacaoSessao/descricao/search/${encodeURIComponent("Plan")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(g => g.descricao.includes("Plan"))).toBe(true);
    });

    it("deve retornar 404 quando nenhuma situação de sessão for encontrada", async () => {
      const response = await request(app)
        .get("/api/situacaoSessao/descricao/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/situacaoSessao/:id", () => {
    it("deve atualizar uma situação de sessão existente", async () => {
      const response = await request(app)
        .put(`/api/situacaoSessao/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Concluída",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Concluída");
      
      // Atualizar a referência local
      situacaoTeste = response.body;
    });

    it("deve retornar 404 ao atualizar situação de sessão inexistente", async () => {
      const response = await request(app)
        .put("/api/situacaoSessao/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ descricao: "Teste" });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/situacaoSessao/:id", () => {
    it("deve retornar 404 ao excluir situação de sessão inexistente", async () => {
      const response = await request(app)
        .delete("/api/situacaoSessao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma situação de sessão existente", async () => {
      const response = await request(app)
        .delete(`/api/situacaoSessao/${situacaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.situacaoSessao.findUnique({
        where: { id: situacaoTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
