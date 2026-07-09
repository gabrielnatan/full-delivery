---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-048
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: pagamentos
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - elton
---
# Gateway de pagamentos em produção

## História
Como plataforma, quero o gateway de pagamentos em ambiente de produção,
para processar cobranças reais no piloto regional.

## Critérios de aceite
- [ ] Credenciais produção configuradas via secrets
- [ ] Webhook produção com validação de assinatura
- [ ] Idempotência em POST /payments
- [ ] Logs de reconciliação diária

## Notas técnicas
Evolução do sandbox da SPRINT-03. Documentar em `integrations.md`.
