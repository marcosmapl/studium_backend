/**
 * Testes para rotas de plano de estudo
 * Endpoints: /api/planoEstudo
 */
const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const HttpStatus = require("../src/utils/httpStatus");
const {
  cleanDatabase,
  getAuthToken,
  seedBasicData,
  prisma,
} = require("./testUtils");

describe("Situação de Plano de Estudo - /api/planoEstudo", () => {
  let token;
  let planoTeste;
  let seedData;

  beforeAll(async () => {
    await cleanDatabase();

    // Criar dados básicos necessários para autenticação
    seedData = await seedBasicData();
    
    token = await getAuthToken(app);
  });

  describe("POST /api/planoEstudo", () => {
    it("deve criar um novo plano de estudo", async () => {
      const planoData = {
        titulo: "Novo Plano Teste",
        usuarioId: seedData.usuario.id,
        situacaoId: seedData.situacaoPlano.id,
      };

      const response = await request(app)
        .post("/api/planoEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(planoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.titulo).toBe("Novo Plano Teste");
      
      // Salvar a situação criada para usar nos demais testes
      planoTeste = response.body;
    });

    it("deve rejeitar criação de plano de estudo duplicado para o mesmo usuário", async () => {
      const planoData = {
        titulo: "Novo Plano Teste",
        usuarioId: seedData.usuario.id,
        situacaoId: seedData.situacaoPlano.id,
      };

      const response = await request(app)
        .post("/api/planoEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(planoData);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.error).toMatch(/já existe/i);
    });

    it("deve permitir criar plano de estudo com mesmo título para usuário diferente", async () => {
      // Criar um segundo usuário
      const segundoUsuario = await prisma.usuario.create({
        data: {
          nome: "Usuario",
          sobrenome: "Teste 2",
          username: "teste2",
          password: await bcrypt.hash("senha123", 10),
          email: "teste2@example.com",
          generoUsuarioId: seedData.generoUsuario.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          cidadeId: seedData.cidade.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        },
      });

      const planoData = {
        titulo: "Novo Plano Teste",
        usuarioId: segundoUsuario.id,
        situacaoId: seedData.situacaoPlano.id,
      };

      const response = await request(app)
        .post("/api/planoEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send(planoData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.titulo).toBe("Novo Plano Teste");
      expect(response.body.usuarioId).toBe(segundoUsuario.id);
    });

    it("deve validar ausência de título", async () => {
      const response = await request(app)
        .post("/api/planoEstudo")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // Faltando campos obrigatórios
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/planoEstudo", () => {
    it("deve listar todos os planos de estudo", async () => {
      const response = await request(app)
        .get("/api/planoEstudo")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/planoEstudo/:id", () => {
    it("deve buscar plano de estudo por ID", async () => {
      const response = await request(app)
        .get(`/api/planoEstudo/${planoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(planoTeste.id);
      expect(response.body.titulo).toBe("Novo Plano Teste");
    });

    it("deve retornar 404 para plano de estudo inexistente", async () => {
      const response = await request(app)
        .get("/api/planoEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/planoEstudo/titulo/exact/:titulo", () => {
    it("deve buscar plano de estudo por título exato", async () => {
      const response = await request(app)
        .get(`/api/planoEstudo/titulo/exact/${encodeURIComponent(planoTeste.titulo)}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
      expect(response.body.titulo).toBe(planoTeste.titulo);
    });

    it("deve retornar 404 quando nenhum plano de estudo for encontrado", async () => {
      const response = await request(app)
        .get("/api/planoEstudo/titulo/exact/Inexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/planoEstudo/titulo/search/:titulo", () => {
    it("deve buscar planos de estudo por título parcial", async () => {
      const response = await request(app)
        .get(`/api/planoEstudo/titulo/search/${encodeURIComponent("Novo")}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some(g => g.titulo.includes("Novo"))).toBe(true);
    });

    it("deve retornar 404 quando nenhum plano de estudo for encontrado", async () => {
      const response = await request(app)
        .get("/api/planoEstudo/titulo/search/XYZInexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/planoEstudo/usuario/:usuarioId", () => {
    it("deve buscar todos os planos de estudo de um usuário específico", async () => {
      const response = await request(app)
        .get(`/api/planoEstudo/usuario/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.every(p => p.usuarioId === seedData.usuario.id)).toBe(true);
    });

    it("deve retornar array vazio quando usuário não tem planos de estudo", async () => {
      // Criar usuário sem planos
      const usuarioSemPlanos = await prisma.usuario.create({
        data: {
          nome: "Usuario",
          sobrenome: "Sem Planos",
          username: "sem_planos",
          password: await bcrypt.hash("senha123", 10),
          email: "sem_planos@example.com",
          generoUsuarioId: seedData.generoUsuario.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          cidadeId: seedData.cidade.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        },
      });

      const response = await request(app)
        .get(`/api/planoEstudo/usuario/${usuarioSemPlanos.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it("deve validar ID de usuário inválido", async () => {
      const response = await request(app)
        .get("/api/planoEstudo/usuario/abc")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.error).toMatch(/ID de usuário inválido/i);
    });
  });

  describe("PUT /api/planoEstudo/:id", () => {
    it("deve atualizar um plano de estudo existente", async () => {
      const response = await request(app)
        .put(`/api/planoEstudo/${planoTeste.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          titulo: "Plano Teste Atualizado",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.titulo).toBe("Plano Teste Atualizado");
      
      // Atualizar a referência local
      planoTeste = response.body;
    });

    it("deve retornar 404 ao atualizar plano de estudo inexistente", async () => {
      const response = await request(app)
        .put("/api/planoEstudo/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "Teste" });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("DELETE /api/planoEstudo/:id", () => {
    it("deve retornar 404 ao excluir plano de estudo inexistente", async () => {
      const response = await request(app)
        .delete("/api/planoEstudo/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve excluir uma plano de estudo existente", async () => {
      const response = await request(app)
        .delete(`/api/planoEstudo/${planoTeste.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.planoEstudo.findUnique({
        where: { id: planoTeste.id },
      });
      expect(verificacao).toBeNull();
    });
  });
});
