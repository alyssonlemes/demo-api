# Demo API

API modular em Node.js, TypeScript e Prisma (PostgreSQL), com autenticação JWT e CRUD de usuários. Cada domínio fica em `src/modules`. Para adicionar um recurso novo, crie a pasta do módulo e registre uma linha em `src/modules/index.ts`.

## Subir localmente

Requisitos: Node.js 20+ e Docker.

```bash
npm install
npm run db:setup
npm run dev
```

A API sobe em `http://localhost:3333`. O Postgres do Docker fica na porta **5435**, para não esbarrar nas instalações locais que já usam 5432–5434.

`db:setup` sobe o Postgres, aplica as migrations e cria os usuários de demonstração.

| E-mail | Senha | Papel |
| --- | --- | --- |
| admin@demo.com | admin123 | ADMIN |
| user@demo.com | user123 | USER |

Se o Postgres já estiver rodando em outro lugar, ajuste `DATABASE_URL` no `.env` e rode apenas:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

## Rotas

Base: `http://localhost:3333/api`

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| GET | `/health` | não | Saúde da API (fora do prefixo `/api`) |
| POST | `/auth/register` | não | Cria usuário e devolve JWT |
| POST | `/auth/login` | não | Login e JWT |
| GET | `/auth/me` | sim | Usuário autenticado |
| GET | `/users` | sim | Lista paginada (`page`, `limit`, `search`) |
| GET | `/users/:id` | sim | Detalhe |
| PATCH | `/users/:id` | sim | Atualiza a si mesmo; admin atualiza qualquer um e pode mudar `role` |
| DELETE | `/users/:id` | sim | Remove a si mesmo; admin remove qualquer um |

Header autenticado: `Authorization: Bearer <token>`

Exemplo de login:

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@demo.com\",\"password\":\"admin123\"}"
```

## Como adicionar um módulo

1. Crie `src/modules/<nome>/` com controller, service, repository, schema e module.
2. Exporte um `AppModule` (`name`, `path`, `router`).
3. Inclua o módulo no array de `src/modules/index.ts`.

O módulo passa a responder em `/api/<path>` sem alterar o bootstrap da aplicação.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe a API em modo watch |
| `npm run build` | Compila para `dist/` |
| `npm start` | Roda o build |
| `npm run db:up` | Sobe só o Postgres |
| `npm run db:migrate` | Aplica migrations |
| `npm run db:seed` | Popula usuários demo |
| `npm run db:studio` | Abre o Prisma Studio |
