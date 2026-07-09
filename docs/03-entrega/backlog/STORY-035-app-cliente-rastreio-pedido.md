---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-035
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: app-cliente
tags:
  - mvp
  - sprint-03
assignees:
  - gerson
---
# App cliente — rastreio de pedido em tempo real

## História
Como cliente, quero acompanhar o status e a localização da minha entrega no app,
para saber quando o pedido vai chegar.

## Critérios de aceite
- [ ] Tela de rastreio com timeline de status
- [ ] Mapa com posição estimada (quando disponível)
- [ ] Push ao mudar status (via FCM)
- [ ] Polling ou websocket para atualização

## Notas técnicas
Consome order-service e logistics-service.
