---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-079
type: story
status: todo
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-004
kind: chore
squad: identidade
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - ana
---
# Testes unitários dos fluxos de autenticação

## Contexto
Subtask de **STORY-004**. Garantir qualidade mínima antes de merge.

## Passo a passo
1. Configurar Jest no identity-service (já vem com Nest).
2. Escrever testes para `AuthService`:
   - `register` cria usuário com hash correto
   - `register` rejeita e-mail duplicado
   - `login` retorna token para credenciais válidas
   - `login` lança erro para senha errada
3. Mockar repositório TypeORM (não bater no banco real nos unit tests).
4. Rodar `npm run test` no identity-service — todos passando.
5. Opcional: 1 teste e2e com Supertest em `POST /auth/register` + `POST /auth/login`.

## Critérios de aceite
- [ ] ≥ 4 testes unitários em AuthService passando
- [ ] `npm run test` verde no identity-service
- [ ] Cobertura dos fluxos register e login

