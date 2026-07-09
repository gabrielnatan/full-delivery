# Diadema Entregas (exemplo kickoff)

Projeto **fictício** de marketplace local de delivery — mostra um kickoff preenchido nos três
pilares de líder (Negócio, Técnico, Time) com entrega ativa.

## O que tem dentro

| Pilar | Conteúdo de exemplo |
| --- | --- |
| **Negócio** | Visão, lean canvas, concorrentes, métricas, riscos, roadmap, OKR-001, 2 personas |
| **Técnico** | Stack Go + Flutter, arquitetura, ADR-000 (stack) e ADR-001 (Pix) |
| **Time** | 4 pessoas, 2 squads, 1:1 com Ana, meta de crescimento do Bruno |
| **Entrega** | Sprint 01 ativa + 6 histórias (vários status, assignees e pontos) |

## Rodar no gerenciador

```bash
# Na raiz do kickoff — faça backup do seu docs/ e config/ antes
cp -r examples/diadema-entregas/config ./
cp -r examples/diadema-entregas/docs ./

cd gerenciador-projetos
npm install
npm run dev
```

Abra http://localhost:4001 — sidebar mostra **Diadema Entregas**, Kanban com cards, tela Time
com capacidade/alocação e OKRs populados.

## Só validar (sem copiar)

```bash
cd gerenciador-projetos
KICKOFF_DOCS=../examples/diadema-entregas/docs npm run lint:docs
```
