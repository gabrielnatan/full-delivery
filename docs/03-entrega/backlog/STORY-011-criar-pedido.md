---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-011
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: pedidos
tags:
  - mvp
  - sprint-02
assignees:
  - elton
---
# Criar pedido a partir do catálogo

## História
Como cliente, quero criar um pedido com itens de um estabelecimento,
para iniciar o fluxo de compra e entrega.

## Critérios de aceite
- [ ] Bootstrap `order-service` com Postgres próprio
- [ ] POST /orders com `merchant_id`, itens (product_id, qty) e endereço de entrega
- [ ] Validação de estoque via chamada ao merchant-service
- [ ] Evento `order.created` publicado no barramento
- [ ] Cálculo de subtotal e total do pedido

## Notas técnicas
Depende de merchant-service e barramento de eventos (plataforma).
