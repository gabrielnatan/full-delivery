---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-030
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: pagamentos
tags:
  - mvp
  - sprint-03
assignees:
  - elton
---
# Integração gateway de pagamentos sandbox

## História
Como plataforma, quero integrar um gateway de pagamentos em ambiente sandbox,
para substituir o PIX mock por fluxo mais próximo da produção.

## Critérios de aceite
- [ ] Adapter para provedor (Mercado Pago, Stripe ou Pagar.me sandbox)
- [ ] POST /payments cria cobrança real em sandbox
- [ ] Webhook de confirmação validado com assinatura
- [ ] Ledger de split mantido após confirmação

## Notas técnicas
Evolução do payment-service da SPRINT-02. Documentar em `integrations.md`.
