---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-017
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: pagamentos
tags:
  - mvp
  - sprint-02
assignees:
  - elton
---
# Cobrança PIX mock e confirmação de pagamento

## História
Como cliente, quero pagar meu pedido via PIX (simulado no MVP),
para destravar o fluxo de preparo e entrega.

## Critérios de aceite
- [ ] Bootstrap `payment-service` com Postgres próprio
- [ ] POST /payments com `order_id` e valor → retorna QR code / copia-e-cola mock
- [ ] Webhook mock POST /payments/webhook confirma pagamento
- [ ] Evento `payment.approved` publicado no barramento
- [ ] Ledger interno de split (merchant / courier / platform) ao aprovar

## Notas técnicas
Elton integra pagamento com pedidos. Gateway real fica para sprint futura.
