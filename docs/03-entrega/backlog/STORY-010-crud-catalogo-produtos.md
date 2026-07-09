---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-010
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: estabelecimentos
tags:
  - mvp
  - sprint-02
assignees:
  - gerson
---
# CRUD de catálogo de produtos

## História
Como lojista, quero cadastrar produtos com preço e estoque,
para que clientes possam montar pedidos.

## Critérios de aceite
- [ ] POST/GET/PATCH/DELETE /merchants/:id/products
- [ ] Campos: nome, descrição, preço, estoque, imagem (URL), ativo/inativo
- [ ] Listagem pública de produtos por estabelecimento
- [ ] Testes de API dos fluxos principais

## Notas técnicas
Depende do CRUD de estabelecimentos (STORY anterior do squad).
