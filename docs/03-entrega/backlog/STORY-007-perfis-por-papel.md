---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-007
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: identidade
tags:
  - mvp
  - sprint-02
assignees:
  - ana
---
# Perfis completos por papel de usuário

## História
Como usuário, quero completar meu perfil conforme meu papel (cliente, entregador ou lojista),
para que os serviços downstream tenham dados mínimos para operar.

## Critérios de aceite
- [ ] Campos por role: cliente (endereço), entregador (veículo, CNH), lojista (CNPJ, razão social)
- [ ] PATCH /profiles/:userId com validação por role
- [ ] Gateway repassa `user_id` e `role` nos headers
- [ ] Testes dos fluxos por papel

## Notas técnicas
Serviço `identity-service`. Depende de STORY-004 (autenticação).
