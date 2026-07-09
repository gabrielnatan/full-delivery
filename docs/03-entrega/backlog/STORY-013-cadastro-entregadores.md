---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-013
type: story
status: backlog
priority: high
points: 5
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
# Cadastro e disponibilidade de entregadores

## História
Como entregador, quero me cadastrar e ficar disponível para corridas,
para receber entregas na rede Full Delivery.

## Critérios de aceite
- [ ] Bootstrap `logistics-service` com Postgres próprio
- [ ] POST /couriers vinculado ao `user_id` (role courier)
- [ ] Campos: tipo de veículo, placa, status (offline/available/busy)
- [ ] PATCH /couriers/:id/availability

## Notas técnicas
Serviço `logistics-service`. Perfil base vem do identity-service.
