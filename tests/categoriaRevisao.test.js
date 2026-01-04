const request = require("supertest");
const app = require("../src/app");
const { cleanDatabase, getAuthToken } = require("./testUtils");
const HttpStatus = require("../src/utils/httpStatus");

let authToken;

beforeAll(async () => {
  await cleanDatabase();
  await require("./testUtils").seedBasicData();
  authToken = await getAuthToken(app);
});

afterAll(async () => {
  await cleanDatabase();
});

describe("Categoria de Revisão API", () => {
  describe("POST /api/categoriaRevisao", () => {
    it("deve criar uma nova categoria de revisão", async () => {
      const response = await request(app)
        .post("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Primeira Revisão"
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.descricao).toBe("Primeira Revisão");
    });

    it("deve retornar erro ao tentar criar categoria de revisão sem descrição", async () => {
      const response = await request(app)
        .post("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/categoriaRevisao", () => {
    it("deve listar todas as categorias de revisão", async () => {
      const response = await request(app)
        .get("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/categoriaRevisao/:id", () => {
    it("deve buscar uma categoria de revisão por ID", async () => {
      const createResponse = await request(app)
        .post("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Segunda Revisão"
        });

      const response = await request(app)
        .get(`/api/categoriaRevisao/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Segunda Revisão");
    });

    it("deve retornar erro ao buscar categoria de revisão inexistente", async () => {
      const response = await request(app)
        .get("/api/categoriaRevisao/99999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/categoriaRevisao/descricao/exact/:descricao", () => {
    it("deve buscar categoria de revisão por descrição exata", async () => {
      await request(app)
        .post("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Terceira Revisão"
        });

      const response = await request(app)
        .get("/api/categoriaRevisao/descricao/exact/Terceira Revisão")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Terceira Revisão");
    });

    it("deve retornar erro ao buscar categoria de revisão por descrição inexistente", async () => {
      const response = await request(app)
        .get("/api/categoriaRevisao/descricao/exact/Categoria Inexistente")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/categoriaRevisao/descricao/search/:descricao", () => {
    it("deve buscar categorias de revisão por descrição parcial", async () => {
      const response = await request(app)
        .get("/api/categoriaRevisao/descricao/search/Revisão")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar array vazio ao buscar categoria de revisão por descrição parcial inexistente", async () => {
      const response = await request(app)
        .get("/api/categoriaRevisao/descricao/search/XYZ123")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/categoriaRevisao/:id", () => {
    it("deve atualizar uma categoria de revisão", async () => {
      const createResponse = await request(app)
        .post("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Quarta Revisão"
        });

      const response = await request(app)
        .put(`/api/categoriaRevisao/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Quarta Revisão Atualizada"
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Quarta Revisão Atualizada");
    });

    it("deve retornar erro ao atualizar categoria de revisão inexistente", async () => {
      const response = await request(app)
        .put("/api/categoriaRevisao/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Descrição Atualizada"
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/categoriaRevisao/:id", () => {
    it("deve excluir uma categoria de revisão", async () => {
      const createResponse = await request(app)
        .post("/api/categoriaRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Quinta Revisão"
        });

      const response = await request(app)
        .delete(`/api/categoriaRevisao/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("deve retornar erro ao excluir categoria de revisão inexistente", async () => {
      const response = await request(app)
        .delete("/api/categoriaRevisao/99999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
