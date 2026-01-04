/**
 * Testes para rotas de disciplina de planejamento
 * Endpoints: /api/disciplinaPlanejamento
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

describe("Disciplina Planejamento - /api/disciplinaPlanejamento", () => {
  let token;
  let disciplinaPlanejamentoTeste;
  let planejamentoTeste;
  let disciplinaTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    const basicData = await seedBasicData();
    const planoEstudoTeste = basicData.planoEstudo;
    
    token = await getAuthToken(app);

    // Criar disciplina de teste
    disciplinaTeste = await prisma.disciplina.create({
      data: {
        titulo: "Matemática Teste",
        planoId: planoEstudoTeste.id,
      },
    });

    // Criar planejamento de teste
    planejamentoTeste = await prisma.planejamento.create({
      data: {
        dataInicio: new Date("2026-01-06T00:00:00.000Z"),
        ativo: true,
        totalHorasSemana: 40.0,
        quantidadeDias: 5,
        planoEstudoId: planoEstudoTeste.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/disciplinaPlanejamento", () => {
    it("deve criar uma nova disciplina de planejamento", async () => {
      const disciplinaPlanejamentoData = {
        importancia: 8.5,
        conhecimento: 5.0,
        prioridade: 1.7,
        horasSemanais: 10.0,
        percentualCarga: 25.0,
        observacoes: "Revisar conceitos básicos",
        planejamentoId: planejamentoTeste.id,
        disciplinaId: disciplinaTeste.id,
      };

      const response = await request(app)
        .post("/api/disciplinaPlanejamento")
        .set("Authorization", `Bearer ${token}`)
        .send(disciplinaPlanejamentoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(parseFloat(response.body.importancia)).toBe(8.5);
      expect(parseFloat(response.body.conhecimento)).toBe(5.0);
      expect(parseFloat(response.body.prioridade)).toBe(1.7);

      disciplinaPlanejamentoTeste = response.body;
    });

    it("deve retornar erro ao tentar criar disciplina de planejamento sem campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/disciplinaPlanejamento")
        .set("Authorization", `Bearer ${token}`)
        .send({
          importancia: 8.0,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/disciplinaPlanejamento", () => {
    it("deve listar todas as disciplinas de planejamento", async () => {
      const response = await request(app)
        .get("/api/disciplinaPlanejamento")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/disciplinaPlanejamento/:id", () => {
    it("deve buscar uma disciplina de planejamento por ID", async () => {
      const response = await request(app)
        .get(`/api/disciplinaPlanejamento/${disciplinaPlanejamentoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(disciplinaPlanejamentoTeste.id);
      expect(parseFloat(response.body.importancia)).toBe(8.5);
    });

    it("deve retornar erro ao buscar disciplina de planejamento inexistente", async () => {
      const response = await request(app)
        .get("/api/disciplinaPlanejamento/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/disciplinaPlanejamento/planejamento/:planejamentoId", () => {
    it("deve buscar disciplinas por planejamento", async () => {
      const response = await request(app)
        .get(`/api/disciplinaPlanejamento/planejamento/${planejamentoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].planejamentoId).toBe(planejamentoTeste.id);
    });

    it("deve retornar erro ao buscar disciplinas de planejamento inexistente", async () => {
      const response = await request(app)
        .get("/api/disciplinaPlanejamento/planejamento/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/disciplinaPlanejamento/disciplina/:disciplinaId", () => {
    it("deve buscar planejamentos por disciplina", async () => {
      const response = await request(app)
        .get(`/api/disciplinaPlanejamento/disciplina/${disciplinaTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].disciplinaId).toBe(disciplinaTeste.id);
    });

    it("deve retornar erro ao buscar planejamentos de disciplina inexistente", async () => {
      const response = await request(app)
        .get("/api/disciplinaPlanejamento/disciplina/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/disciplinaPlanejamento/:id", () => {
    it("deve atualizar uma disciplina de planejamento", async () => {
      const updateData = {
        importancia: 9.0,
        conhecimento: 6.0,
        prioridade: 1.5,
        horasSemanais: 12.0,
        percentualCarga: 30.0,
      };

      const response = await request(app)
        .put(`/api/disciplinaPlanejamento/${disciplinaPlanejamentoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(HttpStatus.OK);
      expect(parseFloat(response.body.importancia)).toBe(9.0);
      expect(parseFloat(response.body.conhecimento)).toBe(6.0);
      expect(response.body.horasSemanais).toBe(12.0);
    });

    it("deve retornar erro ao atualizar disciplina de planejamento inexistente", async () => {
      const response = await request(app)
        .put("/api/disciplinaPlanejamento/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ importancia: 9.5 });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/disciplinaPlanejamento/:id", () => {
    it("deve excluir uma disciplina de planejamento", async () => {
      // Criar nova disciplina para deletar
      const novaDisciplina = await prisma.disciplina.create({
        data: {
          titulo: "Física Teste",
          planoId: planejamentoTeste.planoEstudoId,
        },
      });

      const novaDisciplinaPlanejamento = await prisma.disciplinaPlanejamento.create({
        data: {
          importancia: 7.0,
          conhecimento: 4.0,
          prioridade: 1.75,
          horasSemanais: 8.0,
          percentualCarga: 20.0,
          planejamentoId: planejamentoTeste.id,
          disciplinaId: novaDisciplina.id,
        },
      });

      const response = await request(app)
        .delete(`/api/disciplinaPlanejamento/${novaDisciplinaPlanejamento.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar se foi realmente deletada
      const verificacao = await prisma.disciplinaPlanejamento.findUnique({
        where: { id: novaDisciplinaPlanejamento.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar erro ao excluir disciplina de planejamento inexistente", async () => {
      const response = await request(app)
        .delete("/api/disciplinaPlanejamento/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
