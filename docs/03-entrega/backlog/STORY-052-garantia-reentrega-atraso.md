---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-052
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: logistica
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - mark
---
# Garantia de reentrega por atraso grave

## História
Como cliente, quero que a plataforma acione reentrega ou compensação em atraso grave,
para confiar na promessa de entrega do Full Delivery.

## Critérios de aceite
- [ ] Regra: atraso > 2h do `promised_at` dispara fluxo de garantia
- [ ] Status `delivery.guarantee_triggered` com ação: reentrega ou crédito mock
- [ ] Notificação ao cliente e ao suporte
- [ ] Evento registrado para métricas de SLA

## Notas técnicas
Primeira versão da garantia de entrega — crédito mock no MVP.
