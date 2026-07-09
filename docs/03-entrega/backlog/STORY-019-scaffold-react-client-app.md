---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-019
type: story
status: backlog
priority: medium
points: 3
epic: mvp
sprint: SPRINT-02
parent: null
kind: chore
squad: app-cliente
tags:
  - mvp
  - sprint-02
assignees:
  - gerson
---
# Scaffold React client-app com autenticação

## História
Como squad app-cliente, quero o projeto React inicial integrado ao identity-service,
para começar a implementar as telas do design.

## Critérios de aceite
- [ ] Projeto React (Vite) em `services/client-app`
- [ ] Tela de login consumindo POST /auth/login via gateway
- [ ] Armazenamento seguro do JWT e interceptor HTTP
- [ ] Roteamento básico (login → home)

## Notas técnicas
Gerson apoia após merchant-service; Beatriz valida UI com wireframes.
