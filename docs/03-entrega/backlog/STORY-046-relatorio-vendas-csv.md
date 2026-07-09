---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-046
type: story
status: backlog
priority: medium
points: 3
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
# Relatório de vendas e exportação CSV

## História
Como lojista, quero exportar relatório de vendas por período,
para conciliar financeiro e acompanhar desempenho no piloto.

## Critérios de aceite
- [ ] GET /merchants/:id/reports/sales?from=&to=
- [ ] Campos: pedido, data, valor, taxa, status
- [ ] Export CSV downloadável no portal
- [ ] Filtro por status e intervalo de datas

## Notas técnicas
merchant-service agrega dados do order-service.
