---
id: instrucoes-app
type: runbook
status: active
created: 2026-07-02
updated: 2026-07-02
tags: [gerenciador-projetos, claude-code]
---

# Instruções de Construção — Gerenciador de Projetos

Este documento é a fonte de verdade para o Claude Code construir a aplicação `gerenciador-projetos`. Ela lê a pasta `docs/` (definida em `PADROES-DOCUMENTACAO.md`) e exibe/edita esse conteúdo através de uma UI.

**Antes de escrever código, leia:** `docs/README.md` e `gerenciador-projetos/context-ia/PADROES-DOCUMENTACAO.md`. Toda a lógica de parsing depende do contrato de frontmatter definido lá.

---

## 1. Objetivo do app

Uma ferramenta local de gestão de projeto que:
1. Lê os arquivos `.md` de `docs/` e transforma em visualizações (Kanban, Sprint board, Roadmap).
2. Permite criar/editar itens (história, decisão, sprint) através de formulário, sem precisar editar `.md` na mão.
3. Escreve de volta no arquivo `.md` correto, mantendo o frontmatter + corpo intactos.
4. Serve como o painel de controle do projeto enquanto você estuda dev + fintech.

**Não é objetivo:** autenticação multi-usuário, deploy em produção, sincronização em tempo real entre múltiplos usuários. É ferramenta local, uso único (você).

---

## 2. Stack técnica

Decisão: sem framework de frontend (React/Vue) — **HTML + CSS + JS puro (vanilla) + Tailwind via CDN**. Backend em **Node**.

| Camada | Tecnologia | Por quê |
|---|---|---|
| Backend | Node.js + Express | simples, você já conhece, sem overhead |
| Leitura/escrita de frontmatter | `gray-matter` | parseia e serializa YAML+markdown sem reinventar parser |
| Leitura de markdown → HTML | `marked` | renderizar corpo dos docs na tela |
| Observar mudanças em arquivo (opcional, fase 2) | `chokidar` | atualizar UI se o `.md` for editado direto no editor de texto |
| Frontend | HTML + Tailwind (CDN) + JS vanilla (`fetch` para API) | sem build step, roda direto no navegador |
| Persistência | O próprio sistema de arquivos (`docs/`) | não tem banco de dados — os `.md` SÃO o banco |

**Não usar:** ORM, banco de dados relacional, bundler (Webpack/Vite) — foge do propósito de estudo simples e do MVP.

---

## 3. Estrutura de pastas do app

```
gerenciador-projetos/
├── context-ia/
│   ├── PADROES-DOCUMENTACAO.md
│   └── instrucoes-app.md          (este arquivo)
├── server/
│   ├── index.js                   (entrada do Express)
│   ├── routes/
│   │   ├── stories.js
│   │   ├── decisions.js
│   │   ├── sprints.js
│   │   └── docs.js                (vision, roadmap, business-model, etc — leitura simples)
│   ├── lib/
│   │   ├── docsReader.js          (glob + gray-matter, lê pasta inteira de um tipo)
│   │   ├── docsWriter.js          (atualiza frontmatter mantendo corpo intacto)
│   │   └── validator.js           (valida schema por type antes de escrever)
│   └── schemas/
│       └── story.schema.json      (um por type — ver seção 7)
├── public/
│   ├── index.html
│   ├── css/
│   │   └── custom.css             (só o que Tailwind não cobre)
│   ├── js/
│   │   ├── api.js                 (wrapper de fetch pras rotas)
│   │   ├── kanban.js
│   │   ├── sprints.js
│   │   ├── roadmap.js
│   │   └── docs-viewer.js
│   └── components/                (fragmentos HTML reaproveitáveis, injetados via JS)
│       ├── card.html
│       └── modal.html
└── package.json
```

---

## 4. Funcionalidades (MVP — ordem de construção)

### Fase 1 — Leitura (somente visualização)
1. **Kanban de histórias** — colunas `backlog | todo | in-progress | review | done`, cards vindos de `docs/03-entrega/backlog/*.md`.
2. **Visualizador de docs** — sidebar de navegação lendo `vision.md`, `business-model.md`, `roadmap.md`, `tech-stack.md`, etc., renderizados como HTML.
3. **Lista de personas** — cards simples com as dores de cada persona.
4. **Log de decisões (ADR)** — lista cronológica com status (`accepted`, `superseded`, etc).

### Fase 2 — Escrita
5. **Drag-and-drop no Kanban** — arrastar card muda `status:` no arquivo correspondente.
6. **Criar história via formulário** — gera novo arquivo `STORY-XXX-slug.md` com ID auto-incrementado.
7. **Editar história** — abre modal, salva de volta no `.md`.

### Fase 3 — Sprint
8. **Sprint board** — filtra histórias por `sprint:`, mostra burndown simples (pontos restantes vs dias).
9. **Alocar história em sprint** — dropdown que seta `sprint: SPRINT-XX` na história.

### Fora do MVP (roadmap do próprio gerenciador, não construir agora)
- Busca full-text nos docs
- Histórico de mudanças (isso é papel do Git, não do app)
- Exportar relatório em PDF

---

## 5. Rotas de API (backend)

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/stories` | lista todas as histórias (lê pasta `backlog/`) |
| GET | `/api/stories/:id` | uma história específica |
| POST | `/api/stories` | cria nova história (gera ID, escreve arquivo) |
| PATCH | `/api/stories/:id` | atualiza campos do frontmatter (ex: status, sprint) |
| GET | `/api/decisions` | lista ADRs |
| POST | `/api/decisions` | cria novo ADR |
| GET | `/api/sprints` | lista sprints |
| GET | `/api/sprints/:id` | sprint + histórias vinculadas (join feito em memória) |
| GET | `/api/docs/:filename` | conteúdo renderizado de um doc simples (vision, roadmap, etc) |

Todas as respostas em JSON. O corpo markdown de cada item vem como HTML já renderizado (`marked`) num campo `bodyHtml`, e como texto puro em `bodyRaw` (pra edição).

---

## 6. UI/UX

### 6.1 Princípios
- **Denso, não bonito.** É ferramenta de trabalho pessoal, prioriza escaneabilidade sobre estética de produto.
- **Sem loading spinners desnecessários** — dados vêm do disco local, resposta é instantânea, não simular delay de rede.
- **Tudo em uma página (SPA simples)** — troca de "tela" é troca de conteúdo via JS, sem reload, usando `history.pushState` pra manter URL navegável (`/#kanban`, `/#roadmap`).

### 6.2 Layout geral

```
┌─────────────────────────────────────────────────┐
│  Sidebar (fixa, esquerda)  │   Conteúdo principal │
│  ─────────────────────    │                       │
│  Meu Projeto               │   [Header da view]    │
│                             │                       │
│  📋 Kanban                 │                       │
│  🗂️  Sprints                │                       │
│  🗺️  Roadmap                │                       │
│  📄 Docs                    │                       │
│    - Visão                  │                       │
│    - Modelo de negócio       │                       │
│    - Personas                │                       │
│    - Tech stack               │                       │
│  📜 Decisões (ADR)             │                       │
│                                 │                       │
└─────────────────────────────────────────────────┘
```

- Sidebar: `w-64`, fundo escuro (`bg-slate-900`), texto claro. Item ativo com borda lateral colorida.
- Conteúdo principal: fundo `bg-slate-50`, padding generoso (`p-8`).

### 6.3 Paleta (Tailwind)

| Uso | Classe |
|---|---|
| Fundo geral | `bg-slate-50` |
| Sidebar | `bg-slate-900` |
| Cards | `bg-white` + `shadow-sm` + `border border-slate-200` |
| Prioridade alta | `bg-red-100 text-red-700` (badge) |
| Prioridade média | `bg-amber-100 text-amber-700` |
| Prioridade baixa | `bg-slate-100 text-slate-600` |
| Status "done" | `bg-emerald-100 text-emerald-700` |
| Ação primária (botão) | `bg-indigo-600 hover:bg-indigo-700 text-white` |

### 6.4 Tela: Kanban

- 5 colunas (`backlog`, `todo`, `in-progress`, `review`, `done`), layout `grid grid-cols-5 gap-4`.
- Cada coluna: header com nome + contador (`Backlog (4)`), fundo levemente diferenciado (`bg-slate-100 rounded-lg p-3`).
- Card individual mostra: título, badge de prioridade, badge de pontos (estimativa), tag de epic. Clique abre modal com corpo completo (história + critérios de aceite como checklist clicável).
- Drag-and-drop nativo (`draggable="true"` + eventos `dragstart`/`dragover`/`drop`) — sem lib externa, é simples o suficiente pra vanilla JS.
- Ao soltar um card em outra coluna, dispara `PATCH /api/stories/:id` imediatamente (sem botão de "salvar" — otimista, mas com rollback visual se a API falhar).

### 6.5 Tela: Sprint board

- Seletor de sprint no topo (dropdown com `SPRINT-01`, `SPRINT-02`...).
- Mostra: objetivo da sprint, datas, lista de histórias com checkbox de "done", barra de progresso simples (`X de Y pontos concluídos`).

### 6.6 Tela: Roadmap

- Três colunas: `Agora | Próximo | Depois`, cada uma listando itens do `roadmap.md` (parseado das tabelas markdown ou, melhor, migrado pra frontmatter estruturado — ver nota abaixo).

> **Nota de decisão pendente:** `roadmap.md` hoje é markdown livre (tabela). Pra Fase 1 (só leitura), tudo bem renderizar a tabela como HTML direto. Se quiser que o roadmap seja editável pela UI na Fase 2, ele precisa virar pasta com um arquivo por item (mesmo padrão de `backlog/`). Decida isso antes de construir a tela de roadmap editável — registrar como ADR quando decidir.

### 6.7 Tela: Docs (viewer)

- Sidebar secundária (dentro da view) listando os docs de `01-negocio` e `02-tecnico`.
- Conteúdo renderizado com tipografia legível: usar plugin `@tailwindcss/typography` (classe `prose`) pra não estilizar markdown manualmente.

### 6.8 Tela: Decisões (ADR)

- Lista cronológica (mais recente primeiro), cada item mostra: ID, título, status (badge), data.
- Status `superseded` aparece com opacidade reduzida (`opacity-60`) e um link pro ADR que o substituiu.

### 6.9 Modal (componente reutilizável)

- Usado para: detalhe de história, criar/editar história, criar ADR.
- Fundo escurecido (`bg-black/50`), modal centralizado (`bg-white rounded-lg shadow-xl max-w-2xl`).
- Fecha com `Esc`, clique fora, ou botão X — implementar as três formas.

---

## 7. Regras de leitura/escrita nos `.md` (crítico)

1. **Nunca reescrever o arquivo inteiro ao editar um campo.** Usar `gray-matter` para parsear, alterar só o campo necessário no objeto de dados, e serializar de volta — isso preserva formatação do corpo que não foi tocado.
2. **Sempre atualizar `updated:` para a data atual** a cada escrita.
3. **Validar contra o schema do `type` antes de escrever** (ver `server/schemas/*.schema.json`). Se faltar campo obrigatório, a API retorna erro 400 e a UI mostra o problema — nunca escrever um frontmatter incompleto no disco.
4. **Geração de ID:** ao criar uma história nova, o backend escaneia `backlog/` por todos os `STORY-XXX`, pega o maior número, soma 1. Mesmo princípio para `ADR-XXX` e `SPRINT-XX`. Nunca deixar a UI/usuário digitar o ID manualmente — evita duplicidade.
5. **Nunca deletar arquivos pela UI na Fase 1/2.** Se uma história for cancelada, ela ganha `status: cancelled` (adicionar esse valor à enum), não é apagada — mantém histórico.

---

## 8. Ordem de implementação sugerida para o Claude Code

1. `docsReader.js` (ler e parsear pasta) + rota `GET /api/stories` — validar que o parsing funciona antes de qualquer UI.
2. `index.html` + sidebar estática + Tailwind via CDN.
3. Tela Kanban somente leitura (renderiza cards a partir da API).
4. Modal de detalhe (leitura).
5. `docsWriter.js` + `PATCH /api/stories/:id` + drag-and-drop funcional.
6. Formulário de criação de história + geração de ID.
7. Sprint board.
8. Roadmap e Docs viewer (mais simples, deixar por último).
9. ADR log.

---

## 9. Fora de escopo (não pedir ao Claude Code implementar sem discutir antes)

- Login/autenticação
- Deploy remoto / hospedagem
- Múltiplos projetos no mesmo gerenciador (por enquanto é um projeto por instância)
- Notificações, integrações externas (Slack, email)