---
status: active
updated: '2026-07-09'
id: tech-stack
type: tech-stack
tags: []
---
# Stack Tecnológica

## Backend
- **NestJS** (TypeScript) — um serviço por squad/domínio.
- **PostgreSQL** — banco por serviço (schema isolado).
- **Comunicação:** REST síncrono via API Gateway; eventos assíncronos (fila — a definir em ADR).

## Frontend
- **React** — app web cliente (`client-app`, squad app-cliente).
- **Flutter** — app entregador (`courier-app`, squad app-entregador).

## Banco de dados
- **PostgreSQL** — consistência transacional em pedidos, pagamentos e cadastros.

## Infraestrutura
- Monorepo com serviços em `services/<nome>`.
- API Gateway (`api-gateway`) como ponto único de entrada.
- Ambientes: local → staging → produção (ver [environments](../05-ops/environments.md)).

## Ferramentas de apoio
- ESLint, Prettier, testes unitários/e2e por serviço.
- CI por serviço (pipeline a configurar na SPRINT-01).
- Observabilidade: logs estruturados + health checks (plataforma).

## Por quê
A equipe já tem experiência com NestJS, React e Flutter — reduz curva de aprendizado no MVP.
Decisão registrada em [ADR-001](decisions/ADR-001-escolha-de-stack-do-projeto.md).
Arquitetura de microserviços em [ADR-002](decisions/ADR-002-arquitetura-microservicos.md). Organização do código em [monorepo.md](monorepo.md) ([ADR-003](decisions/ADR-003-monorepo.md)).
