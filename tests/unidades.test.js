/**
 * Testes para rotas de unidades
 * Endpoints: /api/unidades
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Unidades - /api/unidades", () => {
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

  describe("GET /api/unidades", () => {
    it("deve listar todas as unidades", async () => {
      const response = await request(app)
        .get("/api/unidades")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/unidades", () => {
    it("deve criar uma nova unidade", async () => {
      const unidadeData = {
        nome: "Unidade Fortaleza",
        endereco: "Av. Washington Soares, 1000",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60810000",
        telefone1: "8532221100",
        telefone2: "8532221199",
      };

      const response = await request(app)
        .post("/api/unidades")
        .set("Authorization", `Bearer ${token}`)
        .send(unidadeData);

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe("Unidade Fortaleza");
      expect(response.body.cidade).toBe("Fortaleza");
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/unidades")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Unidade Incompleta",
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/unidades/:id", () => {
    it("deve buscar unidade por ID", async () => {
      const response = await request(app)
        .get(`/api/unidades/${seedData.unidade.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(seedData.unidade.id);
    });

    it("deve retornar 404 para unidade inexistente", async () => {
      const response = await request(app)
        .get("/api/unidades/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/unidades/:id", () => {
    it("deve atualizar uma unidade existente", async () => {
      const unidade = await prisma.unidade.create({
        data: {
          nome: "Unidade Update",
          endereco: "Rua Update",
          cidade: "Manaus",
          uf: "AM",
          cep: "69000000",
          telefone1: "9233334444",
          telefone2: "9233335555",
        },
      });

      const response = await request(app)
        .put(`/api/unidades/${unidade.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Unidade Atualizada",
          telefone1: "9244445555",
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Unidade Atualizada");
      expect(response.body.telefone1).toBe("9244445555");
    });

    it("deve retornar 404 ao atualizar unidade inexistente", async () => {
      const response = await request(app)
        .put("/api/unidades/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Teste" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/unidades/:id", () => {
    it("deve excluir uma unidade existente", async () => {
      const unidade = await prisma.unidade.create({
        data: {
          nome: "Unidade Delete",
          endereco: "Rua Delete",
          cidade: "Recife",
          uf: "PE",
          cep: "50000000",
          telefone1: "8155556666",
          telefone2: "8155557777",
        },
      });

      const response = await request(app)
        .delete(`/api/unidades/${unidade.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verificar que foi realmente deletada
      const verificacao = await prisma.unidade.findUnique({
        where: { id: unidade.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar 404 ao excluir unidade inexistente", async () => {
      const response = await request(app)
        .delete("/api/unidades/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
