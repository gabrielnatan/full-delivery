---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-043
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-04
parent: null
kind: feature
squad: identidade
tags:
  - mvp
  - sprint-04
  - piloto
assignees:
  - ana
---
# KYC — upload e validação de documentos

## História
Como lojista ou entregador, quero enviar documentos para verificação,
para operar no piloto com conformidade mínima.

## Critérios de aceite
- [ ] Upload de CNH (entregador) e CNPJ/contrato social (lojista)
- [ ] Status: `pending`, `approved`, `rejected` com motivo
- [ ] Armazenamento seguro (S3 ou equivalente)
- [ ] Bloqueio de operação até KYC aprovado (flag por role)

## Notas técnicas
identity-service. Revisão manual no MVP — fila admin futura.
