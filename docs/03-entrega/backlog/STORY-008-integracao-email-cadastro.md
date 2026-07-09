---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-008
type: story
status: backlog
priority: medium
points: 3
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
# Integração e-mail transacional no cadastro

## História
Como novo usuário, quero receber e-mail de boas-vindas e confirmação de cadastro,
para validar que minha conta foi criada com sucesso.

## Critérios de aceite
- [ ] Adapter para provedor (Resend ou SendGrid) com mock em local
- [ ] E-mail disparado em `POST /auth/register`
- [ ] Template HTML básico com nome e link de confirmação
- [ ] Falha de e-mail não bloqueia cadastro (log + retry)

## Notas técnicas
Integração documentada em `integrations.md`.
