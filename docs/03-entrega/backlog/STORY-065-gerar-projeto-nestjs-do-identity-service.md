---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-065
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
# Gerar projeto NestJS do identity-service

## Contexto
Subtask de **STORY-002**. Esqueleto do serviço de identidade — Ana assume após bootstrap.

## Passo a passo
1. Em `services/identity-service/`, gerar projeto NestJS (mesmo processo do gateway).
2. Nome do pacote: `@full-delivery/identity-service`.
3. Porta padrão: `3001` (documentar no `.env.example`).
4. Criar módulo vazio `AuthModule` e `UsersModule` (só estrutura de pastas).
5. Adicionar dependência `@nestjs/config` e carregar `.env`.
6. Confirmar que o serviço sobe independente do gateway.

## Critérios de aceite
- [ ] identity-service sobe na porta 3001
- [ ] Módulos Auth e Users criados (vazios)
- [ ] ConfigModule carrega variáveis de ambiente

