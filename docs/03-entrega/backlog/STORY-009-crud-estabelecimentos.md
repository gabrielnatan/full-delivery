---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-009
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
# CRUD de estabelecimentos

## História
Como lojista, quero cadastrar e editar meu estabelecimento,
para começar a vender pelo Full Delivery.

## Critérios de aceite
- [ ] Bootstrap `merchant-service` com Postgres próprio
- [ ] POST/GET/PATCH /merchants vinculado ao `owner_user_id` do identity
- [ ] Campos: nome, CNPJ, endereço, horário de funcionamento, status
- [ ] Validação de CNPJ e autorização (só dono edita)

## Notas técnicas
Serviço `merchant-service`.
