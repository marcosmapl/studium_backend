/**
 * Testes para rotas de fornecedores
 * Endpoints: /api/fornecedores
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Fornecedores - /api/fornecedores", () => {
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

  it("deve listar todos os fornecedores", async () => {
    const response = await request(app)
      .get("/api/fornecedores?limit=0&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar um novo fornecedor", async () => {
    const fornecedorData = {
      razaoSocial: "Fornecedor Teste Ltda",
      cpfCnpj: "12345678000190",
      tipo: "PJ",
      endereco: "Av. Teste, 1000",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
      telefone1: "8532221100",
      email: "fornecedor@test.com",
      situacao: "ATIVO",
    };

    const response = await request(app)
      .post("/api/fornecedores")
      .set("Authorization", `Bearer ${token}`)
      .send(fornecedorData);

    expect(response.status).toBe(201);
    expect(response.body.razaoSocial).toBe("Fornecedor Teste Ltda");
    expect(response.body.cpfCnpj).toBe("12345678000190");
  });

  it("deve rejeitar criação com CNPJ duplicado", async () => {
    // Primeiro, criar um fornecedor
    const primeiroFornecedor = {
      razaoSocial: "Fornecedor Original",
      cpfCnpj: "12345678000190",
      tipo: "PJ",
      endereco: "Av. Original, 100",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
      telefone1: "8532221100",
      email: "original@test.com",
      situacao: "ATIVO",
    };

    await request(app)
      .post("/api/fornecedores")
      .set("Authorization", `Bearer ${token}`)
      .send(primeiroFornecedor);

    // Tentar criar outro fornecedor com mesmo CNPJ
    const fornecedorData = {
      razaoSocial: "Outro Fornecedor",
      cpfCnpj: "12345678000190", // CNPJ duplicado
      tipo: "PJ",
      endereco: "Rua Outro",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
      telefone1: "8533334444",
      email: "outro@test.com",
      situacao: "ATIVO",
    };

    const response = await request(app)
      .post("/api/fornecedores")
      .set("Authorization", `Bearer ${token}`)
      .send(fornecedorData);

    expect(response.status).toBe(409);
  });

  it("deve buscar fornecedor por ID", async () => {
    const fornecedor = await prisma.fornecedor.create({
      data: {
        razaoSocial: "Fornecedor Get",
        cpfCnpj: "98765432000111",
        tipo: "PJ",
        endereco: "Av. Get",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
        telefone1: "8544445555",
        email: "get@test.com",
        situacao: "ATIVO",
      },
    });

    const response = await request(app)
      .get(`/api/fornecedores/${fornecedor.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(fornecedor.id);
  });

  it("deve atualizar um fornecedor", async () => {
    const fornecedor = await prisma.fornecedor.create({
      data: {
        razaoSocial: "Fornecedor Update",
        cpfCnpj: "11122233000144",
        tipo: "PJ",
        endereco: "Av. Update",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
        telefone1: "8555556666",
        email: "update.fornecedor@test.com",
        situacao: "ATIVO",
      },
    });

    const response = await request(app)
      .put(`/api/fornecedores/${fornecedor.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        razaoSocial: "Fornecedor Atualizado",
        situacao: "INATIVO",
      });

    expect(response.status).toBe(200);
    expect(response.body.razaoSocial).toBe("Fornecedor Atualizado");
    expect(response.body.situacao).toBe("INATIVO");
  });

  it("deve excluir um fornecedor", async () => {
    const fornecedor = await prisma.fornecedor.create({
      data: {
        razaoSocial: "Fornecedor Delete",
        cpfCnpj: "33344455000166",
        tipo: "PJ",
        endereco: "Av. Delete",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
        telefone1: "8566667777",
        email: "delete.fornecedor@test.com",
        situacao: "ATIVO",
      },
    });

    const response = await request(app)
      .delete(`/api/fornecedores/${fornecedor.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 para fornecedor inexistente", async () => {
    const response = await request(app)
      .get("/api/fornecedores/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("deve validar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/api/fornecedores")
      .set("Authorization", `Bearer ${token}`)
      .send({
        razaoSocial: "Fornecedor Incompleto",
        // Faltando campos obrigatórios
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("missingFields");
  });

  it("deve criar fornecedor pessoa física", async () => {
    const fornecedorData = {
      razaoSocial: "João Silva",
      cpfCnpj: "12345678900",
      tipo: "PF",
      endereco: "Rua PF, 100",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
      telefone1: "8599998888",
      email: "pf@test.com",
      situacao: "ATIVO",
    };

    const response = await request(app)
      .post("/api/fornecedores")
      .set("Authorization", `Bearer ${token}`)
      .send(fornecedorData);

    expect(response.status).toBe(201);
    expect(response.body.tipo).toBe("PF");
  });
});
