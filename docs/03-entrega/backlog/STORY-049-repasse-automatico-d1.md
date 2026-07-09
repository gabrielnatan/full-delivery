---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-049
type: story
status: backlog
priority: high
points: 3
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
# Repasse automático D+1 para lojistas e entregadores

## História
Como lojista ou entregador, quero receber meu repasse no dia seguinte à entrega,
para ter previsibilidade de caixa no piloto.

## Critérios de aceite
- [ ] Job diário processa payouts com status `pending` → `scheduled`
- [ ] Simulação de transferência (ledger) com data D+1
- [ ] GET /payouts?recipient_id= para consulta
- [ ] Notificação por e-mail ao processar repasse

## Notas técnicas
Transferência bancária real fica para fase pós-piloto.
