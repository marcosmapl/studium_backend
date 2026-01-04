/**
 * Testes para rotas de revisão
 * Endpoints: /api/revisao
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

describe("Revisão - /api/revisao", () => {
  let token;
  let revisaoTeste;
  let planoEstudoTeste;
  let disciplinaTeste;
  let topicoTeste;
  let categoriaRevisaoTeste;
  let situacaoRevisaoTeste;

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

    // Criar categoria de revisão
    categoriaRevisaoTeste = await prisma.categoriaRevisao.create({
      data: { descricao: "Primeira Revisão" },
    });

    // Criar situação de revisão
    situacaoRevisaoTeste = await prisma.situacaoRevisao.create({
      data: { descricao: "Pendente" },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/revisao", () => {
    it("deve criar uma nova revisão", async () => {
      const revisaoData = {
        numero: 1,
        dataProgramada: new Date("2026-01-10T10:00:00.000Z"),
        desempenho: 85,
        categoriaRevisaoId: categoriaRevisaoTeste.id,
        situacaoRevisaoId: situacaoRevisaoTeste.id,
        planoEstudoId: planoEstudoTeste.id,
        disciplinaId: disciplinaTeste.id,
        topicoId: topicoTeste.id,
      };

      const response = await request(app)
        .post("/api/revisao")
        .set("Authorization", `Bearer ${token}`)
        .send(revisaoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.numero).toBe(1);
      expect(response.body.desempenho).toBe(85);

      revisaoTeste = response.body;
    });

    it("deve retornar erro ao tentar criar revisão sem campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/revisao")
        .set("Authorization", `Bearer ${token}`)
        .send({
          numero: 2,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/revisao", () => {
    it("deve listar todas as revisões", async () => {
      const response = await request(app)
        .get("/api/revisao")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/revisao/:id", () => {
    it("deve buscar uma revisão por ID", async () => {
      const response = await request(app)
        .get(`/api/revisao/${revisaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(revisaoTeste.id);
      expect(response.body.numero).toBe(1);
    });

    it("deve retornar erro ao buscar revisão inexistente", async () => {
      const response = await request(app)
        .get("/api/revisao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/revisao/categoria/:categoriaRevisaoId", () => {
    it("deve buscar revisões por categoria", async () => {
      const response = await request(app)
        .get(`/api/revisao/categoria/${categoriaRevisaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].categoriaRevisaoId).toBe(categoriaRevisaoTeste.id);
    });

    it("deve retornar erro ao buscar revisões de categoria inexistente", async () => {
      const response = await request(app)
        .get("/api/revisao/categoria/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/revisao/situacao/:situacaoRevisaoId", () => {
    it("deve buscar revisões por situação", async () => {
      const response = await request(app)
        .get(`/api/revisao/situacao/${situacaoRevisaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].situacaoRevisaoId).toBe(situacaoRevisaoTeste.id);
    });

    it("deve retornar erro ao buscar revisões de situação inexistente", async () => {
      const response = await request(app)
        .get("/api/revisao/situacao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/revisao/planoEstudo/:planoEstudoId", () => {
    it("deve buscar revisões por plano de estudo", async () => {
      const response = await request(app)
        .get(`/api/revisao/planoEstudo/${planoEstudoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].planoEstudoId).toBe(planoEstudoTeste.id);
    });

    it("deve retornar erro ao buscar revisões de plano inexistente", async () => {
      const response = await request(app)
        .get("/api/revisao/planoEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/revisao/disciplina/:disciplinaId", () => {
    it("deve buscar revisões por disciplina", async () => {
      const response = await request(app)
        .get(`/api/revisao/disciplina/${disciplinaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].disciplinaId).toBe(disciplinaTeste.id);
    });

    it("deve retornar erro ao buscar revisões de disciplina inexistente", async () => {
      const response = await request(app)
        .get("/api/revisao/disciplina/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/revisao/topico/:topicoId", () => {
    it("deve buscar revisões por tópico", async () => {
      const response = await request(app)
        .get(`/api/revisao/topico/${topicoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].topicoId).toBe(topicoTeste.id);
    });

    it("deve retornar erro ao buscar revisões de tópico inexistente", async () => {
      const response = await request(app)
        .get("/api/revisao/topico/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/revisao/:id", () => {
    it("deve atualizar uma revisão", async () => {
      const updateData = {
        desempenho: 90,
        dataRealizada: new Date("2026-01-10T14:00:00.000Z"),
        questoesAcertos: 18,
        questoesErros: 2,
      };

      const response = await request(app)
        .put(`/api/revisao/${revisaoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.desempenho).toBe(90);
      expect(response.body.questoesAcertos).toBe(18);
    });

    it("deve retornar erro ao atualizar revisão inexistente", async () => {
      const response = await request(app)
        .put("/api/revisao/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ desempenho: 95 });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/revisao/:id", () => {
    it("deve excluir uma revisão", async () => {
      // Criar uma nova revisão para deletar
      const novaRevisao = await prisma.revisao.create({
        data: {
          numero: 2,
          dataProgramada: new Date("2026-01-15T10:00:00.000Z"),
          desempenho: 80,
          categoriaRevisaoId: categoriaRevisaoTeste.id,
          situacaoRevisaoId: situacaoRevisaoTeste.id,
          planoEstudoId: planoEstudoTeste.id,
          disciplinaId: disciplinaTeste.id,
          topicoId: topicoTeste.id,
        },
      });

      const response = await request(app)
        .delete(`/api/revisao/${novaRevisao.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar se foi realmente deletada
      const verificacao = await prisma.revisao.findUnique({
        where: { id: novaRevisao.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar erro ao excluir revisão inexistente", async () => {
      const response = await request(app)
        .delete("/api/revisao/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
