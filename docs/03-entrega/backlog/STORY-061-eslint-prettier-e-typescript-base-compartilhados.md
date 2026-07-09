---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-061
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
# ESLint, Prettier e TypeScript base compartilhados

## Contexto
Subtask de **STORY-001**. Padrão de código único para todos os squads backend.

## Passo a passo
1. Instalar na raiz (devDependencies): `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `prettier`, `eslint-config-prettier`.
2. Criar `eslint.config.js` (ou `.eslintrc.js`) na raiz com regras para TypeScript/NestJS.
3. Criar `.prettierrc` na raiz (singleQuote, trailingComma, printWidth 100).
4. Criar `tsconfig.base.json` na raiz com `strict: true`, `esModuleInterop: true`.
5. Adicionar scripts na raiz: `"lint": "eslint services --ext .ts"` e `"format": "prettier --write ."`.
6. Criar `.editorconfig` para consistência entre IDEs.
7. Rodar `npm run lint` — deve passar (ou sem arquivos ainda).

## Critérios de aceite
- [ ] ESLint e Prettier configurados na raiz
- [ ] `tsconfig.base.json` disponível para serviços herdarem
- [ ] Scripts `lint` e `format` funcionam

