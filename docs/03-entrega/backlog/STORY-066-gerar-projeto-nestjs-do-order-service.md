---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-066
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
  - ana
---
# Gerar projeto NestJS do order-service

## Contexto
Subtask de **STORY-002**. Terceiro serviço base — Elton assume na SPRINT-02.

## Passo a passo
1. Em `services/order-service/`, gerar projeto NestJS.
2. Nome do pacote: `@full-delivery/order-service`.
3. Porta padrão: `3002`.
4. Criar módulo vazio `OrdersModule`.
5. Configurar `@nestjs/config` + `.env.example` com `DATABASE_URL`.
6. Validar build e dev independentes.

## Critérios de aceite
- [ ] order-service sobe na porta 3002
- [ ] OrdersModule criado
- [ ] Build passa sem erros

