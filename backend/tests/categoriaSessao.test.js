/**
 * Testes para rotas de categoria de sessão
 * Endpoints: /api/categoriaSessao
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

describe("Categoria de Sessão - /api/categoriaSessao", () => {
  let token;
  let categoriaTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    await seedBasicData();
    
    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/categoriaSessao", () => {
    it("deve criar uma nova categoria de sessão", async () => {
      const categoriaData = {
        descricao: "Leitura",
      };

      const response = await request(app)
        .post("/api/categoriaSessao")
        .set("Authorization", `Bearer ${token}`)
        .send(categoriaData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.descricao).toBe("Leitura");
      
      // Salvar a categoria criada para usar nos demais testes
      categoriaTeste = response.body;
    });

    it("deve validar ausência de descricao", async () => {
      const response = await request(app)
        .post("/api/categoriaSessao")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/categoriaSessao", () => {
    it("deve listar todas as categorias de sessão", async () => {
      const response = await request(app)
        .get("/api/categoriaSessao")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/categoriaSessao/:id", () => {
    it("deve buscar categoria de sessão por ID", async () => {
      const response = await request(app)
        .get(`/api/categoriaSessao/${categoriaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(categoriaTeste.id);
      expect(response.body.descricao).toBe("Leitura");
    });

    it("deve retornar 404 para categoria inexistente", async () => {
      const response = await request(app)
        .get("/api/categoriaSessao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/categoriaSessao/descricao/exact/:descricao", () => {
    it("deve buscar categoria de sessão por descrição exata", async () => {
      const response = await request(app)
        .get(`/api/categoriaSessao/descricao/exact/${encodeURIComponent(categoriaTeste.descricao)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
      expect(response.body.descricao).toBe(categoriaTeste.descricao);
    });

    it("deve retornar 404 quando nenhuma categoria de sessão for encontrada", async () => {
      const response = await request(app)
        .get("/api/categoriaSessao/descricao/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/categoriaSessao/descricao/search/:descricao", () => {
    it("deve buscar categorias de sessão por descrição parcial", async () => {
      const response = await request(app)
        .get(`/api/categoriaSessao/descricao/search/${encodeURIComponent("Lei")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(g => g.descricao.includes("Lei"))).toBe(true);
    });

    it("deve retornar 404 quando nenhuma categoria de sessão for encontrada", async () => {
      const response = await request(app)
        .get("/api/categoriaSessao/descricao/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/categoriaSessao/:id", () => {
    it("deve atualizar uma categoria de sessão existente", async () => {
      const response = await request(app)
        .put(`/api/categoriaSessao/${categoriaTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Exercícios",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Exercícios");
      
      // Atualizar a referência local
      categoriaTeste = response.body;
    });

    it("deve retornar 404 ao atualizar categoria de sessão inexistente", async () => {
      const response = await request(app)
        .put("/api/categoriaSessao/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ descricao: "Teste" });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/categoriaSessao/:id", () => {
    it("deve retornar 404 ao excluir categoria de sessão inexistente", async () => {
      const response = await request(app)
        .delete("/api/categoriaSessao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma categoria de sessão existente", async () => {
      const response = await request(app)
        .delete(`/api/categoriaSessao/${categoriaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.categoriaSessao.findUnique({
        where: { id: categoriaTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
