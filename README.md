# kickoff

**Template de planejamento e base para novos apps.** Clone, preencha os docs e comece um
projeto novo já pensando como **líder**: idealizar o **negócio**, estruturar o **técnico** e
gerenciar o **time**.

Nasceu da experiência do projeto DiademaBank e foi generalizado para servir a **qualquer**
produto e **qualquer stack** — um app de entregas, um shopping, um SaaS, em Node, Go, Rails,
React ou Flutter. A escolha de linguagem é decisão por projeto (registrada em ADR), não um
default imposto.

## O que vem dentro

| Parte | O que é |
| --- | --- |
| **`docs/`** | O framework de planejamento em 3 pilares (Negócio / Técnico / Time) + Entrega e Ops. Tudo em Markdown com frontmatter padronizado. |
| **`gerenciador-projetos/`** | App local (Node + Express + JS vanilla) que **lê e edita** os `.md` de `docs/` — cockpit do projeto. |
| **`config/project.json`** | Nome, org e descrição do projeto num só lugar. |
| **`CLAUDE.md`** | Guia que o Claude Code lê automaticamente para navegar o projeto. |
| **`examples/`** | Projetos de referência preenchidos — veja [`examples/README.md`](examples/README.md). |

## Pré-requisitos

- **Node.js 20+** e npm
- Git (opcional, mas recomendado)

Todos os comandos abaixo assumem que você está na **raiz do kickoff** (`kickoff/`), salvo quando
indicado outro diretório.

---

## Como rodar cada coisa

### 1. Gerenciador (cockpit local)

O app que lê e edita `docs/` + `config/project.json`. Não precisa de build — só Node.

```bash
cd gerenciador-projetos
npm install          # primeira vez
npm run dev          # desenvolvimento (reinicia ao salvar)
# ou
npm start            # sem watch
```

Abra **http://localhost:4001**

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor com `--watch` — ideal para o dia a dia |
| `npm start` | Servidor simples, sem reinício automático |
| `npm test` | Testes do parser/validador/escrita de docs |
| `npm run lint:docs` | Valida frontmatter e referências cruzadas em `docs/` |

**Porta diferente:**

```bash
PORT=3000 npm run dev
```

**Apontar para outra pasta de docs** (útil para validar exemplos sem copiar arquivos):

```bash
KICKOFF_DOCS=../examples/diadema-entregas/docs npm run dev
```

> O `config/project.json` continua sendo lido da raiz do kickoff. Para ver o exemplo completo
> no gerenciador, copie também o `config/` do exemplo (passo 4 abaixo).

**Health check** (com o servidor rodando):

```bash
curl http://localhost:4001/api/health
# → { "ok": true, "docs": "/caminho/para/docs" }
```

---

### 2. Onboarding Wizard (primeiro acesso)

Ritual de “fundar o projeto” — preenche negócio, OKRs, stack, time e primeira sprint.

1. Rode o gerenciador (`npm run dev`).
2. Se `config/project.json` tiver `"onboarded": false`, a UI abre em **http://localhost:4001/#onboarding** automaticamente.
3. Siga os 6 passos e clique em **Concluir** — grava em `docs/` e `config/project.json`.

Para rodar o wizard de novo:

```bash
# na raiz do kickoff — edite ou use jq
# em config/project.json: "onboarded": false
```

Depois acesse **http://localhost:4001/#onboarding** (os dados existentes são pré-preenchidos quando possível).

---

### 3. Telas do cockpit

Com o gerenciador rodando, use a sidebar ou os links diretos:

| Tela | URL | O que faz |
| --- | --- | --- |
| Onboarding | `/#onboarding` | Wizard de configuração inicial |
| Buscar | `/#search` | Busca full-text nos docs |
| Kanban | `/#kanban` | Backlog — arrastar card muda `status:` no `.md` |
| Time | `/#team` | Roster, capacidade, ownership, 1:1s, metas |
| Squads | `/#squads` | Squads e domínios (Team Topologies) |
| Sprints | `/#sprints` | Planejamento e board por sprint |
| Roadmap | `/#roadmap` | Roadmap editável |
| OKRs | `/#okrs` | Objetivos e resultados-chave |
| Personas | `/#personas` | Personas de negócio |
| Decisões (ADR) | `/#decisions` | Architecture Decision Records |
| Docs | `/#docs/vision` (etc.) | Leitura/edição dos `.md` simples — troque `vision` pelo slug |

---

### 4. Exemplo preenchido (`examples/diadema-entregas`)

Marketplace fictício de delivery — mostra o kickoff **cheio** nos três pilares.

**Só ler os arquivos:** abra `examples/diadema-entregas/docs/` no editor.

**Rodar no gerenciador** (substitui o template em branco — faça backup antes):

```bash
cp -r examples/diadema-entregas/config ./
cp -r examples/diadema-entregas/docs ./

cd gerenciador-projetos
npm run dev
```

Abra http://localhost:4001 — projeto aparece como **Diadema Entregas**, com Kanban, Time e OKRs populados.

**Validar o exemplo sem copiar:**

```bash
cd gerenciador-projetos
KICKOFF_DOCS=../examples/diadema-entregas/docs npm run lint:docs
```

Mais detalhes: [`examples/diadema-entregas/README.md`](examples/diadema-entregas/README.md).

---

### 5. Validar documentação (`lint:docs`)

Confere se cada `.md` tem frontmatter válido e se referências (`sprint:`, `parent:`, `assignees`, etc.) apontam para IDs reais.

```bash
cd gerenciador-projetos
npm run lint:docs
```

Roda automaticamente no **CI** (`.github/workflows/ci.yml`) em todo push/PR.

**Replicar o CI localmente** (mesmo que o GitHub Actions):

```bash
cd gerenciador-projetos
npm install
npm test
npm run lint:docs
KICKOFF_DOCS=../examples/diadema-entregas/docs npm run lint:docs
```

---

### 6. Testes automatizados

Cobrem `docsReader`, `docsWriter`, geração de ID e validação de schemas.

```bash
cd gerenciador-projetos
npm test
```

---

### 7. `docs/` (planejamento em Markdown)

Não tem comando próprio — é a **fonte de verdade** que o gerenciador lê e escreve.

- Edite pela UI do gerenciador (recomendado) — o app gera IDs e valida frontmatter.
- **Não edite `.md` na mão** (exceto `README.md`). Contrato completo:
  [`gerenciador-projetos/context-ia/PADROES-DOCUMENTACAO.md`](gerenciador-projetos/context-ia/PADROES-DOCUMENTACAO.md).

---

### 8. `config/project.json`

Metadados centrais do projeto (nome, org, descrição, `onboarded`).

- Lido automaticamente pelo gerenciador na sidebar e no wizard.
- Edite pela tela **Onboarding** ou via API com o servidor rodando:

```bash
curl http://localhost:4001/api/project
curl -X PATCH http://localhost:4001/api/project \
  -H 'Content-Type: application/json' \
  -d '{"name":"Meu App","org":"minha-org"}'
```

---

### 9. `CLAUDE.md` (trabalhar com IA)

Não é executável — o Claude Code lê esse arquivo ao abrir o repo.

- Fluxo de branches/commits com `STORY-XXX`: `docs/05-ops/vinculo-git-tasks.md`
- Para a IA editar docs corretamente, aponte para `gerenciador-projetos/server/lib/docsWriter.js` e os schemas em `server/schemas/`.

---

## Começar um projeto novo (fluxo rápido)

1. Clone ou use o template no GitHub.
2. `cd gerenciador-projetos && npm install && npm run dev`
3. Complete o **Onboarding** em http://localhost:4001/#onboarding
4. Use Kanban, Sprints, Time e OKRs para planejar; registre a stack em **Decisões (ADR)**.

---

## Os 3 pilares (chapéus de líder)

- **01 · Negócio** — visão, lean canvas, concorrentes, métricas, riscos, OKRs, personas, roadmap.
- **02 · Técnico** — tech-stack, arquitetura, integrações, dados, decisões (ADR).
- **04 · Time** — roster (pessoas, skills, capacidade), squads/ownership, 1:1s, metas de pessoas.

Ligados por **03 · Entrega** (backlog + sprints) e apoiados por **05 · Ops**.

## Como funciona o planejador

- Os arquivos `.md`/`.json` **são o banco de dados** — não há BD, o app lê e escreve no disco.
- Um arquivo em `docs/03-entrega/backlog/` = um card no Kanban. O `status:` no frontmatter
  define a coluna. Arrastar o card reescreve o campo no arquivo.

## Estrutura

```
kickoff/
├── config/project.json       # nome, org, descrição do projeto
├── CLAUDE.md                 # guia para IA
├── examples/                 # projetos de referência preenchidos
├── docs/                     # planejamento (Markdown + frontmatter)
│   ├── 01-negocio/           # visão, lean-canvas, OKRs, personas, roadmap…
│   ├── 02-tecnico/           # tech-stack, arquitetura, dados, decisions/ (ADR)
│   ├── 03-entrega/           # backlog/, sprints/
│   ├── 04-time/              # team.json, squads.json, 1on1/, metas-pessoas/
│   └── 05-ops/               # setup local, git↔tasks, ambientes, runbook
└── gerenciador-projetos/     # o cockpit que lê/edita docs/
```

## Feito para trabalhar com IA

Todo branch/commit carrega o `STORY-XXX` (ver `docs/05-ops/vinculo-git-tasks.md`), e o
frontmatter padronizado deixa o Claude Code navegar o backlog, entender o contexto e
vincular código às tarefas automaticamente. Veja o [`CLAUDE.md`](CLAUDE.md).
