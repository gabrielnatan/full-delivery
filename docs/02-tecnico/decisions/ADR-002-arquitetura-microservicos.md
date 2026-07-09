---
created: '2026-07-09'
updated: '2026-07-09'
id: ADR-002
type: decision
status: accepted
supersedes: null
tags:
  - arquitetura
  - microservicos
---
# ADR-002 — Arquitetura de microserviços por squad

## Contexto
O produto envolve domínios distintos (identidade, lojas, pedidos, logística, pagamentos, apps). Precisamos de ownership claro e deploy independente conforme o time cresce.

## Decisão
Adotar **microserviços com 1 squad = 1 serviço** (ou app):
- `api-gateway` → plataforma
- `identity-service` → identidade
- `merchant-service` → estabelecimentos
- `order-service` → pedidos
- `logistics-service` → logística
- `payment-service` → pagamentos
- `client-app` → app-cliente
- `courier-app` → app-entregador

Comunicação: REST via gateway; eventos de domínio entre order, logistics e payment.

## Alternativas consideradas
| Opção | Prós | Contras |
|---|---|---|
| Monólito modular | Simples no início | Acoplamento e deploy único |
| Microserviços desde dia 1 | Ownership e escala | Overhead operacional |

Escolhemos microserviços com gateway e poucos serviços no MVP (plataforma, identidade, order) e expansão incremental.

## Consequências
- Cada squad evolui seu serviço com autonomia.
- Necessário contrato de API e observabilidade central (plataforma).
- Dados não são compartilhados via DB — apenas IDs e eventos.
