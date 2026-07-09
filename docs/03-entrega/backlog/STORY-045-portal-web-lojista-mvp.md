---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-045
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: estabelecimentos
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - gerson
---
# Portal web do lojista — MVP

## História
Como lojista, quero um portal web para gerenciar loja, produtos e pedidos,
para operar sem depender apenas de API.

## Critérios de aceite
- [ ] Login via identity-service (role merchant)
- [ ] Telas: dashboard, pedidos, catálogo, configurações da loja
- [ ] Atualizar status de pedido (preparing, ready)
- [ ] Responsivo para tablet/desktop

## Notas técnicas
React em `services/merchant-portal` ou módulo em client-app. Consome merchant + order APIs.
