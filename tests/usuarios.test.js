/**
 * Testes para rotas de Usuários
 * Endpoints: /api/usuario
 */

const request = require("supertest");
const app = require("../src/app");
const HttpStatus = require("../src/utils/httpStatus");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Usuários - /api/usuario", () => {
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

  describe("GET /api/usuario", () => {
    it("deve listar todos os usuários", async () => {
      const response = await request(app)
        .get("/api/usuario")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve rejeitar listagem sem autenticação", async () => {
      const response = await request(app)
        .get("/api/usuario");

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("POST /api/usuario", () => {
    it("deve criar um novo usuário", async () => {
      const response = await request(app)
        .post("/api/usuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "vendedor1",
          nome: "João",
          sobrenome: "Vendedor",
          password: "senha123",
          email: "vendedor1@test.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.username).toBe("vendedor1");
      expect(response.body.email).toBe("vendedor1@test.com");
    });

    it("deve rejeitar criação com email duplicado", async () => {
      const response = await request(app)
        .post("/api/usuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "vendedor2",
          nome: "Maria",
          sobrenome: "Vendedora",
          password: "senha123",
          email: "teste@studium.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        });

      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it("deve rejeitar criação com username duplicado", async () => {
      const response = await request(app)
        .post("/api/usuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "teste",
          nome: "Outro",
          sobrenome: "Usuario",
          password: "senha123",
          email: "outrousuario@test.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        });

      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it("deve validar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/usuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "incomplete",
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty("missingFields");
    });

    it("deve criar usuário com email válido", async () => {
      const response = await request(app)
        .post("/api/usuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "testuser",
          nome: "Test",
          sobrenome: "User",
          password: "senha123",
          email: "testuser@test.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.email).toBe("testuser@test.com");
    });

    it("deve criar usuário com senha válida", async () => {
      const response = await request(app)
        .post("/api/usuario")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "testuser2",
          nome: "Test",
          sobrenome: "User 2",
          password: "senha123",
          email: "test2@test.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.username).toBe("testuser2");
    });
  });

  describe("GET /api/usuario/:id", () => {
    it("deve buscar usuário por ID", async () => {
      const response = await request(app)
        .get(`/api/usuario/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(seedData.usuario.id);
    });

    it("deve retornar 404 para usuário inexistente", async () => {
      const response = await request(app)
        .get("/api/usuario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve validar ID inválido", async () => {
      const response = await request(app)
        .get("/api/usuario/abc")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe("PUT /api/usuario/:id", () => {
    it("deve atualizar um usuário", async () => {
      const response = await request(app)
        .put(`/api/usuario/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Admin",
          sobrenome: "Atualizado",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.nome).toBe("Admin");
      expect(response.body.sobrenome).toBe("Atualizado");
    });

    it("deve retornar 404 ao atualizar usuário inexistente", async () => {
      const response = await request(app)
        .put("/api/usuario/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Teste",
        });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve atualizar email do usuário", async () => {
      const response = await request(app)
        .put(`/api/usuario/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "novoemail@test.com",
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.email).toBe("novoemail@test.com");
    });

    it("deve atualizar senha do usuário", async () => {
      const response = await request(app)
        .put(`/api/usuario/${seedData.usuario.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "novasenha123",
        });

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe("DELETE /api/usuario/:id", () => {
    it("deve excluir um usuário", async () => {
      const newUser = await prisma.usuario.create({
        data: {
          username: "user_to_delete",
          nome: "User",
          sobrenome: "Delete",
          password: "senha123",
          email: "delete@test.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        },
      });

      const response = await request(app)
        .delete(`/api/usuario/${newUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const verificacao = await prisma.usuario.findUnique({
        where: { id: newUser.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar 404 ao excluir usuário inexistente", async () => {
      const response = await request(app)
        .delete("/api/usuario/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/usuario/username/:username", () => {
    it("deve buscar usuário por nome de usuário", async () => {
      const response = await request(app)
        .get("/api/usuario/username/teste")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.username).toBe("teste");
      expect(response.body).not.toHaveProperty("password");
    });

    it("deve retornar 404 para nome de usuário inexistente", async () => {
      const response = await request(app)
        .get("/api/usuario/username/usuarioinexistente")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/usuario/nome/:nome", () => {
    it("deve buscar usuários por nome", async () => {
      await prisma.usuario.create({
        data: {
          username: "joao123",
          nome: "João",
          sobrenome: "Silva",
          password: "senha123",
          email: "joao@test.com",
          generoUsuarioId: seedData.generoUsuario.id,
          cidadeId: seedData.cidade.id,
          situacaoUsuarioId: seedData.situacaoUsuario.id,
          grupoUsuarioId: seedData.grupoUsuario.id,
        },
      });

      const response = await request(app)
        .get("/api/usuario/nome/João")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar lista vazia para nome não encontrado", async () => {
      const response = await request(app)
        .get("/api/usuario/nome/NomeInexistente123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe("GET /api/usuario/email/:email", () => {
    it("deve buscar usuário por email", async () => {
      const response = await request(app)
        .get("/api/usuario/email/teste@studium.com")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.email).toBe("teste@studium.com");
      expect(response.body).not.toHaveProperty("password");
    });

    it("deve retornar 404 para email inexistente", async () => {
      const response = await request(app)
        .get("/api/usuario/email/inexistente@test.com")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it("deve validar formato de email", async () => {
      const response = await request(app)
        .get("/api/usuario/email/emailinvalido")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
