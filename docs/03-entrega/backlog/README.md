# Backlog

> Histórias de usuário, uma por arquivo, no formato `STORY-XXX-slug.md`.
> Cada arquivo vira **um card** no Kanban do gerenciador. A **ordem de execução** é
> calculada automaticamente: raiz `1, 2, 3…`, subtask (campo `parent`) `1.1`, `1.2`…

## Template

```markdown
---
id: STORY-001
type: story
status: backlog        # backlog | todo | in-progress | review | done | cancelled
priority: high          # high | medium | low
points: 3                # estimativa (fibonacci: 1,2,3,5,8,13)
epic: nome-do-epico      # agrupador livre, usado pra filtrar no board
sprint: null              # null até ser puxada pra uma sprint, depois "SPRINT-01"
created: 2026-07-09
updated: 2026-07-09
tags: []
links: []              # opcional — branch/commit/PR (ver 05-ops/vinculo-git-tasks.md)
---

# Título da história

## História
Como [persona], eu quero [ação/objetivo], para [benefício].

## Critérios de aceite
- [ ] critério 1
- [ ] critério 2

## Notas técnicas
(qualquer detalhe de implementação relevante)
```

## Campos opcionais (organização de time)

Só quando o projeto tiver squads/time definidos (`squads.json`, `team.json`):

```yaml
parent: STORY-002         # subtask desta história
squad: nome-do-squad     # squad dono — ID de squads.json
assignees: [id1, id2]    # quem executa — IDs de team.json
```

O campo `epic` descreve **o quê** (domínio de produto); `squad` descreve **quem** implementa.

> **Dica:** não crie histórias editando `.md` na mão — use o formulário do gerenciador,
> que gera o ID e valida o frontmatter.
