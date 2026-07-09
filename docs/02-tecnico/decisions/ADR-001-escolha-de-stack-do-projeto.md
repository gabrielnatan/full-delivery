---
status: accepted
updated: '2026-07-09'
id: ADR-001
type: decision
supersedes: null
tags: []
---
# ADR-001 — Escolha de stack do projeto

## Contexto
O Full Delivery precisa de backend escalável, apps web e mobile, e time já familiarizado com a stack. A escolha impacta velocidade do MVP e contratação.

## Decisão
- **Backend:** NestJS (TypeScript), um projeto por microserviço.
- **Frontend cliente:** React.
- **App entregador:** Flutter.
- **Banco:** PostgreSQL por serviço.

## Alternativas consideradas
| Opção | Prós | Contras | Por que não |
|---|---|---|---|
| Monólito Go | Performance, deploy simples | Time sem proficiência Go | Curva de aprendizado no MVP |
| Node + Express | Leve | Menos estrutura para times grandes | NestJS traz padrões e DI |
| React Native nos dois apps | Código compartilhado | UX nativa do entregador | Flutter melhor para app motorista |

## Consequências
- Positivo: produtividade alta, ecossistema maduro, tipagem com TypeScript.
- Negativo: mais serviços para operar — mitigado com squad plataforma e gateway.
- Time precisa definir padrão de mensageria e CI cedo (SPRINT-01).
