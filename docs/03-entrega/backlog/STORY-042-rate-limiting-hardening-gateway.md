---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-042
type: story
status: backlog
priority: high
points: 3
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - gabriel-natan
---
# Rate limiting e hardening do API Gateway

## História
Como plataforma, quero rate limiting e headers de segurança no gateway,
para proteger o piloto contra abuso e ataques básicos.

## Critérios de aceite
- [ ] Rate limit por IP e por usuário autenticado
- [ ] Headers: CORS restrito, HSTS, X-Content-Type-Options
- [ ] Bloqueio temporário após N tentativas de login falhas
- [ ] Métricas de 429 expostas no health agregado

## Notas técnicas
Serviço `api-gateway`.
