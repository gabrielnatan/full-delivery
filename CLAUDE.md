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

## O gerenciador (planejador)
- App local em `gerenciador-projetos/` (Node + Express + JS vanilla, sem build).
  Rodar: `cd gerenciador-projetos && npm install && npm run dev` (http://localhost:4001).
- Os `.md`/`.json` de `docs/` **são o banco de dados** — não há BD externo.
- Validação: `npm run lint:docs`. Testes: `npm test`.
