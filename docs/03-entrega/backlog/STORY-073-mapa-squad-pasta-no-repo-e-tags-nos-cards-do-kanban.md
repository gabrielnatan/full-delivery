---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-073
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
# Mapa squad→pasta no repo e tags nos cards do Kanban

## Contexto
Subtask de **STORY-003**. Liga documentação, código e Kanban.

## Passo a passo
1. Criar arquivo `services/README.md` na raiz de services/ com tabela:

   | Pasta | Squad | Dono principal |
   |---|---|---|

2. Para cada história do backlog (SPRINT-01 em diante), verificar campo `squad:` no frontmatter.
3. No gerenciador Kanban, filtrar por squad e confirmar que cards aparecem corretamente.
4. Histórias sem squad (ex.: produto transversal) mantêm `squad: null`.
5. Adicionar convenção no README raiz: *"Todo PR deve referenciar STORY-XXX do squad dono"*.

## Critérios de aceite
- [ ] `services/README.md` com mapa completo squad → pasta → pessoa
- [ ] Histórias SPRINT-02+ têm squad preenchido
- [ ] Kanban filtra por squad sem erros

