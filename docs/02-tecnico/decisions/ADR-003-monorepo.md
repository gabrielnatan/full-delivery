---
created: '2026-07-09'
updated: '2026-07-09'
id: ADR-003
type: decision
status: accepted
supersedes: null
tags:
  - monorepo
  - arquitetura
---
# ADR-003 — Monorepo único para código de produção

## Contexto
O Full Delivery adota microserviços (ADR-002) com squads donos de cada serviço. Surgiu a dúvida: **um repositório para tudo** ou **um repositório por microserviço/app**? Front (React), mobile (Flutter) e backends precisam de lugar definido.

## Decisão
Usar **um único repositório Git** (`full-delivery`) em modelo **monorepo**:

- Todo código de produção vive em `services/<nome>` — backends, web e mobile.
- Código compartilhado entre serviços vive em `packages/`.
- Planejamento (`docs/`) e ferramentas (`gerenciador-projetos/`) ficam na mesma raiz.
- **Deploy continua independente** por serviço (CI detecta pasta alterada e publica só aquele artefato).

Não adotamos multi-repo (um GitHub repo por microserviço) nesta fase.

## Alternativas consideradas
| Opção | Prós | Contras | Por que não (agora) |
|---|---|---|---|
| Multi-repo | Permissões granulares, release isolado | Overhead de PR cross-repo, versão de libs compartilhadas, onboarding lento | Time pequeno (~8 pessoas); MVP precisa de velocidade |
| Monorepo | Visão única, refatoração fácil, `packages/` compartilhado | Repo grande, CI precisa ser inteligente | Escolhido — equilíbrio certo para o estágio atual |

## Consequências
- Positivo: um clone sobe todo o ecossistema; squads acham seu serviço em `services/`.
- Positivo: ADR, histórias e código no mesmo lugar para IA e humanos.
- Negativo: disciplina de CI obrigatória para não deployar tudo a cada merge.
- Revisão futura: se o time passar de ~20 devs ou releases divergirem muito (mobile vs API), reavaliar extração de `courier-app` ou serviços maduros para repos próprios.

## Referências
- Guia prático: [monorepo.md](../monorepo.md)
- ADR-002 (microserviços por squad)
- STORY-059 (estrutura `services/`)
