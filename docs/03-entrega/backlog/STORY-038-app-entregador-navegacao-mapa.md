---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-038
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: app-entregador
tags:
  - mvp
  - sprint-03
assignees:
  - ana
---
# App entregador — navegação e mapa da rota

## História
Como entregador, quero ver a rota no mapa e abrir navegação externa,
para chegar ao destino com eficiência.

## Critérios de aceite
- [ ] Mapa com origem, hub (se houver) e destino
- [ ] Botão abre Google Maps / Waze com coordenadas
- [ ] ETA exibido na tela da corrida
- [ ] Funciona offline para última rota carregada (cache básico)

## Notas técnicas
Consome endpoint de ETA do logistics-service.
