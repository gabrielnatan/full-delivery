---
id: setup-ambiente-local
type: guide
status: active
tags: [dev, setup]
created: 2026-07-09
updated: 2026-07-09
---

# Setup do ambiente local

> Como subir **o planejador** e **o app** na sua máquina. O kickoff é agnóstico de stack —
> a forma de rodar o app depende da linguagem/framework que você escolher (registre a escolha
> em um [ADR](../02-tecnico/decisions/)).

## 1. Planejador (gerenciador-projetos)

O cockpit do projeto — lê e edita os `.md` de `docs/`.

```bash
cd gerenciador-projetos
npm install
npm run dev        # http://localhost:4001
```

Não depende do app: funciona mesmo antes de existir uma linha de código do produto.

## 2. O app (a definir por projeto)

A stack é decisão sua, registrada em `docs/02-tecnico/decisions/ADR-000-escolha-de-stack.md`.
Depois de escolher, documente aqui os comandos reais. Um esqueleto comum:

```bash
# exemplo genérico — troque pelos comandos da sua stack
<instalar dependências>       # ex.: npm install / go mod download / bundle install
<subir serviços de apoio>     # ex.: docker compose up -d (Postgres, Redis…)
<rodar migrations>            # se aplicável
<iniciar o app>               # ex.: npm run dev / go run ./... / rails s
```

> Se você optar por **microsserviços/multi-repo**, crie um repo orquestrador próprio
> (`docker compose` + um `make up`) e descreva-o aqui. O template não impõe esse padrão.

## Pré-requisitos

- **Git** e **Node.js** (para o planejador).
- Ferramentas da stack escolhida (a definir no ADR de stack).

## Referências

- [runbook.md](runbook.md) — operação geral e troubleshooting
- [../02-tecnico/tech-stack.md](../02-tecnico/tech-stack.md) — a stack e o porquê
- [../02-tecnico/decisions/ADR-000-escolha-de-stack.md](../02-tecnico/decisions/ADR-000-escolha-de-stack.md)
