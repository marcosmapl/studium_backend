/**
 * Testes para rotas de health check
 * Endpoint: /health
 */

const request = require("supertest");
const app = require("../src/app");

describe("Health Check - /health", () => {
  describe("GET /health", () => {
    it("deve retornar status 200 e informações de saúde", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("ok");
    });
  });

  describe("GET /", () => {
    it("deve retornar informações básicas da API", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("ok");
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty("message");
    });
  });
});
