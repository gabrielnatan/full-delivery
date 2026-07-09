---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-012
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: pedidos
tags:
  - mvp
  - sprint-02
assignees:
  - elton
---
# Ciclo de status e eventos do pedido

## História
Como operador do sistema, quero que o pedido transite por status claros com eventos,
para rastrear o ciclo de vida ponta a ponta.

## Critérios de aceite
- [ ] Status: `pending` → `paid` → `preparing` → `shipped` → `delivered` / `cancelled`
- [ ] PATCH /orders/:id/status com regras de transição válidas
- [ ] Eventos `order.paid`, `order.shipped`, `order.delivered` no barramento
- [ ] GET /orders/:id com histórico de status

## Notas técnicas
Integra com payment-service e logistics-service via eventos.
