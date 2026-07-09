---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-061
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
  - id: rev06101
    author: Auto
    text: >-
      Revisão (2026-07-09): arquivos de config preenchidos e documentados.


      • eslint.config.js, .prettierrc, .prettierignore, tsconfig.base.json,
      .editorconfig na raiz.

      • Scripts lint, format e format:check no package.json.

      • Guia: docs/05-ops/padrao-codigo-monorepo.md

      • npm run lint e format:check passam (ainda sem .ts em services/).
    at: '2026-07-09T19:56:54.235Z'
  - id: rev06102
    author: Auto
    text: >-
      Reaplicação na main (2026-07-09): PR #3 tinha mergeado na branch da
      STORY-060, não na main.


      • eslint.config.js, Prettier, tsconfig.base.json e scripts lint/format na
      raiz.

      • Guia docs/05-ops/padrao-codigo-monorepo.md

      • npm run lint e format:check passam.
    at: '2026-07-09T20:17:43.670Z'
  - id: merge7
    author: Auto
    text: 'Merge na main (2026-07-09): PR #7 mergeada — status → done.'
    at: '2026-07-09T20:21:45.667Z'
links:
  - id: da461fc2
    type: branch
    label: feature/STORY-061-eslint-prettier-typescript
    url: >-
      https://github.com/gabrielnatan/full-delivery/tree/feature/STORY-061-eslint-prettier-typescript
    at: '2026-07-09T20:18:00.057Z'
  - id: 170fe47c
    type: pr
    label: '7'
    url: 'https://github.com/gabrielnatan/full-delivery/pull/7'
    at: '2026-07-09T20:18:00.058Z'
---
# ESLint, Prettier e TypeScript base compartilhados

## Contexto
Subtask de **STORY-001**. Padrão de código único para todos os squads backend.

📖 **Guia completo:** [padrao-codigo-monorepo.md](../../05-ops/padrao-codigo-monorepo.md) — o que é cada arquivo, como usar e como os serviços herdam a config.

## Passo a passo
1. Instalar na raiz (devDependencies): `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `prettier`, `eslint-config-prettier`.
2. Criar `eslint.config.js` na raiz com regras para TypeScript/NestJS.
3. Criar `.prettierrc` na raiz (singleQuote, trailingComma, printWidth 100).
4. Criar `tsconfig.base.json` na raiz com `strict: true`, `esModuleInterop: true`.
5. Adicionar scripts na raiz: `npm run lint` e `npm run format`.
6. Criar `.editorconfig` para consistência entre IDEs.
7. Rodar `npm run lint` — deve passar (sem arquivos .ts ainda é normal).

## Critérios de aceite
- [x] ESLint e Prettier configurados na raiz
- [x] `tsconfig.base.json` disponível para serviços herdarem
- [x] Scripts `lint` e `format` funcionam
