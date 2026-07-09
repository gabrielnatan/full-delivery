---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-060
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
# Configurar npm workspaces na raiz do monorepo

## Contexto
Subtask de **STORY-001**. Habilitar monorepo com workspaces para instalar dependências de forma centralizada.

## Passo a passo
1. Na raiz, inicializar `package.json` se ainda não existir: `npm init -y`.
2. Adicionar campo `workspaces`:
   ```json
   "workspaces": ["services/*", "packages/*"]
   ```
3. Definir scripts na raiz:
   - `"dev:gateway": "npm run dev -w api-gateway"`
   - `"build:all": "npm run build --workspaces --if-present"`
   - `"test:all": "npm run test --workspaces --if-present"`
4. Rodar `npm install` na raiz e confirmar que não há erros.
5. Documentar no README que novos serviços entram automaticamente via glob `services/*`.

## Critérios de aceite
- [ ] `package.json` raiz com workspaces configurados
- [ ] Scripts `dev:gateway`, `build:all` e `test:all` definidos
- [ ] `npm install` na raiz executa sem erro

