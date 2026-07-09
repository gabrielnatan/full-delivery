---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-016
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: logistica
tags:
  - mvp
  - sprint-02
assignees:
  - mark
---
# Alocar entrega e rastrear status

## História
Como sistema, quero criar uma entrega quando o pedido é pago e atribuir a um entregador,
para que cliente e lojista acompanhem o status.

## Critérios de aceite
- [ ] Consumir evento `order.paid` e criar `Delivery`
- [ ] POST /deliveries/:id/assign vincula entregador disponível
- [ ] Status: `pending` → `picked_up` → `in_transit` → `delivered`
- [ ] Evento `delivery.assigned` publicado no barramento
- [ ] GET /deliveries/:id para rastreio

## Notas técnicas
Depende de cadastro de entregadores e barramento de eventos.
