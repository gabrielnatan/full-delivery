---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-006
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-02
assignees:
  - gabriel-natan
---
# Gateway: rotas e contratos OpenAPI de todos os serviços

## História
Como desenvolvedor de qualquer squad, quero que o api-gateway roteie para todos os microserviços com contrato documentado,
para integrar apps e serviços sem adivinhar endpoints.

## Critérios de aceite
- [ ] Rotas proxy para identity, merchant, order, logistics e payment
- [ ] Spec OpenAPI agregada ou por serviço publicada em `/docs`
- [ ] Middleware de JWT reutilizado em todas as rotas protegidas
- [ ] Health check agregado no gateway

## Notas técnicas
Depende do bootstrap da SPRINT-01 (STORY-002).
