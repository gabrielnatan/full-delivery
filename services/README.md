# Services — código de produção

Todo app e microserviço do Full Delivery vive nesta pasta, dentro do **monorepo** único.

Documentação completa: [docs/02-tecnico/monorepo.md](../docs/02-tecnico/monorepo.md)

| Pasta | Squad | Stack |
|---|---|---|
| [api-gateway](api-gateway/) | plataforma | NestJS |
| [identity-service](identity-service/) | identidade | NestJS |
| [merchant-service](merchant-service/) | estabelecimentos | NestJS |
| [order-service](order-service/) | pedidos | NestJS |
| [logistics-service](logistics-service/) | logística | NestJS |
| [payment-service](payment-service/) | pagamentos | NestJS |
| [client-app](client-app/) | app-cliente | React |
| [courier-app](courier-app/) | app-entregador | Flutter |

Código compartilhado entre serviços: `packages/` (na raiz do repo).
