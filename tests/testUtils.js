/**
 * Utilitários para testes
 */

const request = require("supertest");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Limpa tabelas do banco de dados de teste
 * Deve ser usado com cuidado, apenas em ambiente de teste
 */
const cleanDatabase = async () => {
  // Desabilitar verificação de chaves estrangeiras temporariamente
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

  // Limpar tabelas na ordem correta para respeitar foreign keys
  await prisma.vendaVeiculo.deleteMany();
  await prisma.compraVeiculo.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.fornecedor.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.grupoUsuario.deleteMany();
  await prisma.unidade.deleteMany();

  // Limpar tabelas de referência
  await prisma.tipoVenda.deleteMany();
  await prisma.situacaoVenda.deleteMany();
  await prisma.tipoCombustivel.deleteMany();
  await prisma.categoriaVeiculo.deleteMany();
  await prisma.tipoTransmissao.deleteMany();
  await prisma.tipoDirecao.deleteMany();
  await prisma.situacaoLicenciamento.deleteMany();
  await prisma.situacaoVeiculo.deleteMany();
  await prisma.estadoVeiculo.deleteMany();
  await prisma.tipoCompra.deleteMany();
  await prisma.situacaoCompra.deleteMany();
  await prisma.categoriaAtendimento.deleteMany();

  // Reabilitar verificação de chaves estrangeiras
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
};

/**
 * Cria dados de seed básicos para testes
 */
const seedBasicData = async () => {
  // Criar grupo de usuário
  const grupoAdmin = await prisma.grupoUsuario.create({
    data: {
      nome: "Administradores",
      descricao: "Usuários com acesso total",
    },
  });

  // Criar usuário admin para testes
  const usuario = await prisma.usuario.create({
    data: {
      nomeUsuario: "admin",
      nomeFuncionario: "Admin Teste",
      senha: "admin123",
      email: "admin@test.com",
      grupoUsuarioId: grupoAdmin.id,
    },
  });

  // Criar tipos básicos
  const tipoCombustivel = await prisma.tipoCombustivel.create({
    data: { descricao: "FLEX" },
  });

  const categoriaVeiculo = await prisma.categoriaVeiculo.create({
    data: { descricao: "SEDÃ" },
  });

  const tipoTransmissao = await prisma.tipoTransmissao.create({
    data: { descricao: "AUTOMÁTICA" },
  });

  const tipoDirecao = await prisma.tipoDirecao.create({
    data: { descricao: "ELÉTRICA" },
  });

  const situacaoLicenciamento = await prisma.situacaoLicenciamento.create({
    data: { descricao: "REGULAR" },
  });

  const situacaoVeiculo = await prisma.situacaoVeiculo.create({
    data: { descricao: "DISPONÍVEL" },
  });

  const estadoVeiculo = await prisma.estadoVeiculo.create({
    data: { descricao: "USADO" },
  });

  const tipoCompra = await prisma.tipoCompra.create({
    data: { descricao: "COMPRA DIRETA" },
  });

  const situacaoCompra = await prisma.situacaoCompra.create({
    data: { descricao: "CONCLUÍDA" },
  });

  // Criar unidade
  const unidade = await prisma.unidade.create({
    data: {
      nome: "Unidade Teste",
      endereco: "Rua Teste, 123",
      cidade: "Cidade Teste",
      uf: "CE",
      cep: "60000000",
      telefone1: "8512345678",
      telefone2: "8587654321",
    },
  });

  return {
    grupoAdmin,
    usuario,
    tipoCombustivel,
    categoriaVeiculo,
    tipoTransmissao,
    tipoDirecao,
    situacaoLicenciamento,
    situacaoVeiculo,
    estadoVeiculo,
    tipoCompra,
    situacaoCompra,
    unidade,
  };
};

/**
 * Gera um token JWT para testes autenticados
 */
const getAuthToken = async (app) => {
  const response = await request(app).post("/api/usuarios/login").send({
    nomeUsuario: "admin",
    senha: "admin123",
  });

  return response.body.token;
};

module.exports = {
  prisma,
  cleanDatabase,
  seedBasicData,
  getAuthToken,
};
