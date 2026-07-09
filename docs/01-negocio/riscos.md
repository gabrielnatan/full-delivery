---
status: active
updated: '2026-07-09'
id: riscos
type: risks
tags: []
---
# Riscos e Premissas

## Premissas críticas
| Premissa | Como validar |
|---|---|
| Estabelecimentos pagam taxa por entrega nacional | 10 lojas piloto com contrato |
| Entregadores aderem à rede | 50 cadastros ativos em 30 dias |
| Hubs/postos de coleta viáveis regionalmente | 2 parcerias em cidades piloto |
| Stack NestJS + Postgres sustenta microserviços | SPRINT-01 com 3 serviços no ar |

## Registro de riscos
| Risco | Probabilidade | Impacto | Mitigação | Dono |
|---|---|---|---|---|
| Complexidade excessiva de microserviços cedo | média | alto | Squad plataforma define contratos mínimos; começar com 3–4 serviços | Gabriel |
| Falta de entregadores na região piloto | alta | alto | Incentivo de lançamento + onboarding simples no app | Mark |
| Integração de pagamentos atrasa MVP | média | alto | Mock no order-service; payment-service em paralelo | Elton |
| Concorrente baixa preço na mesma região | média | médio | Diferencial de SLA e rastreio, não só preço | Joana |
