---
id: setup-ambiente-local
type: guide
status: active
tags:
  - dev
  - setup
created: 2026-07-09T00:00:00.000Z
updated: '2026-07-09'
---
# Setup do ambiente local

> Como subir **o planejador** e os **serviços do monorepo** na sua máquina.

## 1. Planejador (gerenciador-projetos)

O cockpit do projeto — lê e edita os `docs/`.

```bash
cd gerenciador-projetos
npm install
npm run dev        # http://localhost:4001
```

Não depende do app: funciona mesmo antes de existir uma linha de código do produto.

## 2. Monorepo (serviços)

```bash
# na raiz do repositório
npm install
docker compose up -d    # Postgres local (quando docker-compose existir)

# copiar variáveis de exemplo por serviço
cp services/api-gateway/.env.example services/api-gateway/.env
# repetir para cada serviço que for subir

npm run dev:gateway     # api-gateway na porta 3000
```

Cada pasta em `services/` tem um `.env.example`. Copie para `.env` local — **nunca** commite `.env` com segredos reais.

Variáveis globais opcionais na raiz: copie `.env.example` → `.env` (`NODE_ENV`, `LOG_LEVEL`).

## 3. Variáveis de ambiente por serviço

| Serviço | Porta | Variáveis obrigatórias |
|---|---|---|
| api-gateway | 3000 | `PORT`, `JWT_SECRET` |
| identity-service | 3001 | `PORT`, `DATABASE_URL`, `JWT_SECRET` |
| order-service | 3002 | `PORT`, `DATABASE_URL` |
| merchant-service | 3003 | `PORT`, `DATABASE_URL` |
| logistics-service | 3004 | `PORT`, `DATABASE_URL` |
| payment-service | 3005 | `PORT`, `DATABASE_URL` |
| client-app | 3100 | `PORT` |
| courier-app | 3101 | `PORT` |

**Notas:**

- `JWT_SECRET` deve ser **o mesmo** em `api-gateway` e `identity-service`.
- `DATABASE_URL` usa Postgres local (`localhost:5432`) com **schema isolado** por serviço (ex.: `?schema=identity`, `?schema=orders`).
- Apps cliente (React/Flutter) não usam `DATABASE_URL` nem `JWT_SECRET` no servidor — autenticação via gateway.

Exemplos completos: `services/<nome>/.env.example` e [services/README.md](../../services/README.md).

## Pré-requisitos

- **Git** e **Node.js** (planejador + monorepo).
- **Docker** (Postgres local via Compose).
- Ferramentas da stack: NestJS, React, Flutter conforme [tech-stack.md](../02-tecnico/tech-stack.md).

## 3. Padrão de código (monorepo)

ESLint, Prettier e TypeScript na raiz — ver [padrao-codigo-monorepo.md](padrao-codigo-monorepo.md).

```bash
npm install   # na raiz do full-delivery
npm run lint
npm run format
```

## Referências

- [padrao-codigo-monorepo.md](padrao-codigo-monorepo.md) — ESLint, Prettier, tsconfig base
- [runbook.md](runbook.md) — operação geral e troubleshooting
- [padrao-codigo-monorepo.md](padrao-codigo-monorepo.md) — ESLint, Prettier e TypeScript na raiz
- [../02-tecnico/tech-stack.md](../02-tecnico/tech-stack.md) — stack e motivação
- [../02-tecnico/monorepo.md](../02-tecnico/monorepo.md) — estrutura de pastas
- [vinculo-git-tasks.md](vinculo-git-tasks.md) — branches e PRs por STORY-XXX
