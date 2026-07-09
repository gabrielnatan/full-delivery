---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-060
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
  - id: da70fe3b
    type: branch
    label: feature/STORY-060-configurar-npm-workspaces-na-raiz-do-monorepo
    url: >-
      https://github.com/gabrielnatan/full-delivery/tree/feature/STORY-060-configurar-npm-workspaces-na-raiz-do-monorepo
    at: '2026-07-09T20:07:00.180Z'
  - id: 7359ddb6
    type: pr
    label: '2'
    url: 'https://github.com/gabrielnatan/full-delivery/pull/2'
    at: '2026-07-09T20:07:00.180Z'
comments:
  - id: rev06001
    author: Auto
    text: >-
      Revisão do repositório (2026-07-09): critérios de aceite atendidos.


      • package.json na raiz com workspaces: ["services/*", "packages/*"].

      • Scripts definidos: dev:gateway, build:all, test:all.

      • npm install na raiz executou sem erros (0 vulnerabilities).


      Observações:

      • package.json e package-lock.json ainda não commitados (arquivos
      untracked na branch atual).

      • Passo 5 (documentar workspaces no README raiz) pendente — conteúdo
      equivalente já existe em docs/02-tecnico/monorepo.md.

      • dev:gateway só funcionará após STORY-064 gerar o NestJS em
      services/api-gateway/ com script dev.
    at: '2026-07-09T19:50:50.363Z'
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
- [x] `package.json` raiz com workspaces configurados
- [x] Scripts `dev:gateway`, `build:all` e `test:all` definidos
- [x] `npm install` na raiz executa sem erro

