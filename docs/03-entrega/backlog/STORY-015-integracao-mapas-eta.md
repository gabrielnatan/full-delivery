---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-015
type: story
status: backlog
priority: high
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
# Integração mapas — distância e ETA

## História
Como sistema de logística, quero calcular distância e tempo estimado entre dois pontos,
para cotar prazo de entrega e alocar entregador.

## Critérios de aceite
- [ ] Adapter para API de mapas (Google Maps ou OpenStreetMap/Nominatim)
- [ ] Endpoint GET /logistics/eta?from=&to= retornando distância (km) e duração (min)
- [ ] Mock funcional em ambiente local sem chave de produção
- [ ] Cache simples de consultas repetidas (Redis ou in-memory)

## Notas técnicas
Integração documentada em `integrations.md`.
