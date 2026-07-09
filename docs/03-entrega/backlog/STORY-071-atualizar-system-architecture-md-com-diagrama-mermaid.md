---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-071
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
# Atualizar system-architecture.md com diagrama Mermaid

## Contexto
Subtask de **STORY-003**. Documentação visual da arquitetura para todos os squads.

## Passo a passo
1. Abrir `docs/02-tecnico/system-architecture.md`.
2. Atualizar diagrama Mermaid com todos os 8 serviços e apps.
3. Atualizar tabela **Componentes** com colunas: Serviço | Squad | Responsabilidade | Stack.
4. Descrever fluxo de dados resumido (auth → pedido → pagamento → entrega).
5. Linkar para ADR-001 (stack) e ADR-002 (microserviços).
6. Editar via gerenciador ou `docsWriter` — não quebrar frontmatter.
7. Validar que o Mermaid renderiza no preview do gerenciador.

## Critérios de aceite
- [ ] Diagrama inclui gateway + 5 backends + 2 apps
- [ ] Tabela de componentes alinhada ao squads.json
- [ ] Links para ADRs funcionando

