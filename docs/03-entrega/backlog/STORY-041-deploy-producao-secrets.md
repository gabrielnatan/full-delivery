---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-041
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: chore
squad: plataforma
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - gabriel-natan
---
# Deploy produção e gestão de secrets

## História
Como squad de plataforma, quero ambiente de produção configurado com secrets seguros,
para lançar o piloto regional com confiabilidade operacional.

## Critérios de aceite
- [ ] Infra produção provisionada (cloud ou VPS documentada)
- [ ] Secrets em vault/env seguro — nunca no repositório
- [ ] Deploy de todos os microserviços + gateway em produção
- [ ] Smoke test automatizado pós-deploy

## Notas técnicas
Evolução do CI/CD da SPRINT-03. Atualizar `environments.md`.
