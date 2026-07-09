---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-070
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
# Validar squads.json — 1 squad = 1 serviço

## Contexto
Subtask de **STORY-003**. Fonte de verdade do ownership no gerenciador de projetos.

## Passo a passo
1. Abrir `docs/04-time/squads.json` no gerenciador (view Squads).
2. Para cada squad, confirmar que `services` tem **exatamente 1** entrada.
3. Conferir mapa esperado:
   | Squad | Serviço |
   |---|---|
   | plataforma | api-gateway |
   | identidade | identity-service |
   | estabelecimentos | merchant-service |
   | pedidos | order-service |
   | logistica | logistics-service |
   | pagamentos | payment-service |
   | app-cliente | client-app |
   | app-entregador | courier-app |
4. Corrigir via API/UI qualquer squad sem serviço ou com múltiplos.
5. Conferir `docs/04-time/team.json`: cada dev com `squad` válido.
6. Rodar `npm run lint:docs` para validar referências.

## Critérios de aceite
- [ ] 8 squads com 1 serviço cada em squads.json
- [ ] Membros do time com squad válido (ou null para produto transversal)
- [ ] lint:docs passa

