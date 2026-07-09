---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-064
type: story
status: todo
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-002
kind: chore
squad: plataforma
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - gabriel-natan
---
# Gerar projeto NestJS do api-gateway

## Contexto
Subtask de **STORY-002**. Primeiro microserviço real com NestJS CLI.

## Passo a passo
1. Instalar Nest CLI global ou usar `npx @nestjs/cli`.
2. Em `services/api-gateway/`, gerar projeto:
   ```bash
   npx @nestjs/cli new . --skip-git --package-manager npm
   ```
3. Ajustar `package.json` para nome `@full-delivery/api-gateway`.
4. Estender `tsconfig.json` do serviço com `"extends": "../../tsconfig.base.json"`.
5. Configurar porta via `process.env.PORT ?? 3000` em `main.ts`.
6. Remover boilerplate desnecessário (manter AppModule limpo).
7. Verificar `npm run dev` dentro da pasta e via workspace raiz.

## Critérios de aceite
- [ ] NestJS rodando em `services/api-gateway`
- [ ] Porta configurável por env
- [ ] Herda tsconfig e lint da raiz

