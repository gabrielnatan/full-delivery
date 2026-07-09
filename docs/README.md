# Documentação do Projeto

> Índice central da documentação. Este é o primeiro arquivo que o Claude Code (ou você) lê.
> Comece por aqui e navegue para a seção que precisar.
>
> Todo `.md` (exceto `README.md`) segue o contrato de frontmatter definido em
> [PADRÕES DE DOCUMENTAÇÃO](../gerenciador-projetos/context-ia/PADROES-DOCUMENTACAO.md) —
> é o que o **gerenciador de projetos** lê para montar Kanban, Sprints, Roadmap, OKRs e Time.

## 📌 O que é

_(Resumo de uma linha do produto — detalhes em [Visão do Produto](01-negocio/vision.md).)_

## 🧭 Os 3 pilares

Cada pilar corresponde a um "chapéu" de liderança:

### 01 — Negócio (idealizar)
- [Visão](01-negocio/vision.md) — o que é o produto, pra quem, por quê.
- [Lean Canvas](01-negocio/lean-canvas.md) — problema, solução, canais, receita, custo.
- [Modelo de Negócio](01-negocio/business-model.md) — monetização, unit economics.
- [Concorrentes](01-negocio/concorrentes.md) — quem já resolve isso e como nos diferenciamos.
- [Métricas](01-negocio/metricas.md) — North Star + KPIs.
- [Riscos](01-negocio/riscos.md) — premissas e riscos que podem matar o negócio.
- [OKRs](01-negocio/okrs/) — objetivos e resultados-chave (topo da cadeia estratégica).
- [Personas](01-negocio/personas/) — perfil do público-alvo (um arquivo por persona).
- [Roadmap](01-negocio/roadmap.md) — horizontes Agora / Próximo / Depois.

### 02 — Técnico (estruturar)
- [Tech Stack](02-tecnico/tech-stack.md) — linguagem, framework, banco, infra e o porquê.
- [Arquitetura do Sistema](02-tecnico/system-architecture.md) — componentes e fluxos.
- [Integrações](02-tecnico/integrations.md) — serviços externos e parceiros.
- [Modelo de Dados](02-tecnico/data-model.md) — entidades e relacionamentos.
- [Decisões (ADR)](02-tecnico/decisions/) — decisões técnicas, uma por arquivo (inclui a escolha de stack).

### 04 — Time (gerenciar)
- [Roster](04-time/team.json) — pessoas, papéis, senioridade, skills, capacidade.
- [Squads e ownership](04-time/squads.json) — quem é dono de qual domínio.
- 1:1s ([04-time/1on1/](04-time/)) e metas de crescimento ([04-time/metas-pessoas/](04-time/)).

## 🚚 Entrega (liga os pilares)
- [Backlog](03-entrega/backlog/) — histórias de usuário (um arquivo = um card no Kanban).
- [Sprints](03-entrega/sprints/) — planejamento e acompanhamento por sprint.

## 🛠️ Operações
- [Setup ambiente local](05-ops/setup-ambiente-local.md) — subir o planejador e o app.
- [Vínculo Git ↔ tasks](05-ops/vinculo-git-tasks.md) — padrão de branch/commit e links.
- [Ambientes](05-ops/environments.md) — local, staging, prod.
- [Runbook](05-ops/runbook.md) — rodar local, deploy, troubleshooting.

## 🔖 Convenções

- Documentos em **Markdown**, idioma **pt-BR**.
- Todo `.md` (exceto `README.md`) começa com frontmatter YAML — ver os padrões.
- Decisões arquiteturais como **ADR** em `02-tecnico/decisions/` (um arquivo por decisão).
- A **stack é decisão por projeto** (ADR) — o template é agnóstico de linguagem.
- Datas sempre no formato absoluto (`AAAA-MM-DD`).
