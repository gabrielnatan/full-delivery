---
id: vinculo-git-tasks
type: runbook
status: active
tags: [git, github, workflow, ia]
created: 2026-07-09
updated: 2026-07-09
---

# Vínculo Git ↔ tasks (STORY-XXX)

> Como nomear branches e commits para que humanos, CI e **IA** saibam qual task do backlog
> está sendo implementada — e como registrar o link no gerenciador.

## Regra de ouro

**Todo branch e todo commit de feature deve conter o ID da história** (`STORY-XXX`) de forma
legível e parseável. A IA usa esse ID para:

1. Encontrar a task no backlog (`docs/03-entrega/backlog/STORY-XXX-*.md`)
2. Sugerir ou registrar links no campo `links` do frontmatter
3. Manter mensagens de PR e release notes alinhadas ao escopo

---

## Padrão de branch

```
<tipo>/STORY-XXX[-slug-opcional]
```

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `feature/` | nova funcionalidade | `feature/STORY-012-slug` |
| `fix/` | correção ligada à task | `fix/STORY-013-slug` |
| `chore/` | refactor/docs da task | `chore/STORY-021-slug` |
| `spike/` | investigação | `spike/STORY-014-slug` |

**Obrigatório:** `STORY-XXX` (três dígitos, maiúsculas, com hífen).
**Opcional:** slug kebab-case derivado do título.

### Exemplos inválidos (evitar)

```
nova-tela                    # sem STORY-XXX
feature/nova-tela           # sem STORY-XXX
STORY012-slug                # ID mal formatado
feature/story-012-slug       # minúsculas no ID
```

---

## Padrão de commit

Use **Conventional Commits** com o ID da task no início da linha de assunto:

```
STORY-XXX: <descrição curta no imperativo>
```

Com tipo opcional (recomendado):

```
STORY-012: feat: formulário de cadastro
STORY-013: fix: validação do formulário
STORY-014: test: e2e do fluxo principal
```

---

## Pull Request

**Título:** `STORY-XXX — Título legível da task`
**Descrição:** inclua `Closes STORY-XXX` ou `Relates to STORY-XXX` e link para a branch.

---

## Registrar links na task (gerenciador)

No modal da história, seção **Links Git**:

| Tipo | O que colar |
| --- | --- |
| `branch` | URL da branch no GitHub (`…/tree/feature/STORY-XXX-…`) |
| `commit` | URL do commit (`…/commit/abc1234`) |
| `pr` | URL do Pull Request |
| `repo` | URL do repositório |

Fica salvo no frontmatter da história:

```yaml
links:
  - id: a1b2c3d4
    type: branch
    label: feature/STORY-012-slug
    url: https://github.com/SUA-ORG/SEU-REPO/tree/feature/STORY-012-slug
    at: '2026-07-09T12:00:00.000Z'
```

O botão **Sugerir branch** no gerenciador preenche `feature/STORY-XXX-slug` automaticamente.

---

## Fluxo recomendado (dev + IA)

1. Pegar a task no Kanban (ex.: **STORY-012**)
2. Criar branch: `git checkout -b feature/STORY-012-slug`
3. Commits: `STORY-012: feat: …`
4. Abrir PR com título `STORY-012 — …`
5. Na task, adicionar links da branch e do PR
6. Ao mergear, mover status da task para **Review** ou **Done**

---

## Multi-repo

Se o projeto tiver vários repositórios (ex.: microsserviços), a **mesma task pode ter
vários links** — um por repo afetado. Backend e frontend costumam ser **tasks separadas**,
cada uma com branch própria contendo seu `STORY-XXX`.

---

## Referências

- [setup-ambiente-local.md](setup-ambiente-local.md) — clone e stack local
- [PADROES-DOCUMENTACAO.md](../../gerenciador-projetos/context-ia/PADROES-DOCUMENTACAO.md) — schema do frontmatter
- [backlog/README.md](../03-entrega/backlog/README.md) — convenções das histórias
