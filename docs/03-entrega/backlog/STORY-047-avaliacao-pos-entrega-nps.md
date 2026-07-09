---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-047
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: pedidos
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - elton
---
# Avaliação pós-entrega e NPS in-app

## História
Como cliente, quero avaliar a entrega e a loja após receber o pedido,
para ajudar a melhorar a qualidade do serviço.

## Critérios de aceite
- [ ] POST /orders/:id/rating com nota 1–5 e comentário opcional
- [ ] Avaliação separada: loja e entrega
- [ ] Solicitar avaliação via push após status `delivered`
- [ ] Métrica NPS calculável para OKR-001

## Notas técnicas
order-service. Alimenta métricas em `metricas.md`.
