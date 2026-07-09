---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-063
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
# Scripts dev/build/test no api-gateway e README de setup

## Contexto
Subtask de **STORY-001**. Serviço piloto para validar que o monorepo funciona de ponta a ponta.

## Passo a passo
1. Em `services/api-gateway/`, garantir `package.json` com scripts:
   - `"dev": "nest start --watch"` (ou `tsx watch` se ainda sem Nest)
   - `"build": "nest build"`
   - `"test": "jest"`
2. Se o Nest ainda não foi gerado, criar `package.json` mínimo com script `dev` que sobe um servidor hello-world na porta 3000.
3. Na raiz do repositório, escrever README.md com seção **Começando**:
   ```bash
   git clone <repo>
   cd full-delivery
   npm install
   cp .env.example .env
   npm run dev:gateway
   curl http://localhost:3000/health
   ```
4. Validar que um dev novo consegue subir o gateway seguindo só o README.
5. Commitar: `STORY-001: scripts e README de setup local`.

## Critérios de aceite
- [ ] `npm run dev:gateway` sobe o serviço na porta 3000
- [ ] `npm run build` e `npm run test` existem no api-gateway
- [ ] README raiz com passos de setup testados

