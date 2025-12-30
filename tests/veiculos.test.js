/**
 * Testes para rotas de veículos
 * Endpoints: /api/veiculos
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Veículos - /api/veiculos", () => {
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

  describe("POST /api/veiculos", () => {
    it("deve criar um novo veículo com dados válidos", async () => {
      const veiculoData = {
        placa: "ABC1234",
        renavam: "12345678901",
        ano: 2023,
        marca: "Toyota",
        modelo: "Corolla",
        categoriaVeiculoId: seedData.categoriaVeiculo.id,
        cor: "Prata",
        portas: 4,
        motorizacao: "2.0",
        tipoCombustivelId: seedData.tipoCombustivel.id,
        unidadeId: seedData.unidade.id,
        tipoTransmissaoId: seedData.tipoTransmissao.id,
        tipoDirecaoId: seedData.tipoDirecao.id,
        kilometragem: 10000,
        situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
        situacaoVeiculoId: seedData.situacaoVeiculo.id,
        estadoVeiculoId: seedData.estadoVeiculo.id,
      };

      const response = await request(app)
        .post("/api/veiculos")
        .set("Authorization", `Bearer ${token}`)
        .send(veiculoData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.placa).toBe("ABC1234");
      expect(response.body.marca).toBe("Toyota");
    });

    it("deve rejeitar criação com placa duplicada", async () => {
      // First create a vehicle
      await request(app)
        .post("/api/veiculos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          placa: "DUP1234",
          renavam: "11111111111",
          ano: 2023,
          marca: "Honda",
          modelo: "Civic",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Preto",
          portas: 4,
          motorizacao: "1.8",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: seedData.unidade.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 5000,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        });

      // Try to create with duplicate placa
      const response = await request(app)
        .post("/api/veiculos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          placa: "DUP1234",
          renavam: "22222222222",
          ano: 2023,
          marca: "Honda",
          modelo: "Civic",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Preto",
          portas: 4,
          motorizacao: "1.8",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: seedData.unidade.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 5000,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("existe");
    });

    it("deve rejeitar criação sem autenticação", async () => {
      const veiculoData = {
        placa: "XYZ9999",
        renavam: "33333333333",
        ano: 2023,
        marca: "Ford",
        modelo: "Focus",
        categoriaVeiculoId: seedData.categoriaVeiculo.id,
        cor: "Azul",
        portas: 4,
        motorizacao: "1.6",
        tipoCombustivelId: seedData.tipoCombustivel.id,
        unidadeId: seedData.unidade.id,
        tipoTransmissaoId: seedData.tipoTransmissao.id,
        tipoDirecaoId: seedData.tipoDirecao.id,
        kilometragem: 0,
        situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
        situacaoVeiculoId: seedData.situacaoVeiculo.id,
        estadoVeiculoId: seedData.estadoVeiculo.id,
      };

      const response = await request(app)
        .post("/api/veiculos")
        .send(veiculoData);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/veiculos", () => {
    it("deve listar todos os veículos", async () => {
      const response = await request(app)
        .get("/api/veiculos")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data || response.body)).toBe(true);
    });

    it("deve retornar veículos com limit e offset", async () => {
      const response = await request(app)
        .get("/api/veiculos?limit=10&offset=0")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve filtrar veículos por código da unidade", async () => {
      // Criar veículos em diferentes unidades
      const unidade2 = await prisma.unidade.create({
        data: {
          nome: "Unidade 2",
          endereco: "Rua B, 200",
          cidade: "São Paulo",
          uf: "SP",
          cep: "02000-000",
          telefone1: "11999998888",
          telefone2: "11999997777",
        },
      });

      // Veículo na unidade original (seedData.unidade)
      await prisma.veiculo.create({
        data: {
          placa: "FIL1111",
          renavam: "11111111111",
          ano: 2023,
          marca: "Filtro",
          modelo: "Unidade 1",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Branco",
          portas: 4,
          motorizacao: "1.0",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: seedData.unidade.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 0,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        },
      });

      // Veículo na unidade 2
      await prisma.veiculo.create({
        data: {
          placa: "FIL2222",
          renavam: "22222222222",
          ano: 2023,
          marca: "Filtro",
          modelo: "Unidade 2",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Preto",
          portas: 4,
          motorizacao: "1.0",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: unidade2.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 0,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        },
      });

      // Filtrar por unidade 2
      const response = await request(app)
        .get(`/api/veiculos?codigoUnidade=${unidade2.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const veiculos = response.body.data || response.body;
      expect(Array.isArray(veiculos)).toBe(true);
      expect(veiculos.length).toBeGreaterThan(0);

      // Deve conter o veículo da unidade 2
      const veiculoUnidade2 = veiculos.find((v) => v.placa === "FIL2222");
      expect(veiculoUnidade2).toBeDefined();
      expect(veiculoUnidade2.modelo).toBe("Unidade 2");
      expect(veiculoUnidade2.unidadeId).toBe(unidade2.id);
    });

    it("deve retornar lista vazia com código de unidade inválido", async () => {
      const response = await request(app)
        .get("/api/veiculos?codigoUnidade=abc")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve retornar lista vazia quando nenhum veículo pertence à unidade", async () => {
      const response = await request(app)
        .get("/api/veiculos?codigoUnidade=99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const veiculos = response.body.data || response.body;
      expect(Array.isArray(veiculos)).toBe(true);
      expect(veiculos.length).toBe(0);
    });
  });

  describe("GET /api/veiculos/:id", () => {
    it("deve buscar um veículo por ID", async () => {
      // Criar um veículo primeiro
      const veiculo = await prisma.veiculo.create({
        data: {
          placa: "TEST123",
          renavam: "99999999999",
          ano: 2023,
          marca: "Teste",
          modelo: "Modelo Teste",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Verde",
          portas: 4,
          motorizacao: "1.0",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: seedData.unidade.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 0,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        },
      });

      const response = await request(app)
        .get(`/api/veiculos/${veiculo.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(veiculo.id);
      expect(response.body.placa).toBe("TEST123");
    });

    it("deve retornar 404 para veículo inexistente", async () => {
      const response = await request(app)
        .get("/api/veiculos/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/veiculos/:id", () => {
    it("deve atualizar um veículo existente", async () => {
      // Criar um veículo primeiro
      const veiculo = await prisma.veiculo.create({
        data: {
          placa: "UPD1234",
          renavam: "88888888888",
          ano: 2023,
          marca: "Marca Original",
          modelo: "Modelo Original",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Vermelho",
          portas: 4,
          motorizacao: "1.6",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: seedData.unidade.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 5000,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        },
      });

      const updateData = {
        marca: "Marca Atualizada",
        kilometragem: 10000,
      };

      const response = await request(app)
        .put(`/api/veiculos/${veiculo.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.marca).toBe("Marca Atualizada");
      expect(response.body.kilometragem).toBe(10000);
    });

    it("deve retornar 404 ao atualizar veículo inexistente", async () => {
      const response = await request(app)
        .put("/api/veiculos/99999")
        .set("Authorization", `Bearer ${token}`)
        .send({ marca: "Teste" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/veiculos/:id", () => {
    it("deve excluir um veículo existente", async () => {
      // Criar um veículo primeiro
      const veiculo = await prisma.veiculo.create({
        data: {
          placa: "DEL1234",
          renavam: "77777777777",
          ano: 2023,
          marca: "Marca Delete",
          modelo: "Modelo Delete",
          categoriaVeiculoId: seedData.categoriaVeiculo.id,
          cor: "Amarelo",
          portas: 2,
          motorizacao: "1.0",
          tipoCombustivelId: seedData.tipoCombustivel.id,
          unidadeId: seedData.unidade.id,
          tipoTransmissaoId: seedData.tipoTransmissao.id,
          tipoDirecaoId: seedData.tipoDirecao.id,
          kilometragem: 0,
          situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
          situacaoVeiculoId: seedData.situacaoVeiculo.id,
          estadoVeiculoId: seedData.estadoVeiculo.id,
        },
      });

      const response = await request(app)
        .delete(`/api/veiculos/${veiculo.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verificar que foi realmente deletado
      const verificacao = await prisma.veiculo.findUnique({
        where: { id: veiculo.id },
      });
      expect(verificacao).toBeNull();
    });

    it("deve retornar 404 ao excluir veículo inexistente", async () => {
      const response = await request(app)
        .delete("/api/veiculos/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
