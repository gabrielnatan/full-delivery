---
squad: plataforma
kind: chore
priority: high
points: 5
assignees:
  - gabriel-natan
epic: mvp
sprint: SPRINT-01
updated: '2026-07-09'
status: todo
---
# Configurações do monorepo e ambientes

## História
Como tech lead, quero o monorepo configurado com padrões de lint, env e scripts por serviço,
para que cada squad possa desenvolver seu microserviço de forma consistente.

## Critérios de aceite
- [ ] Estrutura `services/<nome>` criada para cada microserviço do mapa de squads
- [ ] Variáveis de ambiente documentadas por serviço
- [ ] Scripts `dev`, `build` e `test` funcionando no mínimo para api-gateway
- [ ] README na raiz explicando como subir o ambiente local

## Notas técnicas
Squad **plataforma** — serviço `api-gateway`. Base para STORY-002 e STORY-003.
