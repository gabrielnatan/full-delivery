---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-029
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: pedidos
tags:
  - mvp
  - sprint-03
assignees:
  - elton
---
# Cancelamento de pedido e estorno mock

## História
Como cliente, quero cancelar um pedido antes do envio e receber estorno,
para ter flexibilidade na compra online.

## Critérios de aceite
- [ ] POST /orders/:id/cancel com regras (só antes de `shipped`)
- [ ] Evento `order.cancelled` publicado
- [ ] payment-service processa estorno mock
- [ ] Status final `cancelled` com motivo registrado

## Notas técnicas
Integra order-service e payment-service via eventos.
