/**
 * Testes para rotas de gênero de usuário
 * Endpoints: /api/generoUsuario
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Gênero de Usuário - /api/generoUsuario", () => {
  let token;
  let seedData;

  beforeEach(async () => {
    await cleanDatabase();
    seedData = await seedBasicData();
    token = await getAuthToken(app);
  });

  describe("GET /api/generoUsuario", () => {
    it("deve listar todos os gêneros de usuário", async () => {
      const response = await request(app)
        .get("/api/generoUsuario")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/generoUsuario", () => {
    it("deve criar um novo gênero de usuário", async () => {
      const generoData = {
        genero: "Não Binário",
      };

      const response = await request(app)
        .post("/api/generoUsuario")
        .set("Authorization", `Bearer ${token}`)
        .send(generoData);

      expect(response.status).toBe(201);
      expect(response.body.genero).toBe("Não Binário");
    });

    it("deve validar ausência de genero", async () => {
      const response = await request(app)
        .post("/api/generoUsuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/generoUsuario/:id", () => {
    it("deve buscar gênero de usuário por ID", async () => {
      const genero = await prisma.generoUsuario.create({
        data: { genero: "Masculino" },
      });

      const response = await request(app)
        .get(`/api/generoUsuario/${genero.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(genero.id);
      expect(response.body.genero).toBe("Masculino");
    });

    it("deve retornar 404 para gênero inexistente", async () => {
      const response = await request(app)
        .get("/api/generoUsuario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/generoUsuario/genero/:genero", () => {
    it("deve buscar gêneros por nome", async () => {
      await prisma.generoUsuario.create({
        data: { genero: "Feminino" },
      });

      const response = await request(app)
        .get("/api/generoUsuario/genero/Feminino")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar 404 quando nenhum gênero for encontrado", async () => {
      const response = await request(app)
        .get("/api/generoUsuario/genero/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/generoUsuario/:id", () => {
    it("deve atualizar um gênero existente", async () => {
      const genero = await prisma.generoUsuario.create({
        data: { genero: "Outro" },
      });

      const response = await request(app)
        .put(`/api/generoUsuario/${genero.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          genero: "Prefiro não informar",
        });

      expect(response.status).toBe(200);
      expect(response.body.genero).toBe("Prefiro não informar");
    });

    it("deve retornar 404 ao atualizar gênero inexistente", async () => {
      const response = await request(app)
        .put("/api/generoUsuario/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ genero: "Teste" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/generoUsuario/:id", () => {
    it("deve excluir um gênero existente", async () => {
      const genero = await prisma.generoUsuario.create({
        data: { genero: "Temporário" },
      });

      const response = await request(app)
        .delete(`/api/generoUsuario/${genero.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.generoUsuario.findUnique({
        where: { id: genero.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar 404 ao excluir gênero inexistente", async () => {
      const response = await request(app)
        .delete("/api/generoUsuario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
