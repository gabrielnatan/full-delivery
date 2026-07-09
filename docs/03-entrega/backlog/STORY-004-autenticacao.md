---
squad: identidade
kind: feature
priority: high
points: 8
assignees:
  - ana
epic: mvp
sprint: SPRINT-01
updated: '2026-07-09'
status: todo
---
# Autenticação e perfis de usuário

## História
Como usuário (cliente, entregador ou lojista), quero me cadastrar e autenticar com segurança,
para acessar as funcionalidades do Full Delivery.

## Critérios de aceite
- [ ] POST /auth/register e POST /auth/login no identity-service
- [ ] JWT emitido com role (customer, courier, merchant)
- [ ] Gateway valida token e repassa claims aos serviços
- [ ] Perfis básicos: nome, telefone, e-mail
- [ ] Testes unitários dos fluxos principais

## Notas técnicas
Squad **identidade** — serviço `identity-service`. Depende do bootstrap (STORY-002).
