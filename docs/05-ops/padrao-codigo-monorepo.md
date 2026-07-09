---
created: '2026-07-09'
updated: '2026-07-09'
id: padrao-codigo-monorepo
type: runbook
status: active
tags:
  - dev
  - lint
  - typescript
  - monorepo
---
# Padrão de código do monorepo

Guia de **ESLint**, **Prettier**, **TypeScript base** e **EditorConfig** na raiz do repositório `full-delivery`.

> Tarefa de referência: [STORY-061](../03-entrega/backlog/STORY-061-eslint-prettier-e-typescript-base-compartilhados.md)

## Por que isso existe?

Todos os squads (NestJS em `services/*`) seguem o **mesmo padrão de código**:
- menos discussão de estilo em PR
- CI pode rodar `npm run lint` e `npm run format:check` na raiz
- cada serviço **herda** configuração comum e só adiciona o específico

## Arquivos na raiz

| Arquivo | O que é | Para que serve |
|---|---|---|
| `eslint.config.js` | Regras do **ESLint** (flat config) | Analisa TypeScript em `services/` e `packages/` — erros, más práticas, regras TS |
| `.prettierrc` | Config do **Prettier** | Formatação automática: aspas, vírgulas, largura de linha |
| `.prettierignore` | Pastas que o Prettier **ignora** | Evita formatar `docs/`, `gerenciador-projetos/`, `node_modules` |
| `tsconfig.base.json` | **TypeScript** compartilhado | Opções do compilador (`strict`, decorators NestJS) — serviços estendem este arquivo |
| `.editorconfig` | Convenções do **editor** | Indentação 2 espaços, LF, UTF-8 — funciona em qualquer IDE |

## Comandos (na raiz)

```bash
npm install          # instala eslint, prettier, typescript-eslint (devDependencies)
npm run lint         # verifica services/**/*.ts e packages/**/*.ts
npm run format       # formata arquivos suportados
npm run format:check # só verifica (útil no CI)
```

## O que cada ferramenta faz

### ESLint (`eslint.config.js`)

**Linter** — lê o código e aponta problemas lógicos e de estilo de código (não formata).

- Usa `@typescript-eslint/parser` para entender `.ts`
- Regras em `recommended` + aviso em variáveis não usadas
- Ignora: `docs/`, `gerenciador-projetos/`, `examples/`, `node_modules/`

Quando um serviço NestJS existir, o ESLint passará a analisar os `.ts` dentro de `services/<nome>/src/`.

### Prettier (`.prettierrc`)

**Formatador** — reescreve o arquivo com estilo consistente (não analisa bugs).

Config atual:
- aspas simples (`singleQuote: true`)
- vírgula final onde possível (`trailingComma: "all"`)
- linhas até 100 caracteres
- ponto e vírgula obrigatório

O `eslint-config-prettier` desliga regras do ESLint que conflitam com o Prettier.

### TypeScript (`tsconfig.base.json`)

**Compilador** — não roda na raiz sozinho; é a **base** que cada serviço estende.

Opções importantes para NestJS:
- `strict: true` — tipagem rigorosa
- `experimentalDecorators` / `emitDecoratorMetadata` — `@Injectable()`, etc.
- `esModuleInterop` — imports de CommonJS

### Como um serviço herda (STORY-064+)

Em `services/api-gateway/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

Cada squad só ajusta `outDir`, `rootDir` e `include` — o resto vem da base.

### EditorConfig (`.editorconfig`)

Garante que ao salvar no VS Code/Cursor a indentação seja **2 espaços** e fim de linha **LF**, alinhado ao Prettier.

## Fluxo no dia a dia

1. Desenvolver no seu serviço em `services/<seu-serviço>/`
2. Antes do commit: `npm run lint` e `npm run format` na raiz
3. PR com branch `feature/STORY-XXX-slug` (ver [vinculo-git-tasks.md](vinculo-git-tasks.md))

## O que não entra neste padrão

| Pasta | Motivo |
|---|---|
| `gerenciador-projetos/` | App separado com próprio `package.json` e lint |
| `docs/` | Markdown de planejamento |
| `services/courier-app/` | Flutter usa `pubspec.yaml`, não este stack TS |

## Referências

- [monorepo.md](../02-tecnico/monorepo.md) — organização do repositório
- [setup-ambiente-local.md](setup-ambiente-local.md) — subir ambiente
- [STORY-061](../03-entrega/backlog/STORY-061-eslint-prettier-e-typescript-base-compartilhados.md) — história que introduziu este padrão
