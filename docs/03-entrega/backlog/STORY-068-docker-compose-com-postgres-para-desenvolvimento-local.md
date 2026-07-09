---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-068
type: story
status: todo
priority: high
points: 2
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
# Docker Compose com Postgres para desenvolvimento local

## Contexto
Subtask de **STORY-002**. Banco local compartilhado com isolamento por schema ou database.

## Passo a passo
1. Na raiz, criar `docker-compose.yml` com serviço `postgres:16`.
2. Configurar:
   - Porta `5432:5432`
   - Usuário/senha: `full_delivery / full_delivery`
   - Volume persistente `pgdata`
3. **Opção A (recomendada MVP):** um database, schemas separados:
   - `identity`, `orders` (criar via script init)
4. Criar `docker/postgres/init.sql`:
   ```sql
   CREATE SCHEMA IF NOT EXISTS identity;
   CREATE SCHEMA IF NOT EXISTS orders;
   ```
5. Atualizar `.env.example` de cada serviço com `DATABASE_URL` apontando para o schema correto.
6. Subir com `docker compose up -d` e validar conexão com `psql` ou DBeaver.
7. Documentar no README: `docker compose up -d` antes de `npm run dev`.

## Critérios de aceite
- [ ] Postgres sobe com `docker compose up -d`
- [ ] Schemas `identity` e `orders` criados automaticamente
- [ ] DATABASE_URL documentada por serviço

