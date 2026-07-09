---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-075
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
# POST /auth/register com hash bcrypt

## Contexto
Subtask de **STORY-004**. Cadastro seguro de novos usuários.

## Passo a passo
1. Instalar `bcrypt` e `class-validator` + `class-transformer`.
2. Criar DTO `RegisterDto`: email, password (min 8 chars), name, phone, role.
3. Implementar `AuthService.register()`:
   - Validar e-mail único (409 se duplicado)
   - Hash senha com bcrypt (salt rounds ≥ 10)
   - Criar User + Profile em transação
4. Criar `AuthController` com `POST /auth/register`.
5. Retornar 201 com `{ id, email, role }` — **nunca** retornar password_hash.
6. Testar via curl/Postman:
   ```bash
   curl -X POST localhost:3001/auth/register \
     -H 'Content-Type: application/json' \
     -d '{"email":"a@b.com","password":"senha123","name":"Ana","phone":"11999","role":"customer"}'
   ```

## Critérios de aceite
- [ ] Register cria user e profile
- [ ] Senha armazenada com bcrypt
- [ ] E-mail duplicado retorna 409
- [ ] Validação de campos obrigatórios (400)

