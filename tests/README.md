# Testes Automatizados - Studium Backend

Este documento descreve a estrutura e execução dos testes automatizados da API.

## Estrutura dos Testes

```
tests/
├── setup.js                        # Configuração global dos testes
├── testUtils.js                    # Utilitários para testes (seed, cleanup, auth)
├── auth.test.js                    # Testes de autenticação (login/logout)
├── health.test.js                  # Testes de health check
├── usuarios.test.js                # Testes de usuários e grupos
└── unidadesFederativas.test.js     # Testes de unidades
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

### ✅ Usuários e Grupos
- CRUD de grupos de usuário
- CRUD de usuários
- Validação de email duplicado
- Validação de autenticação

### ✅ UnidadesFederativas
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
DATABASE_URL="mysql://usuario:senha@localhost:3306/studium_db"
JWT_SECRET="seu_secret_de_teste"
JWT_EXPIRATION="1h"
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
