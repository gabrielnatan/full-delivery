---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-076
type: story
status: todo
priority: high
points: 2
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
# POST /auth/login e emissão de JWT com role

## Contexto
Subtask de **STORY-004**. Autenticação e token para o gateway repassar.

## Passo a passo
1. Instalar `@nestjs/jwt` e `@nestjs/passport` + `passport-jwt`.
2. Configurar `JWT_SECRET` e `JWT_EXPIRES_IN=1d` no `.env`.
3. Criar DTO `LoginDto`: email, password.
4. Implementar `AuthService.login()`:
   - Buscar user por email
   - Comparar senha com bcrypt.compare
   - Se inválido: 401 Unauthorized
   - Gerar JWT com payload: `{ sub: userId, email, role }`
5. Criar `POST /auth/login` retornando `{ access_token, user: { id, email, role, name } }`.
6. Testar login com usuário criado no register.

## Critérios de aceite
- [ ] Login com credenciais válidas retorna JWT
- [ ] Credenciais inválidas retornam 401
- [ ] Token contém claims `sub`, `email` e `role`

