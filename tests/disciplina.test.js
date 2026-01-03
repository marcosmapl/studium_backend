/**
 * Testes para rotas de disciplina
 * Endpoints: /api/disciplina
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

describe("Disciplina - /api/disciplina", () => {
  let token;
  let disciplinaTeste;
  let seedData;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    seedData = await seedBasicData();
    
    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/disciplina", () => {
    it("deve criar uma nova disciplina", async () => {
      const disciplinaData = {
        titulo: "Direito Constitucional",
        descricao: "Estudo dos princípios constitucionais",
        cor: "#FF5733",
        planoId: seedData.planoEstudo.id,
      };

      const response = await request(app)
        .post("/api/disciplina")
        .set("Authorization", `Bearer ${token}`)
        .send(disciplinaData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.titulo).toBe("Direito Constitucional");
      expect(response.body.descricao).toBe("Estudo dos princípios constitucionais");
      expect(response.body.cor).toBe("#FF5733");
      expect(response.body.planoId).toBe(seedData.planoEstudo.id);
      
      // Salvar a disciplina criada para usar nos demais testes
      disciplinaTeste = response.body;
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/disciplina")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it("deve validar ausência de título", async () => {
      const response = await request(app)
        .post("/api/disciplina")
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Teste",
          cor: "#000000",
          planoId: seedData.planoEstudo.id,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/disciplina", () => {
    it("deve listar todas as disciplinas", async () => {
      const response = await request(app)
        .get("/api/disciplina")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/disciplina/:id", () => {
    it("deve buscar disciplina por ID", async () => {
      const response = await request(app)
        .get(`/api/disciplina/${disciplinaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(disciplinaTeste.id);
      expect(response.body.titulo).toBe("Direito Constitucional");
    });

    it("deve retornar 404 para disciplina inexistente", async () => {
      const response = await request(app)
        .get("/api/disciplina/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/disciplina/titulo/exact/:titulo", () => {
    it("deve buscar disciplina por título exato", async () => {
      const response = await request(app)
        .get(`/api/disciplina/titulo/exact/${encodeURIComponent(disciplinaTeste.titulo)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
      expect(response.body.titulo).toBe(disciplinaTeste.titulo);
    });

    it("deve retornar 404 quando nenhuma disciplina for encontrada", async () => {
      const response = await request(app)
        .get("/api/disciplina/titulo/exact/DisciplinaInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/disciplina/titulo/search/:titulo", () => {
    it("deve buscar disciplinas por título parcial", async () => {
      const response = await request(app)
        .get(`/api/disciplina/titulo/search/${encodeURIComponent("Direito")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(d => d.titulo.includes("Direito"))).toBe(true);
    });

    it("deve retornar 404 quando nenhuma disciplina for encontrada", async () => {
      const response = await request(app)
        .get("/api/disciplina/titulo/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/disciplina/plano/:planoId", () => {
    it("deve buscar todas as disciplinas de um plano de estudo", async () => {
      const response = await request(app)
        .get(`/api/disciplina/plano/${seedData.planoEstudo.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.every(d => d.planoId === seedData.planoEstudo.id)).toBe(true);
    });

    it("deve retornar 404 quando nenhuma disciplina for encontrada para o plano", async () => {
      const response = await request(app)
        .get("/api/disciplina/plano/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/disciplina/:id", () => {
    it("deve atualizar uma disciplina existente", async () => {
      const response = await request(app)
        .put(`/api/disciplina/${disciplinaTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          titulo: "Direito Constitucional Avançado",
          descricao: "Aprofundamento em controle de constitucionalidade",
          progresso: 50,
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.titulo).toBe("Direito Constitucional Avançado");
      expect(response.body.descricao).toBe("Aprofundamento em controle de constitucionalidade");
      
      // Atualizar a referência local
      disciplinaTeste = response.body;
    });

    it("deve retornar 404 ao atualizar disciplina inexistente", async () => {
      const response = await request(app)
        .put("/api/disciplina/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "Teste" });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/disciplina/:id", () => {
    it("deve retornar 404 ao excluir disciplina inexistente", async () => {
      const response = await request(app)
        .delete("/api/disciplina/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma disciplina existente", async () => {
      const response = await request(app)
        .delete(`/api/disciplina/${disciplinaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletada
      const verificacao = await prisma.disciplina.findUnique({
        where: { id: disciplinaTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
