---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-005
type: story
status: backlog
priority: high
points: 5
epic: mvp
sprint: SPRINT-02
parent: null
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-02
assignees:
  - gabriel-natan
---
# Barramento de eventos entre microserviços

## História
Como squad de plataforma, quero um barramento de eventos (Redis Streams ou RabbitMQ),
para que pedidos, pagamentos e logística se comuniquem de forma desacoplada.

## Critérios de aceite
- [ ] Biblioteca compartilhada de publicação/consumo de eventos no monorepo
- [ ] Eventos padronizados: `order.created`, `payment.approved`, `delivery.assigned`
- [ ] Dead-letter e retry configurados no ambiente local
- [ ] Documentação do contrato de eventos em `docs/02-tecnico/`

## Notas técnicas
Serviço `api-gateway` + lib compartilhada. Base para order-service e payment-service.
