/**
 * Testes para rotas de Usuários
 * Endpoints: /api/usuarios
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Usuários - /api/usuarios", () => {
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

  describe("POST /api/usuarios/login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const response = await request(app)
        .post("/api/usuarios/login")
        .send({
          nomeUsuario: "admin",
          senha: "admin123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("usuario");
      expect(response.body.usuario.nomeUsuario).toBe("admin");
    });

    it("deve rejeitar login com credenciais inválidas", async () => {
      const response = await request(app)
        .post("/api/usuarios/login")
        .send({
          nomeUsuario: "admin",
          senha: "senhaerrada",
        });

      expect(response.status).toBe(401);
    });

    it("deve rejeitar login sem credenciais", async () => {
      const response = await request(app)
        .post("/api/usuarios/login")
        .send({});

      expect(response.status).toBe(400);
    });

    it("deve rejeitar login com usuário inexistente", async () => {
      const response = await request(app)
        .post("/api/usuarios/login")
        .send({
          nomeUsuario: "usuarioinexistente",
          senha: "senha123",
        });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/usuarios/logout", () => {
    it("deve fazer logout com sucesso", async () => {
      const response = await request(app)
        .post("/api/usuarios/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("sucesso");
    });

    it("deve rejeitar logout sem token", async () => {
      const response = await request(app)
        .post("/api/usuarios/logout");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/usuarios", () => {
    it("deve listar todos os usuários", async () => {
      const response = await request(app)
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve rejeitar listagem sem autenticação", async () => {
      const response = await request(app)
        .get("/api/usuarios");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/usuarios", () => {
    it("deve criar um novo usuário", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeUsuario: "vendedor1",
          nomeFuncionario: "João Vendedor",
          senha: "senha123",
          email: "vendedor1@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.nomeUsuario).toBe("vendedor1");
      expect(response.body.email).toBe("vendedor1@test.com");
    });

    it("deve rejeitar criação com email duplicado", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeUsuario: "vendedor2",
          nomeFuncionario: "Maria Vendedora",
          senha: "senha123",
          email: "admin@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        });

      expect(response.status).toBe(409);
    });

    it("deve rejeitar criação com nomeUsuario duplicado", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeUsuario: "admin",
          nomeFuncionario: "Outro Admin",
          senha: "senha123",
          email: "outroadmin@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        });

      expect(response.status).toBe(409);
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeUsuario: "incomplete",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("missingFields");
    });

    it("deve criar usuário com email válido", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeUsuario: "testuser",
          nomeFuncionario: "Test User",
          senha: "senha123",
          email: "testuser@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.email).toBe("testuser@test.com");
    });

    it("deve criar usuário com senha válida", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeUsuario: "testuser2",
          nomeFuncionario: "Test User 2",
          senha: "senha123",
          email: "test2@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.nomeUsuario).toBe("testuser2");
    });
  });

  describe("GET /api/usuarios/:id", () => {
    it("deve buscar usuário por ID", async () => {
      const response = await request(app)
        .get(`/api/usuarios/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(seedData.usuario.id);
    });

    it("deve retornar 404 para usuário inexistente", async () => {
      const response = await request(app)
        .get("/api/usuarios/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("deve validar ID inválido", async () => {
      const response = await request(app)
        .get("/api/usuarios/abc")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/usuarios/:id", () => {
    it("deve atualizar um usuário", async () => {
      const response = await request(app)
        .put(`/api/usuarios/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeFuncionario: "Admin Atualizado",
        });

      expect(response.status).toBe(200);
      expect(response.body.nomeFuncionario).toBe("Admin Atualizado");
    });

    it("deve retornar 404 ao atualizar usuário inexistente", async () => {
      const response = await request(app)
        .put("/api/usuarios/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nomeFuncionario: "Teste",
        });

      expect(response.status).toBe(404);
    });

    it("deve atualizar email do usuário", async () => {
      const response = await request(app)
        .put(`/api/usuarios/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "novoemail@test.com",
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("novoemail@test.com");
    });

    it("deve atualizar senha do usuário", async () => {
      const response = await request(app)
        .put(`/api/usuarios/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          senha: "novasenha123",
        });

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /api/usuarios/:id", () => {
    it("deve excluir um usuário", async () => {
      const newUser = await prisma.usuario.create({
        data: {
          nomeUsuario: "user_to_delete",
          nomeFuncionario: "User Delete",
          senha: "senha123",
          email: "delete@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        },
      });

      const response = await request(app)
        .delete(`/api/usuarios/${newUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const verificacao = await prisma.usuario.findUnique({
        where: { id: newUser.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar 404 ao excluir usuário inexistente", async () => {
      const response = await request(app)
        .delete("/api/usuarios/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/usuarios/nomeUsuario/:nomeUsuario", () => {
    it("deve buscar usuário por nome de usuário", async () => {
      const response = await request(app)
        .get("/api/usuarios/nomeUsuario/admin")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.nomeUsuario).toBe("admin");
      expect(response.body).not.toHaveProperty("senha");
    });

    it("deve retornar 404 para nome de usuário inexistente", async () => {
      const response = await request(app)
        .get("/api/usuarios/nomeUsuario/usuarioinexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/usuarios/nomeFuncionario/:nome", () => {
    it("deve buscar usuários por nome de funcionário", async () => {
      await prisma.usuario.create({
        data: {
          nomeUsuario: "joao123",
          nomeFuncionario: "João Silva",
          senha: "senha123",
          email: "joao@test.com",
          grupoUsuarioId: seedData.grupoAdmin.id,
        },
      });

      const response = await request(app)
        .get("/api/usuarios/nomeFuncionario/João")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar lista vazia para nome não encontrado", async () => {
      const response = await request(app)
        .get("/api/usuarios/nomeFuncionario/NomeInexistente123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe("GET /api/usuarios/email/:email", () => {
    it("deve buscar usuário por email", async () => {
      const response = await request(app)
        .get("/api/usuarios/email/admin@test.com")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("admin@test.com");
      expect(response.body).not.toHaveProperty("senha");
    });

    it("deve retornar 404 para email inexistente", async () => {
      const response = await request(app)
        .get("/api/usuarios/email/inexistente@test.com")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("deve validar formato de email", async () => {
      const response = await request(app)
        .get("/api/usuarios/email/emailinvalido")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
