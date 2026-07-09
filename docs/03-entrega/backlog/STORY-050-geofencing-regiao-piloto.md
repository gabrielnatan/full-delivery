---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-050
type: story
status: backlog
priority: high
points: 5
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
# Geofencing da região piloto

## História
Como operação, quero limitar pedidos e corridas à região piloto,
para controlar escopo e qualidade antes da expansão nacional.

## Critérios de aceite
- [ ] Polígono ou raio da região piloto configurável
- [ ] Validação de endereço de entrega dentro da área
- [ ] Entregadores só recebem corridas na região
- [ ] Mensagem clara ao usuário fora da cobertura

## Notas técnicas
logistics-service + validação no order-service.
