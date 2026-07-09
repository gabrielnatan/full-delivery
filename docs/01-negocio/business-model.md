---
status: active
updated: '2026-07-09'
id: business-model
type: business-model
tags: []
---
# Modelo de Negócio

## Fontes de receita
| Canal | Valor | Racional |
|---|---|---|
| Taxa por entrega | % ou valor fixo por corrida | Principal receita transacional |
| Comissão sobre pedido | 3–8% do GMV | Alinhada ao volume do estabelecimento |
| Plano estabelecimento | Mensalidade por faixa de volume | Previsibilidade para lojas com alto giro |
| Serviços premium | SLA prioritário, seguro | Diferenciação em entregas críticas |

## Estrutura de custo
| Item | Tipo | Observação |
|---|---|---|
| Infra (cloud, DB, filas) | Fixo + variável | Postgres, NestJS, observabilidade |
| Pagamentos | Variável | Gateway + split estabelecimento/entregador |
| Hubs e coleta | Variável | Parcerias regionais |
| Aquisição | Variável | CAC cliente, entregador e lojista |
| Time | Fixo | Squads por microserviço |

## Unit economics (hipótese MVP)
- Receita média por entrega: R$ 8–15 (taxa + comissão).
- Custo variável por entrega: R$ 3–6 (pagamento, infra marginal, suporte).
- Margem bruta alvo: > 40% após escala regional.

## Ponto de equilíbrio
Validar com 500 entregas/semana em uma região piloto cobrindo custo fixo do time enxuto + infra.
