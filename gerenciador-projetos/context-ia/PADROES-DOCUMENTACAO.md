# Padrões de Documentação

Este documento define o **contrato** entre os arquivos `.md` da pasta `docs/` e a aplicação `gerenciador-projetos`. Qualquer arquivo novo criado no projeto deve seguir isso, ou o parser do gerenciador quebra.

---

## 1. Restructure sugerida da árvore

Duas pastas mudam de "arquivo único" para "pasta com múltiplos arquivos", porque o Kanban/Sprint board precisa iterar item por item:

```
docs/
├── 01-negocio/                 (Pilar Negócio)
│   ├── vision.md
│   ├── lean-canvas.md
│   ├── business-model.md
│   ├── concorrentes.md · metricas.md · riscos.md · roadmap.md
│   ├── okrs/
│   │   └── OKR-001-slug.md
│   └── personas/
│       ├── PERSONA-001-slug.md
│       └── PERSONA-002-slug.md
│
├── 02-tecnico/                 (Pilar Técnico)
│   ├── tech-stack.md
│   ├── system-architecture.md
│   ├── integrations.md
│   ├── data-model.md
│   └── decisions/
│       ├── ADR-000-escolha-de-stack.md
│       └── ...
│
├── 03-entrega/                 (Entrega — liga os pilares)
│   ├── backlog/
│   │   ├── STORY-001-slug.md
│   │   └── ...
│   └── sprints/
│       ├── SPRINT-01.md
│       └── SPRINT-02.md
│
├── 04-time/                    (Pilar Time)
│   ├── team.json               (roster)
│   ├── squads.json             (ownership)
│   ├── 1on1/                   (1:1s)
│   └── metas-pessoas/          (metas de crescimento)
│
├── 05-ops/
│   ├── environments.md
│   └── runbook.md
│
└── README.md
```

**Por quê:** o gerenciador não precisa entender markdown complexo (parsear headers dentro de um arquivo enorme). Ele só faz `readdir` na pasta, lê o frontmatter de cada arquivo, e monta os cards. Um arquivo = um card no Kanban.

---

## 2. Regra global: todo arquivo tem frontmatter

Todo `.md` (exceto `README.md`) começa com um bloco YAML entre `---`. Isso é o que o app vai ler pra montar UI — o corpo do markdown é só pra humano ler.

```yaml
---
id: STORY-001
type: story          # vision | persona | business-model | roadmap | tech-stack
                      # data-model | integration | architecture | story | decision
                      # sprint | environment | runbook
status: backlog       # varia por tipo, ver seção 4
created: 2026-07-02
updated: 2026-07-02
tags: []
---
```

**Convenção de ID por tipo:**

| Tipo | Padrão de ID | Exemplo |
|---|---|---|
| História de usuário | `STORY-XXX` | STORY-001 |
| Decisão técnica (ADR) | `ADR-XXX` | ADR-001 |
| Sprint | `SPRINT-XX` | SPRINT-01 |
| Persona | `PERSONA-XXX` | PERSONA-001 |

IDs são sequenciais e **nunca são reutilizados**, mesmo se a história for cancelada (evita confusão em referências cruzadas antigas).

**Convenção de nome de arquivo:** `TIPO-ID-slug-kebab-case.md`
Exemplo: `STORY-001-alerta-teto-mei.md`

---

## 3. Template: `vision.md`

```markdown
---
id: vision
type: vision
status: active        # draft | active | deprecated
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Visão do Produto

## Problema
(qual dor real estamos resolvendo, em 2-3 frases)

## Solução
(o que o produto faz, em alto nível)

## Público-alvo
(quem é o cliente — link pra personas/)

## Proposta de valor
(por que esse cliente escolheria a gente e não o concorrente)

## Não-objetivos
(o que a gente explicitamente NÃO vai fazer nessa fase — evita scope creep)
```

---

## 4. Template: `personas/PERSONA-XXX-slug.md`

```markdown
---
id: PERSONA-001
type: persona
status: active
created: 2026-07-02
updated: 2026-07-02
tags: [mei, prestador-de-servico]
---

# Nome da Persona

## Perfil
(idade, tipo de negócio, faturamento médio, onde vende)

## Dores
- dor 1
- dor 2

## Comportamento financeiro atual
(como resolve hoje, que apps/bancos usa)

## O que faria migrar pra gente
(gatilho de troca)
```

---

## 5. Template: `business-model.md`

```markdown
---
id: business-model
type: business-model
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Modelo de Negócio

## Fontes de receita
(tabela: canal | % ou valor cobrado | racional)

## Estrutura de custo
(tabela: item | custo | fornecedor/parceiro)

## Unit economics
(receita média por cliente ativo, custo médio, margem)

## Ponto de equilíbrio
(quantos clientes ativos cobrem o custo fixo)
```

---

## 6. Template: `roadmap.md`

```markdown
---
id: roadmap
type: roadmap
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Roadmap

## Agora
| Feature | Prioridade | Status | Sprint alvo |
|---|---|---|---|
| Alerta de teto MEI | Alta | Em andamento | SPRINT-01 |

## Próximo
(mesma tabela, sem sprint definida ainda)

## Depois
(ideias validadas mas sem data)
```

---

## 7. Template: `tech-stack.md`

```markdown
---
id: tech-stack
type: tech-stack
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Stack Tecnológica

## Backend
(linguagem, framework, por quê — link pra ADR se houver)

## Frontend
(framework, por quê)

## Banco de dados
(qual, por quê)

## Infraestrutura
(onde roda, deploy, ambiente)

## Ferramentas de apoio
(lint, teste, CI/CD)
```

---

## 8. Template: `data-model.md`

```markdown
---
id: data-model
type: data-model
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Modelo de Dados

## Entidades principais
(tabela: entidade | descrição | atributos-chave)

## Relacionamentos
(descrição ou diagrama — pode usar mermaid)

\`\`\`mermaid
erDiagram
    USUARIO ||--o{ CONTA : possui
    CONTA ||--o{ TRANSACAO : gera
\`\`\`
```

---

## 9. Template: `integrations.md`

```markdown
---
id: integrations
type: integration
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Integrações

## [Nome do parceiro/serviço]
- **Tipo:** BaaS | Adquirente | Emissor de nota | Outro
- **Status:** simulado | planejado | integrado
- **Função no sistema:** (o que ele resolve)
- **Docs de referência:** (link, mesmo que fictício para estudo)
```

---

## 10. Template: `system-architecture.md`

```markdown
---
id: system-architecture
type: architecture
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Arquitetura do Sistema

## Visão geral
(diagrama de componentes — mermaid ou descrição)

## Componentes
(tabela: componente | responsabilidade | tecnologia)

## Fluxo de dados
(como uma transação percorre o sistema, passo a passo)
```

---

## 11. Template: `backlog/STORY-XXX-slug.md`

Este é o mais importante pro Kanban — cada arquivo é um card.

```markdown
---
id: STORY-001
type: story
status: backlog        # backlog | todo | in-progress | review | done
priority: high          # high | medium | low
points: 3                # estimativa (fibonacci: 1,2,3,5,8,13)
epic: gestao-financeira  # agrupador livre, usado pra filtrar no board
sprint: null              # null até ser puxada pra uma sprint, depois "SPRINT-01"
created: 2026-07-02
updated: 2026-07-02
tags: [mvp]
links: []              # opcional — branch, commit, PR (ver vinculo-git-tasks.md)
---

# Alerta de teto de faturamento MEI

## História
Como MEI, eu quero ser avisado quando estiver perto do limite anual de faturamento,
para que eu não estoure o teto sem perceber.

## Critérios de aceite
- [ ] Sistema calcula faturamento acumulado no ano
- [ ] Alerta disparado ao atingir 80% do teto
- [ ] Alerta disparado ao atingir 95% do teto
- [ ] Usuário vê o valor exato restante até o limite

## Notas técnicas
(qualquer detalhe de implementação relevante)
```

**Por que `status` fica no frontmatter e não em pasta separada (tipo `backlog/todo/`, `backlog/done/`):** mover um arquivo de pasta a cada mudança de status é ruim pro Git (perde histórico de diff) e pro app (tem que re-scanear). Só o campo `status` muda; o app filtra por esse campo pra montar as colunas do Kanban.

### Campo `links` (Git)

Opcional. Array de referências externas (branch, commit, PR, repo). Editável na seção **Links Git** do modal da task.

```yaml
links:
  - id: a1b2c3d4          # gerado pelo app (8 chars)
    type: branch           # branch | commit | pr | repo | other
    label: feature/STORY-047-cadastro-mei
    url: https://github.com/SUA-ORG/SEU-REPO/tree/feature/STORY-047-slug
    at: '2026-07-03T20:00:00.000Z'
```

**Convenção Git (branches/commits):** ver [vinculo-git-tasks.md](../../../docs/05-ops/vinculo-git-tasks.md) — todo branch/commit deve conter `STORY-XXX` para IA e humanos vincularem automaticamente.

---

## 12. Template: `decisions/ADR-XXX-slug.md`

```markdown
---
id: ADR-001
type: decision
status: accepted        # proposed | accepted | deprecated | superseded
supersedes: null          # ID de outro ADR, se aplicável
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Escolha de BaaS simulado para o estudo

## Contexto
(qual problema/decisão precisava ser tomada)

## Decisão
(o que foi decidido)

## Alternativas consideradas
(o que mais foi cogitado e por que foi descartado)

## Consequências
(o que essa escolha implica pra frente, positivo e negativo)
```

---

## 13. Template: `sprints/SPRINT-XX.md`

```markdown
---
id: SPRINT-01
type: sprint
status: planned        # planned | active | done
start_date: 2026-07-07
end_date: 2026-07-18
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Sprint 01

## Objetivo da sprint
(uma frase — o que precisa estar pronto no final)

## Histórias incluídas
- STORY-001
- STORY-002

(Nota: a lista aqui é só leitura humana. A fonte de verdade de "quais histórias
estão nessa sprint" é o campo `sprint:` dentro de cada STORY-XXX.md. Evita
inconsistência entre os dois lugares.)

## Retrospectiva
(preenchido ao final: o que funcionou, o que não funcionou)
```

---

## 14. Template: `environments.md`

```markdown
---
id: environments
type: environment
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Ambientes

| Ambiente | URL | Banco de dados | Propósito |
|---|---|---|---|
| local | localhost:3000 | sqlite/local | desenvolvimento |
| staging | - | - | testes de integração |
| prod (simulado) | - | - | demonstração |
```

---

## 15. Template: `runbook.md`

```markdown
---
id: runbook
type: runbook
status: active
created: 2026-07-02
updated: 2026-07-02
tags: []
---

# Runbook

## Como rodar local
\`\`\`bash
npm install
npm run dev
\`\`\`

## Variáveis de ambiente
(tabela: variável | descrição | obrigatória)

## Comandos comuns
(migrations, seed, testes)

## Troubleshooting
(problemas comuns e solução)
```

---

## 16. `README.md` (índice, único arquivo sem frontmatter obrigatório)

Deve listar a estrutura, explicar que todo `.md` segue frontmatter, e servir de ponto de entrada pro Claude Code carregar contexto.

---

## 17. Coisas para o `gerenciador-projetos` já nascer prevendo

Pensando no que vai dar problema conforme o projeto cresce:

- **Geração de ID:** decida agora se o ID é manual (você escreve `STORY-004`) ou se o app gera automaticamente escaneando o maior ID existente + 1. Manual é mais simples de começar; automático evita erro de duplicidade quando o projeto crescer.
- **Validação de schema:** vale criar um JSON Schema por `type` (ex: `story` exige `priority`, `points`, `epic`) e o app validar no load — se um frontmatter estiver incompleto, o app avisa em vez de quebrar silenciosamente.
- **Referências cruzadas quebradas:** se uma STORY referencia uma sprint que não existe mais, ou um ADR é superseded mas o link não é atualizado, isso vira dívida técnica silenciosa. Um "linter" simples que checa se todo `sprint:` e `supersedes:` aponta pra um ID real ajuda.
- **Duplo estado (arquivo vs pasta):** ficou definido acima — status sempre no frontmatter, nunca reforçado pela localização do arquivo em pastas. Uma regra só, sem ambiguidade.
- **Histórico de mudança de status:** o campo `updated` sozinho não diz *o que* mudou. Se quiser rastrear (ex: "quando essa história saiu de todo pra in-progress"), isso é histórico de Git (`git log` no arquivo) — não precisa duplicar isso dentro do markdown.