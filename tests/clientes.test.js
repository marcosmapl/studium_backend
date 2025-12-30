/**
 * Testes para rotas de clientes
 * Endpoints: /api/clientes
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Clientes - /api/clientes", () => {
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

  it("deve listar todos os clientes", async () => {
    const response = await request(app)
      .get("/api/clientes?limit=0&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve criar um novo cliente", async () => {
    const clienteData = {
      nomeCompleto: "João Silva",
      dataNascimento: new Date("1990-01-01"),
      cpf: "12345678901",
      cnh: "12345678900",
      sexo: "M",
      telefone1: "85912345678",
      email: "joao@test.com",
      endereco: "Rua Teste, 123",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
    };

    const response = await request(app)
      .post("/api/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send(clienteData);

    expect(response.status).toBe(201);
    expect(response.body.nomeCompleto).toBe("João Silva");
    expect(response.body.cpf).toBe("12345678901");
  });

  it("deve rejeitar criação com CPF duplicado", async () => {
    // Primeiro, criar um cliente
    const primeiroCliente = {
      nomeCompleto: "João Silva",
      dataNascimento: new Date("1990-01-01"),
      cpf: "12345678901",
      sexo: "M",
      telefone1: "85912345678",
      email: "joao@test.com",
      endereco: "Rua Teste, 123",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
    };

    await request(app)
      .post("/api/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send(primeiroCliente);

    // Tentar criar outro cliente com mesmo CPF
    const clienteData = {
      nomeCompleto: "Maria Santos",
      dataNascimento: new Date("1985-05-15"),
      cpf: "12345678901", // CPF duplicado
      sexo: "F",
      telefone1: "85987654321",
      email: "maria@test.com",
      endereco: "Rua Teste, 456",
      cidade: "Fortaleza",
      uf: "CE",
      cep: "60000000",
    };

    const response = await request(app)
      .post("/api/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send(clienteData);

    expect(response.status).toBe(409);
  });

  it("deve buscar cliente por ID", async () => {
    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: "Cliente Teste",
        dataNascimento: new Date("1992-03-10"),
        cpf: "98765432100",
        sexo: "M",
        telefone1: "85999887766",
        email: "cliente@test.com",
        endereco: "Rua Teste",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
      },
    });

    const response = await request(app)
      .get(`/api/clientes/${cliente.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(cliente.id);
  });

  it("deve atualizar um cliente", async () => {
    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: "Cliente Update",
        dataNascimento: new Date("1988-07-20"),
        cpf: "11122233344",
        sexo: "F",
        telefone1: "85988776655",
        email: "update@test.com",
        endereco: "Rua Update",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
      },
    });

    const response = await request(app)
      .put(`/api/clientes/${cliente.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nomeCompleto: "Cliente Atualizado",
        telefone1: "85911112222",
      });

    expect(response.status).toBe(200);
    expect(response.body.nomeCompleto).toBe("Cliente Atualizado");
  });

  it("deve excluir um cliente", async () => {
    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: "Cliente Delete",
        dataNascimento: new Date("1995-12-25"),
        cpf: "55566677788",
        sexo: "M",
        telefone1: "85977665544",
        email: "delete@test.com",
        endereco: "Rua Delete",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
      },
    });

    const response = await request(app)
      .delete(`/api/clientes/${cliente.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 para cliente inexistente", async () => {
    const response = await request(app)
      .get("/api/clientes/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("deve validar campos obrigatórios na criação", async () => {
    const response = await request(app)
      .post("/api/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nomeCompleto: "Cliente Incompleto",
        // Faltando campos obrigatórios
      });

    expect(response.status).toBe(400);
  });
});
