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

describe("Situação de Revisão API", () => {
  describe("POST /api/situacaoRevisao", () => {
    it("deve criar uma nova situação de revisão", async () => {
      const response = await request(app)
        .post("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Pendente"
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.descricao).toBe("Pendente");
    });

    it("deve retornar erro ao tentar criar situação de revisão sem descrição", async () => {
      const response = await request(app)
        .post("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/situacaoRevisao", () => {
    it("deve listar todas as situações de revisão", async () => {
      const response = await request(app)
        .get("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/situacaoRevisao/:id", () => {
    it("deve buscar uma situação de revisão por ID", async () => {
      const createResponse = await request(app)
        .post("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Em Andamento"
        });

      const response = await request(app)
        .get(`/api/situacaoRevisao/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Em Andamento");
    });

    it("deve retornar erro ao buscar situação de revisão inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoRevisao/99999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoRevisao/descricao/exact/:descricao", () => {
    it("deve buscar situação de revisão por descrição exata", async () => {
      await request(app)
        .post("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Concluída"
        });

      const response = await request(app)
        .get("/api/situacaoRevisao/descricao/exact/Concluída")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Concluída");
    });

    it("deve retornar erro ao buscar situação de revisão por descrição inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoRevisao/descricao/exact/Situação Inexistente")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/situacaoRevisao/descricao/search/:descricao", () => {
    it("deve buscar situações de revisão por descrição parcial", async () => {
      const response = await request(app)
        .get("/api/situacaoRevisao/descricao/search/Pend")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar array vazio ao buscar situação de revisão por descrição parcial inexistente", async () => {
      const response = await request(app)
        .get("/api/situacaoRevisao/descricao/search/XYZ123")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/situacaoRevisao/:id", () => {
    it("deve atualizar uma situação de revisão", async () => {
      const createResponse = await request(app)
        .post("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Cancelada"
        });

      const response = await request(app)
        .put(`/api/situacaoRevisao/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Reagendada"
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.descricao).toBe("Reagendada");
    });

    it("deve retornar erro ao atualizar situação de revisão inexistente", async () => {
      const response = await request(app)
        .put("/api/situacaoRevisao/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Descrição Atualizada"
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/situacaoRevisao/:id", () => {
    it("deve excluir uma situação de revisão", async () => {
      const createResponse = await request(app)
        .post("/api/situacaoRevisao")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          descricao: "Temporária"
        });

      const response = await request(app)
        .delete(`/api/situacaoRevisao/${createResponse.body.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it("deve retornar erro ao excluir situação de revisão inexistente", async () => {
      const response = await request(app)
        .delete("/api/situacaoRevisao/99999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
