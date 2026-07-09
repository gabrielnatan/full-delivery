---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-027
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: estabelecimentos
tags:
  - mvp
  - sprint-03
assignees:
  - gerson
---
# Dashboard de pedidos do lojista

## História
Como lojista, quero ver e atualizar o status dos pedidos da minha loja,
para gerenciar preparo e despacho sem sair do ecossistema Full Delivery.

## Critérios de aceite
- [ ] GET /merchants/:id/orders lista pedidos com filtros (status, data)
- [ ] PATCH para marcar `preparing` e `ready_for_pickup`
- [ ] Integração com order-service (chamada ou consumo de evento)
- [ ] Autorização: só dono do merchant acessa

## Notas técnicas
API no `merchant-service` consumindo dados do order-service.
