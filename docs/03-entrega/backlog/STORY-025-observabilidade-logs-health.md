---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-025
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-03
assignees:
  - gabriel-natan
---
# Observabilidade — logs estruturados e health agregado

## História
Como tech lead, quero logs estruturados e dashboard de health de todos os serviços,
para diagnosticar falhas no fluxo integrado rapidamente.

## Critérios de aceite
- [ ] Formato JSON de log padronizado (request_id, service, level)
- [ ] GET /health no gateway agrega status de cada microserviço
- [ ] Correlação de request_id entre gateway e serviços downstream
- [ ] Guia de troubleshooting em `docs/05-ops/runbook.md`

## Notas técnicas
Preparação para piloto em staging.
