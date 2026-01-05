# Studium - Frontend

Sistema de Gestão e Planejamento de Estudos desenvolvido com Vite, React e Tailwind CSS.

## 🚀 Tecnologias

- **Vite** - Build tool e dev server
- **React** - Biblioteca JavaScript para interfaces
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend do Studium rodando em http://localhost:3000

## 🔧 Instalação

1. Clone o repositório (se ainda não fez):
```bash
git clone <url-do-repositorio>
cd studium/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário para ajustar a URL da API.

## 🎯 Executando o projeto

### Modo desenvolvimento
```bash
npm run dev
```

O aplicativo estará disponível em http://localhost:5173

### Build para produção
```bash
npm run build
```

### Preview da build de produção
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   └── PrivateRoute.jsx
├── contexts/        # Contextos React (gerenciamento de estado)
│   └── AuthContext.jsx
├── pages/          # Páginas da aplicação
│   ├── Login.jsx
│   └── Dashboard.jsx
├── services/       # Serviços de API
│   ├── api.js
│   └── authService.js
├── App.jsx         # Componente principal
├── index.css       # Estilos globais (Tailwind)
└── main.jsx        # Entry point
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:

1. O usuário faz login com usuário e senha
2. O backend retorna um token JWT
3. O token é armazenado no localStorage
4. Todas as requisições subsequentes incluem o token no header Authorization
5. Rotas protegidas verificam a presença do token

## 🎨 Funcionalidades Implementadas

- ✅ Tela de login centralizada e responsiva
- ✅ Integração com API de autenticação do backend
- ✅ Sistema de notificações (toast)
- ✅ Rotas protegidas (PrivateRoute)
- ✅ Dashboard básico
- ✅ Logout com limpeza de sessão
- ✅ Tratamento de erros (401, 403)
- ✅ Loading states

## 🔄 Próximas Funcionalidades

- ⏳ Recuperação de senha
- ⏳ Cadastro de usuários
- ⏳ Gerenciamento de planejamentos
- ⏳ Sessões de estudo
- ⏳ Sistema de revisões
- ⏳ Estatísticas e relatórios

## 🐛 Troubleshooting

### O login não funciona
- Verifique se o backend está rodando em http://localhost:3000
- Verifique as credenciais no banco de dados
- Abra o console do navegador para ver erros detalhados

### Erro de CORS
- Certifique-se de que o backend está configurado para aceitar requisições do frontend
- Verifique se as URLs estão corretas no arquivo `.env`

## 📝 Licença

Este projeto está sob a mesma licença do backend Studium.

