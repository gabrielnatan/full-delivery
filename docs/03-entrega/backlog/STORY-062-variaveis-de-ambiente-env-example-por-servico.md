---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-062
type: story
status: todo
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
- [ ] `.env.example` existe na raiz e em cada serviço NestJS planejado
- [ ] Portas documentadas sem conflito
- [ ] `setup-ambiente-local.md` atualizado com tabela de variáveis

