---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-037
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: app-entregador
tags:
  - mvp
  - sprint-03
assignees:
  - ana
---
# App entregador — aceitar e executar corridas

## História
Como entregador, quero ver corridas disponíveis, aceitar e atualizar o status da entrega,
para completar o fluxo operacional pelo app Flutter.

## Critérios de aceite
- [ ] Lista de corridas pendentes e ativas
- [ ] Aceitar/recusar corrida com feedback imediato
- [ ] Atualizar status: picked_up → in_transit → delivered
- [ ] Foto ou confirmação de entrega (mock)

## Notas técnicas
Evolução do scaffold `courier-app`. Integra logistics-service.
