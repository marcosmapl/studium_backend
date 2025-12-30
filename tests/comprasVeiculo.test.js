/**
 * Testes para rotas de compras de veículos
 * Endpoints: /api/comprasVeiculos
 */

const request = require("supertest");
const app = require("../src/app");
const {
  cleanDatabase,
  seedBasicData,
  getAuthToken,
  prisma,
} = require("./testUtils");

describe("Compras de Veículos - /api/comprasVeiculos", () => {
  let token;
  let seedData;
  let veiculo;
  let cliente;
  let fornecedor;

  beforeEach(async () => {
    await cleanDatabase();
    seedData = await seedBasicData();
    token = await getAuthToken(app);

    // Criar cliente para associar ao veículo
    cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: "Maria Santos",
        dataNascimento: new Date("1985-05-15"),
        cpf: "98765432100",
        sexo: "F",
        telefone1: "85987654321",
        email: "maria@test.com",
        endereco: "Av. Teste, 456",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
      },
    });

    // Criar fornecedor
    fornecedor = await prisma.fornecedor.create({
      data: {
        razaoSocial: "Fornecedor Teste Ltda",
        cpfCnpj: "12345678000190",
        tipo: "JURÍDICA",
        endereco: "Rua Fornecedor, 789",
        cidade: "Fortaleza",
        uf: "CE",
        cep: "60000000",
        telefone1: "8533334444",
        email: "fornecedor@test.com",
        situacao: "ATIVO",
      },
    });

    // Criar veículo
    veiculo = await prisma.veiculo.create({
      data: {
        placa: "ABC1234",
        renavam: "12345678901",
        ano: 2020,
        marca: "FIAT",
        modelo: "UNO",
        cor: "BRANCO",
        portas: 4,
        motorizacao: "1.0",
        kilometragem: 50000,
        categoriaVeiculoId: seedData.categoriaVeiculo.id,
        clienteId: cliente.id,
        estadoVeiculoId: seedData.estadoVeiculo.id,
        situacaoLicenciamentoId: seedData.situacaoLicenciamento.id,
        situacaoVeiculoId: seedData.situacaoVeiculo.id,
        tipoCombustivelId: seedData.tipoCombustivel.id,
        tipoDirecaoId: seedData.tipoDirecao.id,
        tipoTransmissaoId: seedData.tipoTransmissao.id,
        unidadeId: seedData.unidade.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve listar todas as compras de veículos", async () => {
    // Criar uma compra primeiro
    await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const response = await request(app)
      .get("/api/comprasVeiculos?limit=0&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("deve criar uma nova compra de veículo com dados completos", async () => {
    const compraData = {
      veiculoId: veiculo.id,
      fornecedorId: fornecedor.id,
      unidadeId: seedData.unidade.id,
      dataCompra: new Date("2024-01-15").toISOString(),
      dataEntrega: new Date("2024-01-20").toISOString(),
      valorCompra: 35000.0,
      tipoCompraId: seedData.tipoCompra.id,
      custoAquisicao: 35000.0,
      custoOficina: 2000.0,
      custoEstetica: 1500.0,
      outrosCustos: 500.0,
      taxaTransferencia: 300.0,
      taxaLeilao: 0.0,
      outrasTaxas: 200.0,
      valorAvaliado: 40000.0,
      situacaoCompraId: seedData.situacaoCompra.id,
      observacoes: "Compra realizada em leilão",
    };

    const response = await request(app)
      .post("/api/comprasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send(compraData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.veiculoId).toBe(veiculo.id);
    expect(response.body.fornecedorId).toBe(fornecedor.id);
    expect(parseFloat(response.body.valorCompra)).toBe(35000.0);
    expect(parseFloat(response.body.custoOficina)).toBe(2000.0);
    expect(parseFloat(response.body.valorAvaliado)).toBe(40000.0);
  });

  it("deve criar uma nova compra de veículo com dados mínimos", async () => {
    const compraData = {
      veiculoId: veiculo.id,
      fornecedorId: fornecedor.id,
      unidadeId: seedData.unidade.id,
      dataCompra: new Date("2024-01-15").toISOString(),
      valorCompra: 30000.0,
      tipoCompraId: seedData.tipoCompra.id,
      custoAquisicao: 30000.0,
      valorAvaliado: 32000.0,
      situacaoCompraId: seedData.situacaoCompra.id,
    };

    const response = await request(app)
      .post("/api/comprasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send(compraData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.veiculoId).toBe(veiculo.id);
    expect(parseFloat(response.body.custoOficina)).toBe(0.0);
    expect(parseFloat(response.body.custoEstetica)).toBe(0.0);
  });

  it("deve rejeitar criação sem veiculoId", async () => {
    const compraData = {
      fornecedorId: fornecedor.id,
      unidadeId: seedData.unidade.id,
      dataCompra: new Date("2024-01-15").toISOString(),
      valorCompra: 30000.0,
      tipoCompraId: seedData.tipoCompra.id,
      custoAquisicao: 30000.0,
      valorAvaliado: 32000.0,
      situacaoCompraId: seedData.situacaoCompra.id,
    };

    const response = await request(app)
      .post("/api/comprasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send(compraData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("missingFields");
    expect(response.body.missingFields).toContain("veiculoId");
  });

  it("deve rejeitar criação sem fornecedorId", async () => {
    const compraData = {
      veiculoId: veiculo.id,
      unidadeId: seedData.unidade.id,
      dataCompra: new Date("2024-01-15").toISOString(),
      valorCompra: 30000.0,
      tipoCompraId: seedData.tipoCompra.id,
      custoAquisicao: 30000.0,
      valorAvaliado: 32000.0,
      situacaoCompraId: seedData.situacaoCompra.id,
    };

    const response = await request(app)
      .post("/api/comprasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send(compraData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("missingFields");
    expect(response.body.missingFields).toContain("fornecedorId");
  });

  it("deve rejeitar criação sem dataCompra", async () => {
    const compraData = {
      veiculoId: veiculo.id,
      fornecedorId: fornecedor.id,
      unidadeId: seedData.unidade.id,
      valorCompra: 30000.0,
      tipoCompraId: seedData.tipoCompra.id,
      custoAquisicao: 30000.0,
      valorAvaliado: 32000.0,
      situacaoCompraId: seedData.situacaoCompra.id,
    };

    const response = await request(app)
      .post("/api/comprasVeiculos")
      .set("Authorization", `Bearer ${token}`)
      .send(compraData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("missingFields");
    expect(response.body.missingFields).toContain("dataCompra");
  });





  it("deve buscar uma compra de veículo por ID", async () => {
    const compra = await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const response = await request(app)
      .get(`/api/comprasVeiculos/${compra.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(compra.id);
    expect(response.body.veiculoId).toBe(veiculo.id);
  });

  it("deve retornar 404 ao buscar compra inexistente", async () => {
    const response = await request(app)
      .get("/api/comprasVeiculos/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado(a)");
  });

  it("deve buscar compras por veiculoId", async () => {
    await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const response = await request(app)
      .get(`/api/comprasVeiculos/veiculo/${veiculo.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].veiculoId).toBe(veiculo.id);
  });

  it("deve buscar compras por fornecedorId", async () => {
    await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const response = await request(app)
      .get(`/api/comprasVeiculos/fornecedor/${fornecedor.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].fornecedorId).toBe(fornecedor.id);
  });

  it("deve buscar compras por unidadeId", async () => {
    await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const response = await request(app)
      .get(`/api/comprasVeiculos/unidade/${seedData.unidade.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].unidadeId).toBe(seedData.unidade.id);
  });

  it("deve atualizar uma compra de veículo", async () => {
    const compra = await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const updateData = {
      valorCompra: 36000.0,
      custoOficina: 2500.0,
      valorAvaliado: 40000.0,
      observacoes: "Valor atualizado após revisão",
    };

    const response = await request(app)
      .put(`/api/comprasVeiculos/${compra.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(parseFloat(response.body.valorCompra)).toBe(36000.0);
    expect(parseFloat(response.body.custoOficina)).toBe(2500.0);
    expect(parseFloat(response.body.valorAvaliado)).toBe(40000.0);
    expect(response.body.observacoes).toBe("Valor atualizado após revisão");
  });

  it("deve retornar 404 ao atualizar compra inexistente", async () => {
    const updateData = {
      valorCompra: 36000.0,
    };

    const response = await request(app)
      .put("/api/comprasVeiculos/99999")
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado(a)");
  });

  it("deve excluir uma compra de veículo", async () => {
    const compra = await prisma.compraVeiculo.create({
      data: {
        veiculoId: veiculo.id,
        fornecedorId: fornecedor.id,
        unidadeId: seedData.unidade.id,
        dataCompra: new Date("2024-01-15"),
        valorCompra: 35000.0,
        tipoCompraId: seedData.tipoCompra.id,
        custoAquisicao: 35000.0,
        valorAvaliado: 38000.0,
        situacaoCompraId: seedData.situacaoCompra.id,
      },
    });

    const response = await request(app)
      .delete(`/api/comprasVeiculos/${compra.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    // Verificar se foi realmente excluída
    const compraExcluida = await prisma.compraVeiculo.findUnique({
      where: { id: compra.id },
    });
    expect(compraExcluida).toBeNull();
  });

  it("deve retornar 404 ao excluir compra inexistente", async () => {
    const response = await request(app)
      .delete("/api/comprasVeiculos/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado(a)");
  });

  it("deve rejeitar requisições sem autenticação", async () => {
    const response = await request(app).get("/api/comprasVeiculos");

    expect(response.status).toBe(401);
  });

  it("deve suportar limit e offset na listagem", async () => {
    // Criar múltiplas compras
    for (let i = 0; i < 5; i++) {
      await prisma.compraVeiculo.create({
        data: {
          veiculoId: veiculo.id,
          fornecedorId: fornecedor.id,
          unidadeId: seedData.unidade.id,
          dataCompra: new Date(`2024-01-${15 + i}`),
          valorCompra: 30000.0 + i * 1000,
          tipoCompraId: seedData.tipoCompra.id,
          custoAquisicao: 30000.0 + i * 1000,
          valorAvaliado: 32000.0 + i * 1000,
          situacaoCompraId: seedData.situacaoCompra.id,
        },
      });
    }

    const response = await request(app)
      .get("/api/comprasVeiculos?limit=3&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(3);
  });
});
