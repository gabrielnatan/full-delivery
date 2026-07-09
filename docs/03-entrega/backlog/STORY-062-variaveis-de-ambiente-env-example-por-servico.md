---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-062
type: story
status: review
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
links:
  - id: cba0a21c
    type: branch
    label: feature/STORY-062-variaveis-de-ambiente-env-example-por-servico
    url: >-
      https://github.com/gabrielnatan/full-delivery/tree/feature/STORY-062-variaveis-de-ambiente-env-example-por-servico
    at: '2026-07-09T20:14:34.056Z'
  - id: b9afef84
    type: pr
    label: '4'
    url: 'https://github.com/gabrielnatan/full-delivery/pull/4'
    at: '2026-07-09T20:14:34.056Z'
comments:
  - id: rev06201
    author: Auto
    text: >-
      Revisão (2026-07-09): critérios de aceite atendidos.


      • .env.example na raiz (NODE_ENV, LOG_LEVEL) e em 8 pastas de services/.

      • Portas: 3000 gateway, 3001 identity, 3002 order, 3003 merchant, 3004
      logistics, 3005 payment, 3100 client-app, 3101 courier-app.

      • JWT_SECRET apenas em api-gateway e identity-service (mesmo valor).

      • Tabela de variáveis em docs/05-ops/setup-ambiente-local.md.

      • .env já estava no .gitignore global.


      PR: https://github.com/gabrielnatan/full-delivery/pull/4
    at: '2026-07-09T20:14:19.169Z'
---
# Variáveis de ambiente — .env.example por serviço

## Contexto
Subtask de **STORY-001**. Documentar variáveis antes de implementar cada serviço.

## Passo a passo
1. Criar `.env.example` na raiz com variáveis globais:
   - `NODE_ENV=development`
   - `LOG_LEVEL=debug`
2. Para cada serviço NestJS em `services/<nome>/`, criar `.env.example` com:
   - `PORT` (porta única por serviço: gateway 3000, identity 3001, order 3002…)
   - `DATABASE_URL` (Postgres)
   - `JWT_SECRET` (apenas identity e gateway)
3. Adicionar `.env` ao `.gitignore` global se ainda não estiver.
4. Criar seção em `docs/05-ops/setup-ambiente-local.md` com tabela:

   | Serviço | Porta | Variáveis obrigatórias |
   |---|---|---|

5. Commitar exemplos — **nunca** commitar `.env` com valores reais.

## Critérios de aceite
- [x] `.env.example` existe na raiz e em cada serviço NestJS planejado
- [x] Portas documentadas sem conflito
- [x] `setup-ambiente-local.md` atualizado com tabela de variáveis
