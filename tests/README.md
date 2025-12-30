# Testes Automatizados - SIGA Backend

Este documento descreve a estrutura e execução dos testes automatizados da API.

## Estrutura dos Testes

```
tests/
├── setup.js                      # Configuração global dos testes
├── testUtils.js                  # Utilitários para testes (seed, cleanup, auth)
├── auth.test.js                  # Testes de autenticação (login/logout)
├── health.test.js                # Testes de health check
├── veiculos.test.js             # Testes CRUD de veículos
├── auxiliares.test.js           # Testes de rotas auxiliares (combustível, categoria, etc)
├── usuarios.test.js             # Testes de usuários e grupos
├── clientes-fornecedores.test.js # Testes de clientes e fornecedores
├── compras.test.js              # Testes de compras de veículos
└── unidades.test.js             # Testes de unidades
```

## Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (reexecuta ao salvar)
```bash
npm run test:watch
```

### Executar testes com coverage (cobertura de código)
```bash
npm run test:coverage
```

## Cobertura de Testes

Os testes cobrem:

### ✅ Autenticação
- Login com credenciais válidas
- Rejeição de credenciais inválidas
- Logout com token válido
- Validação de campos obrigatórios

### ✅ Veículos (CRUD completo)
- Listar veículos com paginação
- Criar veículo com validações
- Buscar veículo por ID
- Atualizar veículo
- Excluir veículo
- Validação de placa duplicada

### ✅ Rotas Auxiliares
- Tipos de Combustível
- Categorias de Veículo
- Tipos de Transmissão
- Tipos de Direção
- Situações de Licenciamento
- Situações de Veículo
- Estados de Veículo

### ✅ Usuários e Grupos
- CRUD de grupos de usuário
- CRUD de usuários
- Validação de email duplicado
- Validação de autenticação

### ✅ Clientes
- CRUD completo de clientes
- Validação de CPF duplicado
- Paginação e filtros

### ✅ Fornecedores
- CRUD completo de fornecedores
- Validação de CNPJ duplicado
- Paginação e filtros

### ✅ Compras de Veículos
- CRUD completo de compras
- Tipos de compra
- Situações de compra
- Validação de campos obrigatórios
- Relacionamentos com veículos e fornecedores

### ✅ Unidades
- CRUD completo de unidades
- Validação de campos obrigatórios

### ✅ Health Check
- Status da API
- Rota raiz

## Tecnologias Utilizadas

- **Jest**: Framework de testes JavaScript
- **Supertest**: Biblioteca para testar APIs HTTP
- **Prisma**: ORM para interação com banco de dados nos testes

## Configuração

Os testes utilizam o mesmo banco de dados configurado no `.env`. Recomenda-se usar um banco de dados separado para testes.

### Variáveis de Ambiente para Testes

Crie um arquivo `.env.test` com:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/siga_db_test"
JWT_SECRET="seu_secret_de_teste"
JWT_EXPIRATION="1h"
```

## Boas Práticas

1. **Isolamento**: Cada suite de testes limpa e prepara o banco de dados
2. **Independência**: Testes não dependem de ordem de execução
3. **Cleanup**: Dados são limpos após cada suite
4. **Autenticação**: Testes que necessitam autenticação obtêm token automaticamente
5. **Assertions**: Testes verificam status HTTP, estrutura de resposta e dados

## Exemplos de Teste

### Teste de Criação
```javascript
it('deve criar um novo veículo com dados válidos', async () => {
  const response = await request(app)
    .post('/api/veiculos')
    .set('Authorization', `Bearer ${token}`)
    .send(veiculoData);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
});
```

### Teste de Validação
```javascript
it('deve rejeitar criação com placa duplicada', async () => {
  const response = await request(app)
    .post('/api/veiculos')
    .set('Authorization', `Bearer ${token}`)
    .send({ placa: 'ABC1234', ... });

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message');
});
```

## Troubleshooting

### Erro de conexão com banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão com `npm run check-db`

### Timeouts
- Aumente o timeout em `jest.config.js`
- Verifique a performance do banco de dados

### Falhas intermitentes
- Verifique se há conflitos de dados entre testes
- Confirme que o cleanup está funcionando corretamente
