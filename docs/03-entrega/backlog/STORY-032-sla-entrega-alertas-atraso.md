---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-032
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: logistica
tags:
  - mvp
  - sprint-03
assignees:
  - mark
---
# SLA de entrega e alertas de atraso

## História
Como cliente, quero ver o prazo garantido e ser alertado se houver atraso,
para confiar na promessa de entrega do Full Delivery.

## Critérios de aceite
- [ ] Campo `promised_at` calculado no momento da alocação
- [ ] Job verifica entregas próximas do limite e em atraso
- [ ] Evento `delivery.delayed` dispara push e e-mail
- [ ] GET /deliveries/:id expõe SLA e status de pontualidade

## Notas técnicas
North Star Metric: entregas no prazo.
