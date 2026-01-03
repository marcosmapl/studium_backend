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
  let ufTeste;

  beforeAll(async () => {
    await cleanDatabase();
    await seedBasicData(); // Criar usuário admin para autenticação
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
        descricao: "Teste Unidade Federativa",
        sigla: "TU",
      };

      const response = await request(app)
        .post("/api/unidadeFederativa")
        .set("Authorization", `Bearer ${token}`)
        .send(unidadeData);

      expect(response.status).toBe(201);
      expect(response.body.descricao).toBe("Teste Unidade Federativa");
      expect(response.body.sigla).toBe("TU");
      
      ufTeste = response.body; // Salvar para reutilizar nos outros testes
    });

    it("deve validar ausência de descricao", async () => {
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
            descricao: "Nova Unidade",
            // Faltando campos obrigatórios
          });
  
        expect(response.status).toBe(400);
      });
  });

  describe("GET /api/unidadeFederativa/:id", () => {
    it("deve buscar unidade federativa por ID", async () => {
      const response = await request(app)
        .get(`/api/unidadeFederativa/${ufTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(ufTeste.id);
      expect(response.body.descricao).toBe(ufTeste.descricao);
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
      const response = await request(app)
        .put(`/api/unidadeFederativa/${ufTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          descricao: "Unidade Atualizada",
          sigla: "UA",
        });

      expect(response.status).toBe(200);
      expect(response.body.descricao).toBe("Unidade Atualizada");
      expect(response.body.sigla).toBe("UA");
      
      // Atualizar ufTeste com novos dados
      ufTeste = response.body;
    });

    it("deve retornar 404 ao atualizar unidade inexistente", async () => {
      const response = await request(app)
        .put("/api/unidadeFederativa/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ descricao: "Teste", sigla: "TS" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/unidades/:id", () => {
    it("deve excluir uma unidade existente", async () => {
      const response = await request(app)
        .delete(`/api/unidadeFederativa/${ufTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verificar que foi realmente deletada
      const verificacao = await prisma.unidadeFederativa.findUnique({
        where: { id: ufTeste.id },
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

  describe("GET /api/unidadeFederativa/descricao/exact/:descricao", () => {
    it("deve buscar unidade federativa por descrição exata", async () => {
      // Criar uma UF para teste
      const uf = await prisma.unidadeFederativa.create({
        data: {
          descricao: "Busca Exata Test",
          sigla: "BE",
        },
      });

      const response = await request(app)
        .get("/api/unidadeFederativa/descricao/exact/Busca Exata Test")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.descricao).toBe("Busca Exata Test");
      expect(response.body.sigla).toBe("BE");

      // Limpar
      await prisma.unidadeFederativa.delete({ where: { id: uf.id } });
    });

    it("deve retornar 404 para descrição inexistente", async () => {
      const response = await request(app)
        .get("/api/unidadeFederativa/descricao/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/unidadeFederativa/descricao/search/:descricao", () => {
    it("deve buscar unidades federativas por descrição parcial", async () => {
      // Criar UFs para teste
      const uf1 = await prisma.unidadeFederativa.create({
        data: {
          descricao: "Teste Parcial 1",
          sigla: "T1",
        },
      });
      const uf2 = await prisma.unidadeFederativa.create({
        data: {
          descricao: "Teste Parcial 2",
          sigla: "T2",
        },
      });

      const response = await request(app)
        .get("/api/unidadeFederativa/descricao/search/Parcial")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      
      const descricoes = response.body.map(uf => uf.descricao);
      expect(descricoes).toContain("Teste Parcial 1");
      expect(descricoes).toContain("Teste Parcial 2");

      // Limpar
      await prisma.unidadeFederativa.delete({ where: { id: uf1.id } });
      await prisma.unidadeFederativa.delete({ where: { id: uf2.id } });
    });

    it("deve retornar array vazio para descrição sem correspondência", async () => {
      const response = await request(app)
        .get("/api/unidadeFederativa/descricao/search/XyZaBc123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe("GET /api/unidadeFederativa/sigla/:sigla", () => {
    it("deve buscar unidade federativa por sigla", async () => {
      // Criar uma UF para teste
      const uf = await prisma.unidadeFederativa.create({
        data: {
          descricao: "Busca Sigla Test",
          sigla: "BS",
        },
      });

      const response = await request(app)
        .get("/api/unidadeFederativa/sigla/BS")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.descricao).toBe("Busca Sigla Test");
      expect(response.body.sigla).toBe("BS");

      // Limpar
      await prisma.unidadeFederativa.delete({ where: { id: uf.id } });
    });

    it("deve retornar 404 para sigla inexistente", async () => {
      const response = await request(app)
        .get("/api/unidadeFederativa/sigla/XX")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
