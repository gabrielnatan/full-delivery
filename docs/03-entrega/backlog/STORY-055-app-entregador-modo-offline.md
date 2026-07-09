---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-055
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: app-entregador
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - ana
---
# App entregador — modo offline para corrida ativa

## História
Como entregador, quero atualizar status da corrida mesmo com internet instável,
para não perder progresso em áreas com sinal fraco.

## Critérios de aceite
- [ ] Fila local de ações pendentes (picked_up, delivered)
- [ ] Sincronização automática ao reconectar
- [ ] Indicador visual de modo offline no app
- [ ] Conflito resolvido com timestamp do servidor

## Notas técnicas
courier-app Flutter. Crítico para operação em campo no piloto.
