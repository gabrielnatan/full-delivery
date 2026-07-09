---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-074
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
# Modelagem User e Profile + migration Postgres

## Contexto
Subtask de **STORY-004**. Base de dados do identity-service.

## Passo a passo
1. No `identity-service`, instalar `@nestjs/typeorm` (ou Prisma) + `pg`.
2. Criar entidade `User`:
   - `id` (uuid), `email` (unique), `password_hash`, `role` (enum: customer, courier, merchant)
   - `created_at`, `updated_at`
3. Criar entidade `Profile`:
   - `user_id` (FK), `name`, `phone`, `document` (opcional)
4. Configurar TypeORM para schema `identity` (DATABASE_URL da SPRINT-002).
5. Gerar e rodar migration inicial.
6. Validar tabelas com `psql` ou cliente SQL.

## Critérios de aceite
- [ ] Tabelas `users` e `profiles` no schema identity
- [ ] Migration versionada no repositório
- [ ] Conexão com Postgres do Docker Compose funcionando

