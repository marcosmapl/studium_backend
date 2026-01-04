const request = require("supertest");
const app = require("../src/app");
const { cleanDatabase, seedBasicData, getAuthToken, prisma } = require("./testUtils");
const HttpStatus = require("../src/utils/httpStatus");

describe("Alocação Horário API", () => {
  let token;
  let planoEstudo;
  let disciplina;
  let planejamento;
  let diaEstudo;
  let disciplinaPlanejamento;

  beforeAll(async () => {
    await cleanDatabase();
    const seedData = await seedBasicData();
    planoEstudo = seedData.planoEstudo;
    token = await getAuthToken(app);

    // Criar disciplina
    disciplina = await prisma.disciplina.create({
      data: {
        titulo: "Matemática para Testes",
        descricao: "Disciplina de teste",
        planoId: planoEstudo.id,
      },
    });

    // Criar planejamento
    planejamento = await prisma.planejamento.create({
      data: {
        dataInicio: new Date(),
        ativo: true,
        totalHorasSemana: 40,
        quantidadeDias: 5,
        planoEstudoId: planoEstudo.id,
      },
    });

    // Criar dia de estudo
    diaEstudo = await prisma.diaEstudo.create({
      data: {
        diaSemana: 1, // Segunda-feira
        horasPlanejadas: 8.0,
        planejamentoId: planejamento.id,
      },
    });

    // Criar disciplina planejamento
    disciplinaPlanejamento = await prisma.disciplinaPlanejamento.create({
      data: {
        importancia: 8.0,
        conhecimento: 5.0,
        horasSemanais: 10.0,
        planejamentoId: planejamento.id,
        disciplinaId: disciplina.id,
      },
    });
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("POST /api/alocacaoHorario", () => {
    it("deve criar uma nova alocação de horário", async () => {
      const response = await request(app)
        .post("/api/alocacaoHorario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          horasAlocadas: 2.5,
          ordem: 1,
          observacoes: "Primeira alocação do dia",
          diaEstudoId: diaEstudo.id,
          disciplinaCronogramaId: disciplinaPlanejamento.id,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.horasAlocadas).toBe(2.5);
      expect(response.body.ordem).toBe(1);
      expect(response.body.diaEstudoId).toBe(diaEstudo.id);
      expect(response.body.disciplinaCronogramaId).toBe(disciplinaPlanejamento.id);
    });

    it("deve rejeitar criação de alocação de horário duplicada para mesma combinação", async () => {
      const response = await request(app)
        .post("/api/alocacaoHorario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          horasAlocadas: 3.0,
          ordem: 2,
          diaEstudoId: diaEstudo.id,
          disciplinaCronogramaId: disciplinaPlanejamento.id,
        });

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.error).toMatch(/já existe/i);
    });

    it("deve permitir criar alocação de horário com mesma disciplina em dia diferente", async () => {
      // Criar um segundo dia de estudo
      const segundoDiaEstudo = await prisma.diaEstudo.create({
        data: {
          diaSemana: 2, // Terça-feira
          horasPlanejadas: 6.0,
          planejamentoId: planejamento.id,
        },
      });

      const response = await request(app)
        .post("/api/alocacaoHorario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          horasAlocadas: 2.0,
          ordem: 1,
          diaEstudoId: segundoDiaEstudo.id,
          disciplinaCronogramaId: disciplinaPlanejamento.id,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.diaEstudoId).toBe(segundoDiaEstudo.id);
      expect(response.body.disciplinaCronogramaId).toBe(disciplinaPlanejamento.id);
    });

    it("não deve criar uma alocação de horário sem campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/alocacaoHorario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ordem: 2,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/alocacaoHorario", () => {
    it("deve retornar todas as alocações de horário", async () => {
      const response = await request(app)
        .get("/api/alocacaoHorario")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/alocacaoHorario/:id", () => {
    it("deve retornar uma alocação de horário pelo ID", async () => {
      const diaEstudo2 = await prisma.diaEstudo.create({
        data: {
          diaSemana: 6, // Sábado
          horasPlanejadas: 6.0,
          ativo: true,
          planejamentoId: planejamento.id,
        },
      });

      const alocacao = await prisma.alocacaoHorario.create({
        data: {
          horasAlocadas: 3.0,
          ordem: 2,
          diaEstudoId: diaEstudo2.id,
          disciplinaCronogramaId: disciplinaPlanejamento.id,
        },
      });

      const response = await request(app)
        .get(`/api/alocacaoHorario/${alocacao.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(alocacao.id);
      expect(response.body.horasAlocadas).toBe(3.0);
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const response = await request(app)
        .get("/api/alocacaoHorario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/alocacaoHorario/diaEstudo/:diaEstudoId", () => {
    it("deve retornar todas as alocações de horário de um dia de estudo", async () => {
      const response = await request(app)
        .get(`/api/alocacaoHorario/diaEstudo/${diaEstudo.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].diaEstudoId).toBe(diaEstudo.id);
    });

    it("deve retornar 404 para dia de estudo sem alocações", async () => {
      const diaEstudo5 = await prisma.diaEstudo.create({
        data: {
          diaSemana: 5, // Sexta-feira
          horasPlanejadas: 8.0,
          planejamentoId: planejamento.id,
        },
      });

      const response = await request(app)
        .get(`/api/alocacaoHorario/diaEstudo/${diaEstudo5.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/alocacaoHorario/disciplinaCronograma/:disciplinaCronogramaId", () => {
    it("deve retornar todas as alocações de horário de uma disciplina de planejamento", async () => {
      const response = await request(app)
        .get(`/api/alocacaoHorario/disciplinaCronograma/${disciplinaPlanejamento.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].disciplinaCronogramaId).toBe(disciplinaPlanejamento.id);
    });

    it("deve retornar 404 para disciplina de planejamento sem alocações", async () => {
      const disciplina2 = await prisma.disciplina.create({
        data: {
          titulo: "Física para Testes",
          descricao: "Disciplina de teste 2",
          planoId: planoEstudo.id,
        },
      });

      const disciplinaPlanejamento2 = await prisma.disciplinaPlanejamento.create({
        data: {
          importancia: 7.0,
          conhecimento: 6.0,
          horasSemanais: 8.0,
          planejamentoId: planejamento.id,
          disciplinaId: disciplina2.id,
        },
      });

      const response = await request(app)
        .get(`/api/alocacaoHorario/disciplinaCronograma/${disciplinaPlanejamento2.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/alocacaoHorario/:id", () => {
    it("deve atualizar uma alocação de horário", async () => {
      const diaEstudo3 = await prisma.diaEstudo.create({
        data: {
          diaSemana: 3,
          horasPlanejadas: 7.0,
          ativo: true,
          planejamentoId: planejamento.id,
        },
      });

      const alocacao = await prisma.alocacaoHorario.create({
        data: {
          horasAlocadas: 2.0,
          ordem: 3,
          diaEstudoId: diaEstudo3.id,
          disciplinaCronogramaId: disciplinaPlanejamento.id,
        },
      });

      const response = await request(app)
        .put(`/api/alocacaoHorario/${alocacao.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          horasAlocadas: 3.5,
          ordem: 1,
          observacoes: "Alocação atualizada",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.horasAlocadas).toBe(3.5);
      expect(response.body.ordem).toBe(1);
      expect(response.body.observacoes).toBe("Alocação atualizada");
    });

    it("deve retornar 404 ao atualizar alocação de horário inexistente", async () => {
      const response = await request(app)
        .put("/api/alocacaoHorario/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          horasAlocadas: 4.0,
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/alocacaoHorario/:id", () => {
    it("deve excluir uma alocação de horário", async () => {
      const diaEstudo4 = await prisma.diaEstudo.create({
        data: {
          diaSemana: 4,
          horasPlanejadas: 5.0,
          ativo: true,
          planejamentoId: planejamento.id,
        },
      });

      const alocacao = await prisma.alocacaoHorario.create({
        data: {
          horasAlocadas: 1.5,
          ordem: 4,
          diaEstudoId: diaEstudo4.id,
          disciplinaCronogramaId: disciplinaPlanejamento.id,
        },
      });

      const response = await request(app)
        .delete(`/api/alocacaoHorario/${alocacao.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const deleted = await prisma.alocacaoHorario.findUnique({
        where: { id: alocacao.id },
      });
      expect(deleted).toBeNull();
    });

    it("deve retornar 404 ao excluir alocação de horário inexistente", async () => {
      const response = await request(app)
        .delete("/api/alocacaoHorario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
