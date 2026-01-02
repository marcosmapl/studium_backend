/**
 * Testes para rotas de unidades federativas
 * Endpoints: /api/unidadesFederativas
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Unidade Federativa - /api/unidadeFederativa", () => {
  let token;
  let seedData;

  beforeEach(async () => {
    await cleanDatabase();
    seedData = await seedBasicData();
    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/unidadeFederativa", () => {
    it("deve listar todas as unidades federativas", async () => {
      const response = await request(app)
        .get("/api/unidadeFederativa")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/unidadeFederativa", () => {
    it("deve criar uma nova unidade federativa", async () => {
      const unidadeData = {
        nome: "Nova Unidade",
        sigla: "NU",
      };

      const response = await request(app)
        .post("/api/unidadeFederativa")
        .set("Authorization", `Bearer ${token}`)
        .send(unidadeData);

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe("Nova Unidade");
      expect(response.body.sigla).toBe("NU");
    });

    it("deve validar ausência de nome", async () => {
      const response = await request(app)
        .post("/api/unidadeFederativa")
        .set("Authorization", `Bearer ${token}`)
        .send({
          sigla: "NU",
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(400);
    });

    it("deve validar ausência de sigla", async () => {
        const response = await request(app)
          .post("/api/unidadeFederativa")
          .set("Authorization", `Bearer ${token}`)
          .send({
            nome: "Nova Unidade",
            // Faltando campos obrigatórios
          });
  
        expect(response.status).toBe(400);
      });
  });

  describe("GET /api/unidadeFederativa/:id", () => {
    it("deve buscar unidade federativa por ID", async () => {
      const response = await request(app)
        .get(`/api/unidadeFederativa/${seedData.unidadeFederativa.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(seedData.unidadeFederativa.id);
    });

    it("deve retornar 404 para unidade federativa inexistente", async () => {
      const response = await request(app)
        .get("/api/unidadeFederativa/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/unidades/:id", () => {
    it("deve atualizar uma unidade existente", async () => {
      const unidade = await prisma.unidadeFederativa.create({
        data: {
          nome: "Unidade Update",
          sigla: "UU",
        },
      });

      const response = await request(app)
        .put(`/api/unidadeFederativa/${unidade.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Unidade Atualizada",
          sigla: "UA",
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Unidade Atualizada");
      expect(response.body.sigla).toBe("UA");
    });

    it("deve retornar 404 ao atualizar unidade inexistente", async () => {
      const response = await request(app)
        .put("/api/unidadeFederativa/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Teste", sigla: "TS" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/unidades/:id", () => {
    it("deve excluir uma unidade existente", async () => {
      const unidade = await prisma.unidadeFederativa.create({
        data: {
          nome: "Unidade Delete",
          sigla: "UD",
        },
      });

      const response = await request(app)
        .delete(`/api/unidadeFederativa/${unidade.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verificar que foi realmente deletada
      const verificacao = await prisma.unidadeFederativa.findUnique({
        where: { id: unidade.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar 404 ao excluir unidade inexistente", async () => {
      const response = await request(app)
        .delete("/api/unidadeFederativa/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
