---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-023
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-03
assignees:
  - gabriel-natan
---
# Serviço de push FCM e registro de device tokens

## História
Como plataforma, quero um serviço central de notificações push via FCM,
para que apps recebam alertas de pedido, pagamento e corrida em tempo real.

## Critérios de aceite
- [ ] Endpoint POST /notifications/devices registra token por `user_id`
- [ ] Publicação de push ao consumir eventos `order.paid`, `delivery.assigned`
- [ ] Integração Firebase staging configurada
- [ ] Documentação atualizada em `integrations.md`

## Notas técnicas
Spike da SPRINT-02 evolui para serviço. Pode viver no gateway ou módulo compartilhado.
