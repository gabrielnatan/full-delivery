---
squad: plataforma
kind: feature
priority: high
points: 8
assignees:
  - gabriel-natan
  - ana
epic: mvp
sprint: SPRINT-01
updated: '2026-07-09'
status: todo
---
# Bootstrap dos microserviços NestJS

## História
Como squad de plataforma, quero os esqueletos NestJS dos serviços principais,
para que os squads de domínio comecem a implementar features em paralelo.

## Critérios de aceite
- [ ] Projetos NestJS criados: api-gateway, identity-service, order-service
- [ ] Health check (`/health`) em cada serviço
- [ ] Docker Compose local com Postgres (instância ou schemas separados)
- [ ] Gateway roteando pelo menos identity-service

## Notas técnicas
Depende de STORY-001. Identidade (Ana) assume identity-service após o bootstrap.
