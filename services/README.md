# Services — código de produção

Todo app e microserviço do Full Delivery vive nesta pasta, dentro do **monorepo** único.

Documentação completa: [docs/02-tecnico/monorepo.md](../docs/02-tecnico/monorepo.md)

| Pasta | Squad | Stack | Porta (dev) |
|---|---|---|---|
| [api-gateway](api-gateway/) | plataforma | NestJS | 3000 |
| [identity-service](identity-service/) | identidade | NestJS | 3001 |
| [order-service](order-service/) | pedidos | NestJS | 3002 |
| [merchant-service](merchant-service/) | estabelecimentos | NestJS | 3003 |
| [logistics-service](logistics-service/) | logística | NestJS | 3004 |
| [payment-service](payment-service/) | pagamentos | NestJS | 3005 |
| [client-app](client-app/) | app-cliente | React | 3100 |
| [courier-app](courier-app/) | app-entregador | Flutter | 3101 |

Cada pasta tem `.env.example` — copie para `.env` local (`cp .env.example .env`). **Nunca** commite `.env` com segredos reais.

| Variável | Onde |
|---|---|
| `PORT` | Todos os serviços (porta única por app) |
| `DATABASE_URL` | Serviços NestJS com Postgres |
| `JWT_SECRET` | Apenas `api-gateway` e `identity-service` (mesmo valor nos dois) |

Código compartilhado entre serviços: `packages/` (na raiz do repo).
