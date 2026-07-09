---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-059
type: story
status: done
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-001
kind: chore
squad: plataforma
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - gabriel-natan
comments:
  - id: rev05901
    author: Auto
    text: >-
      Revisão do repositório (2026-07-09): estrutura compatível com os critérios
      de aceite.


      • services/ criada na raiz com as 8 pastas do mapa de squads: api-gateway,
      identity-service, merchant-service, order-service, logistics-service,
      payment-service, client-app, courier-app.

      • Cada pasta tem README.md (substituiu .gitkeep) com nome do serviço,
      squad id/nome e dono conforme squads.json + team.json. payment-service sem
      dono dev — alinhado ao time (squad pagamentos ainda sem dev dedicado).

      • packages/ criada na raiz (vazia, pronta para shared-events etc.).

      • Branch e PR: feature/STORY-059-criar-estrutura-de-pastas-services-no-monorepo → PR #1.
    at: '2026-07-09T19:36:13.197Z'
links:
  - id: 6631ebb6
    type: branch
    label: feature/STORY-059-criar-estrutura-de-pastas-services-no-monorepo
    url: 'https://github.com/gabrielnatan/full-delivery/tree/feature/STORY-059-criar-estrutura-de-pastas-services-no-monorepo'
    at: '2026-07-09T19:42:32.881Z'
  - id: pr059001
    type: pr
    label: 'PR #1 — STORY-059'
    url: 'https://github.com/gabrielnatan/full-delivery/pull/1'
    at: '2026-07-09T19:45:00.000Z'
---
# Criar estrutura de pastas services/ no monorepo

## Contexto
Subtask de **STORY-001**. Primeiro passo: definir onde cada microserviço vive no repositório.

## Passo a passo
1. Na raiz do repositório, criar a pasta `services/`.
2. Dentro de `services/`, criar uma subpasta vazia para cada serviço do mapa de squads:
   - `api-gateway`
   - `identity-service`
   - `merchant-service`
   - `order-service`
   - `logistics-service`
   - `payment-service`
   - `client-app`
   - `courier-app`
3. Em cada pasta, adicionar um `.gitkeep` ou `README.md` com uma linha indicando o squad dono (copiar de `docs/04-time/squads.json`).
4. Criar pasta `packages/` na raiz para código compartilhado futuro (ex.: `packages/shared-events`).
5. Commitar: `STORY-001: estrutura de pastas services/`.

## Critérios de aceite
- [x] Pastas de todos os 8 serviços existem em `services/`
- [x] Cada pasta tem README com squad e nome do serviço
- [x] Pasta `packages/` criada na raiz

