# kickoff — Melhorias e Direção

> Documento vivo. Duas partes: **(A)** análise estratégica com a nova direção, e
> **(B)** a lista original de ideias com as suas marcações/observações preservadas.

---

# Parte A — Análise estratégica

## Objetivo (o que estamos otimizando)

Uma ferramenta que faça você **exercitar os três chapéus de um líder** — idealizar o
**negócio**, estruturar o **técnico** e gerenciar o **time** — pra treinar de verdade,
aplicar na criação de uma empresa e se credenciar pra **vagas de liderança**.
Os apps podem ser em **qualquer linguagem**.

## Veredito

A base atual é **boa e rara**: os `.md` são o banco de dados, um painel lê/edita, tudo em
git e legível por IA. **Não jogar fora — evoluir.** Dois desbalanceamentos a corrigir:

- **~70% Produto + Técnico, ~30% Time.** Gestão de pessoas (o chapéu mais valioso pra
  liderança) é a parte mais fraca — `team.json`/`squads.json` são só listas.
- **A base de backend puxa pra uma stack** (Node/Nest/multi-repo), o que contradiz o
  "qualquer linguagem". As OBS dos itens 6, 11 e 12 estão certas — cortar.

O problema não é a fundação, é o **balanceamento e o enquadramento**.

## O reframe: 3 pilares + 1 cockpit

Tornar os três chapéis **explícitos** na estrutura:

| Pilar | Pergunta de líder | Onde vive hoje | Estado |
|---|---|---|---|
| **1. Negócio** | Vale a pena existir? | `01-product/` | 🟡 raso |
| **2. Técnico** | Como construímos? | `02-architecture/` + ADRs | 🟢 bom |
| **3. Time** | Quem faz, com que capacidade? | espalhado em `03-delivery` | 🔴 fraco |
| **Entrega** (liga os 3) | O que, quando, feito? | `03-delivery/` | 🟢 bom |

Tese: um líder conecta **estratégia → OKR → épico → história → pessoa → sprint → retro**.
Hoje falta o começo (OKR) e o fim (pessoa/capacidade) dessa corrente. O **gerenciador** é o
cockpit onde você pilota os três pilares.

### Pilar 1 — Negócio (idealizar bem)
Hoje `vision`/`business-model`/`roadmap`/personas são finos. Adicionar:
- **Lean Canvas** (problema/solução/canais/receita/custo numa tela).
- **Análise de concorrentes** e **proposta de valor**.
- **North Star + KPIs** (como medir sucesso).
- **Riscos e premissas** (risk register).
- **OKRs** — topo da cadeia, amarra roadmap e épicos.

### Pilar 2 — Técnico (estruturar) — o mais maduro; ajustar pra ser agnóstico
- **Remover `backend/infra` do core** (assume Node/multi-repo) → vira exemplo opcional.
- Stack (Nest? Go? Rails? React? Flutter?) é **ADR por projeto**, não default imposto.
- Sem `frontend/`/`mobile/` default — escolha decidida na hora e registrada em ADR.
- Resultado: kickoff volta a ser **cérebro de planejamento, stack-neutro**.

### Pilar 3 — Time (gerenciar) — maior lacuna, maior valor pra sua meta
Hoje só listas. Adicionar gestão de pessoas de verdade:
- **Roster**: pessoa, papel, senioridade, **skills**, avatar.
- **Capacidade por sprint** e **alocação** (quem está sobre/subalocado).
- **Mapa de ownership** (squad → domínio) — Team Topologies.
- **1:1s e metas de crescimento por pessoa** — o artefato mais "de líder".
- Tela **"Time"** no cockpit: squads, carga e saúde do time.

## O que cortar (concordando com as OBS)
- ❌ **6. Docker do planejador** — o planejador é a ferramenta, não o app.
- ❌ **11. Golden-path NestJS** — apps em qualquer linguagem; vira exemplo, não base.
- ❌ **12. Stubs frontend/mobile** — decidido por projeto via ADR.
- Consequência: **demover `backend/` do núcleo**. Template = `docs/` (3 pilares) + `gerenciador-projetos/` (cockpit).

## Item 1 reimaginado: Onboarding Wizard (UI com steps + animação)
Não um `npm init`, e sim uma **UI bonita com passos** — o ritual de "fundar a empresa":

```
Passo 1 · Identidade   → nome, org, descrição        → config/project.json
Passo 2 · Negócio      → problema, solução, público   → vision.md + lean-canvas
Passo 3 · OKRs         → objetivos + resultados-chave  → okrs
Passo 4 · Técnico      → stack + 1ª ADR                → tech-stack.md + ADR-001
Passo 5 · Time         → pessoas, papéis, squads       → team.json + squads.json
Passo 6 · Primeira sprint → épicos/histórias iniciais → backlog + SPRINT-01
```
No fim, o projeto nasce **preenchido e coerente** nos três pilares.

## Estrutura proposta

```
kickoff/
├── config/project.json          ← nome, org (item 3)
├── CLAUDE.md                     ← guia pra IA (item 2)
├── docs/
│   ├── 01-negocio/              ← vision, lean-canvas, concorrentes, okrs, metricas, riscos, personas
│   ├── 02-tecnico/             ← tech-stack, arquitetura, ADRs, data-model, integracoes
│   ├── 03-entrega/             ← backlog, sprints
│   ├── 04-time/                ← roster, squads, capacidade, ownership, 1:1s  (NOVO pilar)
│   └── 05-ops/
└── gerenciador-projetos/        ← cockpit: Wizard, Kanban, Sprints, Roadmap, OKRs, Time, Docs
```

## Ordem de construção sugerida
1. **Config central + CLAUDE.md** (itens 3 e 2) — fundação barata.
2. **Reorganizar os 3 pilares** + remover backend do core.
3. **Camada de Time** (pilar 3) — maior lacuna e maior valor.
4. **OKRs + templates de negócio** (Lean Canvas, riscos, métricas).
5. **Onboarding Wizard** (item 1) — preenche os pilares.
6. Robustez (linter + testes, 4 e 5) e features (busca, roadmap edit, dark mode, arquivar — 7 a 10).

## Decisões pendentes (responda pra eu começar)
1. **Reorganizar as pastas** pros 3 pilares (`01-negocio / 02-tecnico / 03-entrega / 04-time`),
   ou manter a numeração atual e só **adicionar** Time e OKRs sem renomear?
   → **Resposta:** Reorganizado (`01-negocio`, `02-tecnico`, `03-entrega`, `04-time`, `05-ops`).
2. **Backend fora do core** — remover `backend/` do kickoff e transformar em exemplo/ADR?
   → **Resposta:** Sim — `backend/` removido; stack vira decisão por projeto (ADR).
3. **Peso do "gerenciar equipe"** — só roster + capacidade + ownership, ou também 1:1s e
   metas de pessoas (lado mais "líder-gente")?
   → **Resposta:** Completo — roster, capacidade, ownership, 1:1s e metas de pessoas na tela Time.

---

# Parte B — Lista original de ideias (com suas marcações)

## 🥇 Alto impacto — o que falta pra ser um template de verdade

- [x] **1. Script de scaffold** → **vira Onboarding Wizard** (UI com steps + animação, ver Parte A).
  OBS (você): não como `npm init`, e sim uma interface UI bonita com animação e steps para
  definições iniciais; não importa a quantidade de campos, deve ter uma definição inicial boa.

- [x] **2. `CLAUDE.md` na raiz** — guia que a IA lê automaticamente (onde começar, contrato de
  frontmatter, fluxo `STORY-XXX`, "não edite `.md` na mão").

- [x] **3. Um `config/project.json` central** — nome/org/descrição num só lugar; sidebar e
  título leem dele; o wizard só edita esse arquivo.

## 🥈 Robustez do planejador

- [x] **4. Doc linter + validação de referências cruzadas** — valida frontmatter contra schema
  e checa `sprint:`/`parent:`/`supersedes:` apontando pra IDs reais. Local + GitHub Action.

- [x] **5. Testes automatizados do gerenciador** — `docsReader`/`docsWriter`/geração de ID.

- [x] **6. Dockerizar o planejador** — ❌ **CORTADO.**
  OBS (você): não entendi, pois não usarei somente js/ts — pode ser qualquer linguagem nos apps.

## 🥉 Features do planejador

- [x] **7. Busca full-text** nos docs.
- [x] **8. Roadmap editável pela UI.**
- [x] **9. Dark mode + acessibilidade** na UI.
- [x] **10. Deletar/arquivar** na UI (status `cancelled` já existe).

## 🎁 Extras

- [x] **11. Golden-path de backend genérico** — ❌ **CORTADO.**
  OBS (você): não é necessário, pode ser qualquer linguagem, não só Nest.

- [x] **12. Stubs de frontend/mobile** — ❌ **CORTADO.**
  OBS (você): pode ser decidido na hora (Angular, React, Flutter); melhor não deixar default.

- [x] **13. `examples/`** — exemplo preenchido em `examples/diadema-entregas/` (marketplace de delivery).

---

## Suas anotações originais
Quero saber de você: a ideia é ser um planejador de projetos e gerenciador de equipe. Quero me
colocar como líder para aprender como fazer na vida real. Preciso idealizar bem o negócio,
estruturar a parte técnica e gerenciar a equipe — tudo para trazer para experiências reais de
criação de uma empresa e poder buscar ativamente vagas de cargos de liderança.
(→ respondido na Parte A.)
