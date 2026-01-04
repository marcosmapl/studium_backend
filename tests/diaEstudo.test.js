/**
 * Testes para rotas de dia de estudo
 * Endpoints: /api/diaEstudo
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

describe("Dia Estudo - /api/diaEstudo", () => {
  let token;
  let diaEstudoTeste;
  let planejamentoTeste;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    const basicData = await seedBasicData();
    const planoEstudoTeste = basicData.planoEstudo;
    
    token = await getAuthToken(app);

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

  describe("POST /api/diaEstudo", () => {
    it("deve criar um novo dia de estudo", async () => {
      const diaEstudoData = {
        diaSemana: 1, // Segunda-feira
        horasPlanejadas: 4.0,
        planejamentoId: planejamentoTeste.id,
      };

      const response = await request(app)
        .post("/api/diaEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(diaEstudoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.diaSemana).toBe(1);
      expect(response.body.horasPlanejadas).toBe(4.0);

      diaEstudoTeste = response.body;
    });

    it("deve rejeitar criação de dia de estudo duplicado para mesmo dia e planejamento", async () => {
      const diaEstudoData = {
        diaSemana: 1, // Segunda-feira - já existe
        horasPlanejadas: 3.0,
        planejamentoId: planejamentoTeste.id,
      };

      const response = await request(app)
        .post("/api/diaEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(diaEstudoData);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.error).toMatch(/já existe/i);
    });

    it("deve permitir criar dia de estudo com mesmo dia da semana em planejamento diferente", async () => {
      // Criar um segundo planejamento
      const segundoPlanejamento = await prisma.planejamento.create({
        data: {
          dataInicio: new Date("2026-02-01T00:00:00.000Z"),
          ativo: true,
          totalHorasSemana: 30.0,
          quantidadeDias: 5,
          planoEstudoId: planejamentoTeste.planoEstudoId,
        },
      });

      const diaEstudoData = {
        diaSemana: 1, // Segunda-feira - mesmo dia, planejamento diferente
        horasPlanejadas: 5.0,
        planejamentoId: segundoPlanejamento.id,
      };

      const response = await request(app)
        .post("/api/diaEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(diaEstudoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.diaSemana).toBe(1);
      expect(response.body.planejamentoId).toBe(segundoPlanejamento.id);
    });

    it("deve retornar erro ao tentar criar dia de estudo sem campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/diaEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send({
          diaSemana: 2,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/diaEstudo", () => {
    it("deve listar todos os dias de estudo", async () => {
      const response = await request(app)
        .get("/api/diaEstudo")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/diaEstudo/:id", () => {
    it("deve buscar um dia de estudo por ID", async () => {
      const response = await request(app)
        .get(`/api/diaEstudo/${diaEstudoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(diaEstudoTeste.id);
      expect(response.body.diaSemana).toBe(1);
    });

    it("deve retornar erro ao buscar dia de estudo inexistente", async () => {
      const response = await request(app)
        .get("/api/diaEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/diaEstudo/planejamento/:planejamentoId", () => {
    it("deve buscar dias de estudo por planejamento", async () => {
      const response = await request(app)
        .get(`/api/diaEstudo/planejamento/${planejamentoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].planejamentoId).toBe(planejamentoTeste.id);
    });

    it("deve retornar erro ao buscar dias de estudo de planejamento inexistente", async () => {
      const response = await request(app)
        .get("/api/diaEstudo/planejamento/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/diaEstudo/diaSemana/:diaSemana", () => {
    it("deve buscar dias de estudo por dia da semana", async () => {
      const response = await request(app)
        .get("/api/diaEstudo/diaSemana/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].diaSemana).toBe(1);
    });

    it("deve retornar erro ao buscar dias de estudo de dia da semana inexistente", async () => {
      const response = await request(app)
        .get("/api/diaEstudo/diaSemana/5")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/diaEstudo/:id", () => {
    it("deve atualizar um dia de estudo", async () => {
      const updateData = {
        diaSemana: 2,
        horasPlanejadas: 5.0,
      };

      const response = await request(app)
        .put(`/api/diaEstudo/${diaEstudoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.diaSemana).toBe(2);
      expect(response.body.horasPlanejadas).toBe(5.0);
    });

    it("deve retornar erro ao atualizar dia de estudo inexistente", async () => {
      const response = await request(app)
        .put("/api/diaEstudo/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ horasPlanejadas: 6.0 });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/diaEstudo/:id", () => {
    it("deve excluir um dia de estudo", async () => {
      // Criar novo dia de estudo para deletar
      const novoDiaEstudo = await prisma.diaEstudo.create({
        data: {
          diaSemana: 3,
          horasPlanejadas: 3.0,
          planejamentoId: planejamentoTeste.id,
        },
      });

      const response = await request(app)
        .delete(`/api/diaEstudo/${novoDiaEstudo.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar se foi realmente deletado
      const verificacao = await prisma.diaEstudo.findUnique({
        where: { id: novoDiaEstudo.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar erro ao excluir dia de estudo inexistente", async () => {
      const response = await request(app)
        .delete("/api/diaEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
