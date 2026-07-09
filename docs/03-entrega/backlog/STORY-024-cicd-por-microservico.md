---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-024
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-03
parent: null
kind: chore
squad: plataforma
tags:
  - mvp
  - sprint-03
assignees:
  - gabriel-natan
---
# CI/CD por microserviço no monorepo

## História
Como squad de plataforma, quero pipeline de CI por serviço (lint, test, build),
para deploy independente e confiança nas entregas de cada squad.

## Critérios de aceite
- [ ] Workflow GitHub Actions (ou equivalente) por pasta `services/*`
- [ ] Lint e testes rodam em PR
- [ ] Build de imagem Docker por serviço
- [ ] Deploy automático em staging ao merge na main

## Notas técnicas
Base para ambiente de demo do MVP.
