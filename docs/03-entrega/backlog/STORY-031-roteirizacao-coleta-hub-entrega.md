---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-031
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: logistica
tags:
  - mvp
  - sprint-03
assignees:
  - mark
---
# Roteirização coleta-hub-entrega

## História
Como sistema de logística, quero calcular rota com parada em hub quando necessário,
para otimizar entregas de longa distância na rede nacional.

## Critérios de aceite
- [ ] Algoritmo escolhe hub intermediário quando distância > limiar configurável
- [ ] Rota retorna waypoints: coleta → hub → entrega
- [ ] ETA total considera todas as pernas
- [ ] Integração com API de mapas da SPRINT-02

## Notas técnicas
Serviço `logistics-service`. Base para expansão multi-região.
