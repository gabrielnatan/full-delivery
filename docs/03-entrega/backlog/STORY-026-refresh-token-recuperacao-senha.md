---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-026
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-03
parent: null
kind: feature
squad: identidade
tags:
  - mvp
  - sprint-03
assignees:
  - ana
---
# Refresh token e recuperação de senha

## História
Como usuário, quero renovar minha sessão com segurança e recuperar senha por e-mail,
para não precisar fazer login a cada uso do app.

## Critérios de aceite
- [ ] POST /auth/refresh emite novo JWT a partir de refresh token
- [ ] POST /auth/forgot-password envia link por e-mail
- [ ] POST /auth/reset-password redefine senha com token temporário
- [ ] Refresh token revogável no logout

## Notas técnicas
Reutiliza integração de e-mail da SPRINT-02.
