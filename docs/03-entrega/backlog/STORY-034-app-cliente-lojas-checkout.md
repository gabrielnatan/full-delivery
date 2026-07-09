---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-034
type: story
status: backlog
priority: high
points: 5
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
# App cliente — lojas, carrinho e checkout

## História
Como cliente, quero navegar lojas, montar carrinho e pagar pelo app React,
para comprar e solicitar entrega pelo Full Delivery.

## Critérios de aceite
- [ ] Listagem de estabelecimentos e produtos via gateway
- [ ] Carrinho com edição de quantidade
- [ ] Checkout integrado ao payment-service (sandbox)
- [ ] Telas seguem design da SPRINT-02 (Beatriz valida)

## Notas técnicas
Evolução do scaffold `client-app`. Depende de merchant, order e payment.
