---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-072
type: story
status: todo
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-003
kind: docs
squad: plataforma
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - gabriel-natan
---
# Registrar e aceitar ADR-002 arquitetura microserviços

## Contexto
Subtask de **STORY-003**. Decisão formal de 1 squad = 1 serviço.

## Passo a passo
1. Verificar se `docs/02-tecnico/decisions/ADR-002-arquitetura-microservicos.md` existe.
2. Se necessário, criar via POST `/api/decisions` com:
   - Contexto: domínios distintos, ownership por squad
   - Decisão: lista dos 8 serviços
   - Alternativas: monólito modular (descartado)
   - Consequências: deploy independente, banco por serviço
3. Alterar `status` para `accepted` no frontmatter.
4. Referenciar ADR-002 em `tech-stack.md`.
5. Comunicar no canal do time o mapa squad → serviço.

## Critérios de aceite
- [ ] ADR-002 existe com status `accepted`
- [ ] Lista completa de serviços na decisão
- [ ] tech-stack.md referencia o ADR

