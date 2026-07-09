---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-078
type: story
status: todo
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-004
kind: feature
squad: identidade
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - ana
---
# GET/PATCH perfil básico do usuário autenticado

## Contexto
Subtask de **STORY-004**. Dados complementares além do login.

## Passo a passo
1. Criar `ProfileController` no identity-service.
2. `GET /profile/me` — usa `user_id` do header `X-User-Id` (injetado pelo gateway):
   - Retorna name, phone, email, role
3. `PATCH /profile/me` — atualiza name e phone (e-mail imutável nesta fase).
4. Criar guard interno que lê `X-User-Id` (confiança no gateway na rede interna).
5. Proteger rotas via gateway com JwtAuthGuard.
6. Testar fluxo completo: register → login → GET profile com token.

## Critérios de aceite
- [ ] GET /profile/me retorna dados do usuário logado
- [ ] PATCH /profile/me atualiza name e phone
- [ ] Usuário A não acessa perfil do usuário B

