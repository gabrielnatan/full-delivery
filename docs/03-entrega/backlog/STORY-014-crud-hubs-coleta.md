---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-014
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: logistica
tags:
  - mvp
  - sprint-02
assignees:
  - mark
---
# CRUD de hubs e postos de coleta

## História
Como operador logístico, quero cadastrar hubs e postos de coleta,
para orquestrar a rede de distribuição nacional.

## Critérios de aceite
- [ ] POST/GET/PATCH /hubs com nome, endereço, geo (lat/lng), capacidade
- [ ] Tipos: `hub` (centro de distribuição) e `pickup_point` (posto de coleta)
- [ ] Listagem por região/cidade

## Notas técnicas
Base para roteirização futura.
