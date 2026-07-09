# CLAUDE.md — guia para IA

Este repositório (**kickoff**) é um **template de planejamento** e base para novos apps.
Ele treina os três chapéus de um líder: **Negócio**, **Técnico** e **Time**.

## Comece por aqui
1. Leia `docs/README.md` (índice) e `config/project.json` (nome/org/stack do projeto).
2. Leia `gerenciador-projetos/context-ia/PADROES-DOCUMENTACAO.md` — o **contrato de frontmatter**
   que todo `.md` segue. É o que o gerenciador lê pra montar as telas.

## Regra de ouro
- **Não edite os `.md` de `docs/` na mão.** Use o app `gerenciador-projetos` (rotas de API) ou,
  se for programático, os helpers `server/lib/docsWriter.js`. Editar à mão quebra frontmatter e a
  ordem/validação. `README.md` são a única exceção (sem frontmatter).
- **Datas em `AAAA-MM-DD`.** O campo `updated:` é carimbado automaticamente a cada escrita.
- **IDs nunca são reutilizados** e são gerados pelo app (`server/lib/idGenerator.js`).

## Os 3 pilares (pastas de `docs/`)
- `01-negocio/` — **Negócio**: visão, lean-canvas, concorrentes, métricas, riscos, OKRs, personas.
- `02-tecnico/` — **Técnico**: tech-stack, arquitetura, integrações, dados, decisões (ADR).
- `03-entrega/` — **Entrega** (liga os pilares): backlog (histórias), sprints.
- `04-time/` — **Time**: roster (`team.json`), squads (`squads.json`), 1:1s, metas de pessoas.
- `05-ops/` — operações: setup, git↔tasks, ambientes, runbook.

## Stack é decisão por projeto
O template é **agnóstico de linguagem**. A escolha de stack (Node, Go, Rails, React, Flutter…)
é registrada como **ADR** em `docs/02-tecnico/decisions/` — não há stack default imposta.

## Fluxo de trabalho de uma história (STORY-XXX)
1. Pegue o card no Kanban do gerenciador.
2. Branch: `feature/STORY-XXX-slug` (o ID é obrigatório — ver `docs/05-ops/vinculo-git-tasks.md`).
3. Commits: `STORY-XXX: <descrição>`.
4. PR: título `STORY-XXX — …`; registre os links Git no modal da história.
5. Ao mergear, mova o status da história para **done** e mantenha a **`main` sempre atualizada**.

### `main` sempre atualizada (regra obrigatória)

- **Toda PR criada pela IA deve ser mergeada na `main` na mesma sessão** — não deixar PR aberta
  esperando revisão humana, salvo o usuário pedir o contrário.
- **Toda nova branch parte da `main` atualizada**, nunca de outra feature branch:
  ```bash
  git checkout main && git pull origin main
  git checkout -b feature/STORY-XXX-slug
  ```
- **Não usar PRs empilhadas** (`base` = outra feature). Sempre `base: main`.
- Após o merge, atualizar o card para **`done`** (não deixar em `review` com PR já mergeada).

### Finalizar uma história (checklist obrigatório para a IA)

**Não marque a task como `done` só por ter implementado o código.** Antes de concluir,
execute **toda** a sequência abaixo — uma história por branch/PR.

0. **Sincronizar `main`** (sempre o primeiro passo):
   ```bash
   git checkout main && git pull origin main
   ```

1. **Branch dedicada** a partir da `main` atualizada:
   ```bash
   git checkout -b feature/STORY-XXX-slug-curto
   ```
   Nunca misturar arquivos de duas STORYs na mesma branch.

2. **Commit** — incluir **somente** o escopo da STORY-XXX:
   ```bash
   git add <arquivos da task>
   git commit -m "$(cat <<'EOF'
   STORY-XXX: descrição curta no imperativo.
   EOF
   )"
   ```
   Mensagem sempre começa com `STORY-XXX:`.

3. **Push, Pull Request e merge na `main`**:
   ```bash
   git push -u origin HEAD
   gh pr create --title "STORY-XXX — Título legível" --body "$(cat <<'EOF'
   ## Summary
   - …

   ## Test plan
   - [ ] …

   Relates to STORY-XXX
   EOF
   )"
   gh pr merge --merge --delete-branch
   git checkout main && git pull origin main
   ```

4. **Vincular no card** — registrar na história (via API `POST /api/stories/:id/links` ou
   `docsWriter`, **não** editar o `.md` à mão):
   - link `branch` → URL `…/tree/feature/STORY-XXX-…`
   - link `pr` → URL do Pull Request
   - (opcional) link `commit` do commit principal

5. **Status e revisão** — após merge na `main`:
   - marcar critérios de aceite `[x]` no corpo da história;
   - mover status para **`done`**;
   - adicionar comentário de revisão com o que foi entregue e o link da PR mergeada.

6. **Próxima task** — voltar ao passo 0 (`main` atualizada) antes de criar nova branch.

**Anti-padrões (não fazer):**
- Marcar `done` com arquivos só locais / untracked / sem commit.
- Deixar PR aberta após implementar (mergear na `main` na hora).
- Deixar card em `review` com PR já mergeada.
- Criar branch a partir de outra feature branch ou com `main` desatualizada.
- Deixar link `branch` apontando para a URL do repo sem `/tree/feature/…`.
- Continuar na branch de outra STORY (ex.: implementar STORY-060 na branch da STORY-059).
- Abrir PR sem push ou sem vincular o PR no card.
- Usar PR empilhada com base em outra feature (causa código que nunca chega na `main`).

Referência detalhada: `docs/05-ops/vinculo-git-tasks.md`.

## O gerenciador (planejador)
- App local em `gerenciador-projetos/` (Node + Express + JS vanilla, sem build).
  Rodar: `cd gerenciador-projetos && npm install && npm run dev` (http://localhost:4001).
- Os `.md`/`.json` de `docs/` **são o banco de dados** — não há BD externo.
- Validação: `npm run lint:docs`. Testes: `npm test`.
