const request = require("supertest");
const app = require("../src/app");
const { cleanDatabase, seedBasicData, getAuthToken, prisma } = require("./testUtils");
const HttpStatus = require("../src/utils/httpStatus");

describe("Planejamento API", () => {
  let token;
  let planoEstudo;

  beforeAll(async () => {
    await cleanDatabase();
    const seedData = await seedBasicData();
    planoEstudo = seedData.planoEstudo;
    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("POST /api/planejamento", () => {
    it("deve criar um novo planejamento", async () => {
      const response = await request(app)
        .post("/api/planejamento")
        .set("Authorization", `Bearer ${token}`)
        .send({
          dataInicio: new Date("2026-01-06"),
          ativo: true,
          totalHorasSemana: 40.0,
          quantidadeDias: 5,
          planoEstudoId: planoEstudo.id,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.ativo).toBe(true);
      expect(response.body.totalHorasSemana).toBe(40.0);
      expect(response.body.quantidadeDias).toBe(5);
      expect(response.body.planoEstudoId).toBe(planoEstudo.id);
    });

    it("não deve criar um planejamento sem campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/planejamento")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ativo: true,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/planejamento", () => {
    it("deve retornar todos os planejamentos", async () => {
      const response = await request(app)
        .get("/api/planejamento")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/planejamento/:id", () => {
    it("deve retornar um planejamento pelo ID", async () => {
      const planejamento = await prisma.planejamento.create({
        data: {
          dataInicio: new Date("2026-01-13"),
          ativo: true,
          totalHorasSemana: 35.0,
          quantidadeDias: 5,
          planoEstudoId: planoEstudo.id,
        },
      });

      const response = await request(app)
        .get(`/api/planejamento/${planejamento.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(planejamento.id);
      expect(response.body.ativo).toBe(true);
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const response = await request(app)
        .get("/api/planejamento/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/planejamento/planoEstudo/:planoEstudoId", () => {
    it("deve retornar todos os planejamentos de um plano de estudo", async () => {
      const response = await request(app)
        .get(`/api/planejamento/planoEstudo/${planoEstudo.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].planoEstudoId).toBe(planoEstudo.id);
    });

    it("deve retornar 404 para plano de estudo sem planejamentos", async () => {
      // Criar outro usuário e plano de estudo
      const usuario2 = await prisma.usuario.create({
        data: {
          nome: "Usuario",
          sobrenome: "Teste2",
          username: "teste2",
          password: "hash",
          email: "teste2@studium.com",
          generoUsuarioId: (await prisma.generoUsuario.findFirst()).id,
          cidadeId: (await prisma.cidade.findFirst()).id,
          situacaoUsuarioId: (await prisma.situacaoUsuario.findFirst()).id,
          grupoUsuarioId: (await prisma.grupoUsuario.findFirst()).id,
        },
      });

      const planoEstudo2 = await prisma.planoEstudo.create({
        data: {
          titulo: "Plano Teste 2",
          usuarioId: usuario2.id,
          situacaoId: (await prisma.situacaoPlano.findFirst()).id,
        },
      });

      const response = await request(app)
        .get(`/api/planejamento/planoEstudo/${planoEstudo2.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/planejamento/ativos", () => {
    it("deve retornar todos os planejamentos ativos", async () => {
      const response = await request(app)
        .get("/api/planejamento/ativos")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.every((p) => p.ativo === true)).toBe(true);
    });

    it("deve retornar 404 quando não houver planejamentos ativos", async () => {
      // Desativar todos os planejamentos
      await prisma.planejamento.updateMany({
        data: { ativo: false },
      });

      const response = await request(app)
        .get("/api/planejamento/ativos")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      // Reativar os planejamentos para não afetar outros testes
      await prisma.planejamento.updateMany({
        data: { ativo: true },
      });
    });
  });

  describe("PUT /api/planejamento/:id", () => {
    it("deve atualizar um planejamento", async () => {
      const planejamento = await prisma.planejamento.create({
        data: {
          dataInicio: new Date("2026-01-20"),
          ativo: true,
          totalHorasSemana: 30.0,
          quantidadeDias: 4,
          planoEstudoId: planoEstudo.id,
        },
      });

      const response = await request(app)
        .put(`/api/planejamento/${planejamento.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          totalHorasSemana: 45.0,
          quantidadeDias: 6,
          dataFim: new Date("2026-12-31"),
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.totalHorasSemana).toBe(45.0);
      expect(response.body.quantidadeDias).toBe(6);
      expect(response.body.dataFim).toBeTruthy();
    });

    it("deve retornar 404 ao atualizar planejamento inexistente", async () => {
      const response = await request(app)
        .put("/api/planejamento/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          totalHorasSemana: 50.0,
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/planejamento/:id", () => {
    it("deve excluir um planejamento", async () => {
      const planejamento = await prisma.planejamento.create({
        data: {
          dataInicio: new Date("2026-01-27"),
          ativo: true,
          totalHorasSemana: 25.0,
          quantidadeDias: 3,
          planoEstudoId: planoEstudo.id,
        },
      });

      const response = await request(app)
        .delete(`/api/planejamento/${planejamento.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const deleted = await prisma.planejamento.findUnique({
        where: { id: planejamento.id },
      });
      expect(deleted).toBeNull();
    });

    it("deve retornar 404 ao excluir planejamento inexistente", async () => {
      const response = await request(app)
        .delete("/api/planejamento/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
