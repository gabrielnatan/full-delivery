---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-051
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: logistica
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - mark
---
# Painel operacional de hubs e capacidade

## História
Como operador logístico, quero ver ocupação dos hubs e postos de coleta,
para balancear carga na rede do piloto.

## Critérios de aceite
- [ ] GET /hubs/overview com capacidade vs ocupação atual
- [ ] Alerta quando hub atinge 80% da capacidade
- [ ] Histórico de volume por hub (últimos 7 dias)
- [ ] Integração com roteirização da SPRINT-03

## Notas técnicas
Suporte à expansão multi-hub na mesma região.
