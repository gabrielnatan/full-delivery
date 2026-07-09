---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-044
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: identidade
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - ana
---
# Gestão de sessões e revogação de tokens

## História
Como usuário, quero ver dispositivos logados e revogar sessões,
para ter controle de segurança da minha conta.

## Critérios de aceite
- [ ] GET /auth/sessions lista sessões ativas
- [ ] DELETE /auth/sessions/:id revoga refresh token
- [ ] Logout global invalida todos os tokens do usuário
- [ ] Registro de último acesso por dispositivo

## Notas técnicas
Complementa refresh token da SPRINT-03.
