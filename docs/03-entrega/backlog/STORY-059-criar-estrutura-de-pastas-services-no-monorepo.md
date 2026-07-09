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


      Pendência fora do escopo desta subtask: commit com mensagem STORY-001
      ainda não verificado.
    at: '2026-07-09T19:36:13.197Z'
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

