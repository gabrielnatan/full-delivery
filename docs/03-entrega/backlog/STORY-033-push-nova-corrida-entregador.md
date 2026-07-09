---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-033
type: story
status: backlog
priority: medium
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
# Push de nova corrida no app entregador

## História
Como entregador, quero receber push quando uma nova corrida estiver disponível,
para aceitar rapidamente sem ficar com o app aberto.

## Critérios de aceite
- [ ] Ao criar entrega sem entregador, notificar couriers disponíveis na região
- [ ] Payload do push contém `delivery_id` e resumo
- [ ] Integração com serviço FCM da plataforma
- [ ] Deep link abre tela de detalhe no courier-app

## Notas técnicas
Depende do serviço FCM (STORY desta sprint — plataforma).
