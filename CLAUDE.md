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
5. Ao mergear, mova o status da história para **review**/**done**.

### Finalizar uma história (checklist obrigatório para a IA)

**Não marque a task como `done` só por ter implementado o código.** Antes de concluir,
execute **toda** a sequência abaixo — uma história por branch/PR.

1. **Branch dedicada** — sair de `main` (ou da base acordada) e criar:
   ```bash
   git checkout main && git pull
   git checkout -b feature/STORY-XXX-slug-curto
   ```
   Nunca misturar arquivos de STORY-060 e STORY-061 na mesma branch, salvo se a task
   pai explicitamente agrupar subtasks (raro).

2. **Commit** — incluir **somente** o escopo da STORY-XXX:
   ```bash
   git add <arquivos da task>
   git commit -m "$(cat <<'EOF'
   STORY-XXX: descrição curta no imperativo.
   EOF
   )"
   ```
   Mensagem sempre começa com `STORY-XXX:`.

3. **Push e Pull Request**:
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
   ```

4. **Vincular no card** — registrar na história (via API `POST /api/stories/:id/links` ou
   `docsWriter`, **não** editar o `.md` à mão):
   - link `branch` → URL `…/tree/feature/STORY-XXX-…`
   - link `pr` → URL do Pull Request
   - (opcional) link `commit` do commit principal

5. **Status e revisão** — só então:
   - marcar critérios de aceite no corpo da história;
   - mover status para **`review`** (PR aberto) ou **`done`** (se já mergeado);
   - adicionar comentário de revisão resumindo o que foi entregue e o link do PR.

**Anti-padrões (não fazer):**
- Marcar `done` com arquivos só locais / untracked / sem commit.
- Deixar link `branch` apontando para a URL do repo sem `/tree/feature/…`.
- Continuar na branch de outra STORY (ex.: implementar STORY-060 na branch da STORY-059).
- Abrir PR sem push ou sem vincular o PR no card.

Referência detalhada: `docs/05-ops/vinculo-git-tasks.md`.

## O gerenciador (planejador)
- App local em `gerenciador-projetos/` (Node + Express + JS vanilla, sem build).
  Rodar: `cd gerenciador-projetos && npm install && npm run dev` (http://localhost:4001).
- Os `.md`/`.json` de `docs/` **são o banco de dados** — não há BD externo.
- Validação: `npm run lint:docs`. Testes: `npm test`.
