# Estrutura do Schema Prisma

## Organização dos Arquivos

### schema.prisma
Arquivo principal que contém:
- Configuração do generator e datasource
- Todos os enums (mantidos aqui para compatibilidade com o Prisma)
- Todos os models

### enums.prisma
Arquivo de referência que contém a definição de todos os enums do sistema. Este arquivo serve como:
- Documentação centralizada dos enums
- Facilita a visualização e manutenção dos tipos enumerados
- Referência rápida para desenvolvimento

**Nota:** Os enums também precisam estar no `schema.prisma` pois o Prisma CLI requer todas as definições no arquivo principal.

## Enums Disponíveis

- **UnidadeFederativa**: Estados brasileiros (UF)
- **GeneroUsuario**: Gênero do usuário (FEMININO, MASCULINO, OUTRO)
- **SituacaoUsuario**: Status do usuário (ATIVO, BLOQUEADO, INATIVO, SUSPENSO)
- **CategoriaSessao**: Tipo de sessão de estudo (TEORIA, REVISAO, RESOLUCAO_QUESTOES, LEITURA, OUTROS)
- **SituacaoSessao**: Status da sessão (AGENDADA, CANCELADA, EM_ANDAMENTO, PAUSADA, CONCLUIDA)
- **SituacaoRevisao**: Status da revisão (AGENDADA, CANCELADA, EM_ANDAMENTO, PAUSADA, CONCLUIDA)
- **SituacaoPlano**: Status do plano de estudo (NOVO, EM_ANDAMENTO, PAUSADO, CANCELADO, CONCLUIDO)

## Comandos Úteis

```bash
# Gerar o Prisma Client após alterações
npm run generate

# Criar uma nova migration
npm run migrate

# Visualizar os dados no Prisma Studio
npx prisma studio
```
