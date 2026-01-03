/**
 * Testes para rotas de sessão de estudo
 * Endpoints: /api/sessaoEstudo
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

describe("Sessão de Estudo - /api/sessaoEstudo", () => {
  let token;
  let sessaoTeste;
  let planoEstudoTeste;
  let disciplinaTeste;
  let topicoTeste;
  let categoriaSessaoTeste;
  let situacaoSessaoTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    const basicData = await seedBasicData();
    planoEstudoTeste = basicData.planoEstudo;
    
    token = await getAuthToken(app);

    // Criar situação de tópico
    const situacaoTopico = await prisma.situacaoTopico.create({
      data: { descricao: "Em andamento" },
    });

    // Criar disciplina de teste
    disciplinaTeste = await prisma.disciplina.create({
      data: {
        titulo: "Disciplina Teste",
        planoId: planoEstudoTeste.id,
      },
    });

    // Criar tópico de teste
    topicoTeste = await prisma.topico.create({
      data: {
        titulo: "Tópico Teste",
        ordem: 1,
        disciplinaId: disciplinaTeste.id,
        situacaoId: situacaoTopico.id,
      },
    });

    // Criar categoria de sessão
    categoriaSessaoTeste = await prisma.categoriaSessao.create({
      data: { descricao: "Leitura" },
    });

    // Criar situação de sessão
    situacaoSessaoTeste = await prisma.situacaoSessao.create({
      data: { descricao: "Planejada" },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/sessaoEstudo", () => {
    it("deve criar uma nova sessão de estudo", async () => {
      const sessaoData = {
        planoEstudoId: planoEstudoTeste.id,
        disciplinaId: disciplinaTeste.id,
        topicoId: topicoTeste.id,
        categoriaSessaoId: categoriaSessaoTeste.id,
        situacaoSessaoId: situacaoSessaoTeste.id,
        questoesAcertos: 10,
        questoesErros: 2,
        tempoEstudo: 2.5,
        paginasLidas: 15,
        topicoFinalizado: false,
      };

      const response = await request(app)
        .post("/api/sessaoEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(sessaoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.planoEstudoId).toBe(planoEstudoTeste.id);
      expect(response.body.disciplinaId).toBe(disciplinaTeste.id);
      expect(response.body.topicoId).toBe(topicoTeste.id);
      
      // Salvar a sessão criada para usar nos demais testes
      sessaoTeste = response.body;
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/sessaoEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
          planoEstudoId: planoEstudoTeste.id,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/sessaoEstudo", () => {
    it("deve listar todas as sessões de estudo", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/sessaoEstudo/:id", () => {
    it("deve buscar sessão de estudo por ID", async () => {
      const response = await request(app)
        .get(`/api/sessaoEstudo/${sessaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(sessaoTeste.id);
      expect(response.body.planoEstudoId).toBe(planoEstudoTeste.id);
    });

    it("deve retornar 404 para sessão inexistente", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/sessaoEstudo/planoEstudo/:planoEstudoId", () => {
    it("deve buscar sessões de estudo por plano de estudo", async () => {
      const response = await request(app)
        .get(`/api/sessaoEstudo/planoEstudo/${planoEstudoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].planoEstudoId).toBe(planoEstudoTeste.id);
    });

    it("deve retornar 404 quando não houver sessões para o plano", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo/planoEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/sessaoEstudo/disciplina/:disciplinaId", () => {
    it("deve buscar sessões de estudo por disciplina", async () => {
      const response = await request(app)
        .get(`/api/sessaoEstudo/disciplina/${disciplinaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].disciplinaId).toBe(disciplinaTeste.id);
    });

    it("deve retornar 404 quando não houver sessões para a disciplina", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo/disciplina/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/sessaoEstudo/topico/:topicoId", () => {
    it("deve buscar sessões de estudo por tópico", async () => {
      const response = await request(app)
        .get(`/api/sessaoEstudo/topico/${topicoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].topicoId).toBe(topicoTeste.id);
    });

    it("deve retornar 404 quando não houver sessões para o tópico", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo/topico/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/sessaoEstudo/categoria/:categoriaSessaoId", () => {
    it("deve buscar sessões de estudo por categoria", async () => {
      const response = await request(app)
        .get(`/api/sessaoEstudo/categoria/${categoriaSessaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].categoriaSessaoId).toBe(categoriaSessaoTeste.id);
    });

    it("deve retornar 404 quando não houver sessões para a categoria", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo/categoria/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/sessaoEstudo/situacao/:situacaoSessaoId", () => {
    it("deve buscar sessões de estudo por situação", async () => {
      const response = await request(app)
        .get(`/api/sessaoEstudo/situacao/${situacaoSessaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].situacaoSessaoId).toBe(situacaoSessaoTeste.id);
    });

    it("deve retornar 404 quando não houver sessões para a situação", async () => {
      const response = await request(app)
        .get("/api/sessaoEstudo/situacao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/sessaoEstudo/:id", () => {
    it("deve atualizar uma sessão de estudo existente", async () => {
      const response = await request(app)
        .put(`/api/sessaoEstudo/${sessaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          questoesAcertos: 15,
          questoesErros: 1,
          tempoEstudo: 3.0,
          topicoFinalizado: true,
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.questoesAcertos).toBe(15);
      expect(response.body.topicoFinalizado).toBe(true);
      
      // Atualizar a referência local
      sessaoTeste = response.body;
    });

    it("deve retornar 404 ao atualizar sessão inexistente", async () => {
      const response = await request(app)
        .put("/api/sessaoEstudo/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ questoesAcertos: 5 });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/sessaoEstudo/:id", () => {
    it("deve retornar 404 ao excluir sessão inexistente", async () => {
      const response = await request(app)
        .delete("/api/sessaoEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma sessão de estudo existente", async () => {
      const response = await request(app)
        .delete(`/api/sessaoEstudo/${sessaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.sessaoEstudo.findUnique({
        where: { id: sessaoTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
