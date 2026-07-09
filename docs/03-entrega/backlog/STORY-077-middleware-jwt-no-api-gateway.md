---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-077
type: story
status: todo
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-004
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - gabriel-natan
---
# Middleware JWT no api-gateway

## Contexto
Subtask de **STORY-004**. Gateway valida token antes de rotear para serviços protegidos.

## Passo a passo
1. No `api-gateway`, instalar `@nestjs/jwt` e `passport-jwt`.
2. Usar o **mesmo** `JWT_SECRET` do identity-service no `.env` do gateway.
3. Criar `JwtAuthGuard` que valida Bearer token no header `Authorization`.
4. Aplicar guard em rotas protegidas (ex.: `/api/identity/profile`).
5. Rotas públicas sem guard: `/auth/register`, `/auth/login`, `/health`.
6. Ao validar, repassar headers aos downstreams:
   - `X-User-Id`, `X-User-Role`, `X-User-Email`
7. Testar: request sem token → 401; com token válido → passa.

## Critérios de aceite
- [ ] Rotas protegidas exigem JWT válido
- [ ] Rotas de auth são públicas via gateway
- [ ] Claims repassados em headers para serviços downstream

