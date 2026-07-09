---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-028
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: pedidos
tags:
  - mvp
  - sprint-03
assignees:
  - elton
---
# E-mail de confirmação e atualização de pedido

## História
Como cliente, quero receber e-mail quando meu pedido for confirmado ou mudar de status,
para acompanhar a compra mesmo fora do app.

## Critérios de aceite
- [ ] E-mail ao criar pedido com resumo e valor
- [ ] E-mail em transições: pago, enviado, entregue
- [ ] Template HTML reutilizável
- [ ] Usa adapter de e-mail já configurado

## Notas técnicas
Integração transacional — order-service publica, worker envia e-mail.
