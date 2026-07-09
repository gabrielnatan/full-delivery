#!/usr/bin/env node
/**
 * Enriquece a documentação do Full Delivery via docsWriter (frontmatter + updated).
 * Uso: node gerenciador-projetos/scripts/enrich-full-delivery-docs.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDoc, updateDoc } from '../server/lib/docsWriter.js';
import { DIRS } from '../server/lib/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function patch(filePath, content, data = {}) {
  await updateDoc(filePath, ({ data: cur, content: prev }) => ({
    content,
    data: { ...cur, ...data },
  }));
}

async function main() {
  // --- Negócio ---
  await patch(DIRS.negocio + '/vision.md', `# Visão do Produto

## Problema
Estabelecimentos de todo o Brasil precisam entregar produtos com previsibilidade e escala, mas hoje dependem de operadores regionais caros, prazos imprevisíveis ou logística própria fragmentada. Consumidores compram online e não confiam no prazo nem na integridade da entrega.

## Solução
O **Full Delivery** conecta estabelecimentos, entregadores e clientes em uma rede nacional com postos de coleta, centros de distribuição e entregadores independentes (qualquer veículo). Cada pedido é rastreado ponta a ponta com SLA visível.

## Público-alvo
- **Clientes** que compram online e querem receber com confiança em qualquer cidade.
- **Estabelecimentos e logistas** que precisam vender e entregar em escala nacional.
- **Entregadores** que buscam renda flexível aceitando corridas na rede.

Ver [personas/](personas/).

## Proposta de valor
Garantia de entrega no prazo, com rastreamento em tempo real e rede logística que combina hubs regionais com última milha descentralizada — sem depender de um único operador.

## Não-objetivos
- Frota própria de veículos nesta fase.
- Entrega internacional.
- Marketplace de produtos genérico sem logística integrada (foco em entrega confiável, não só vitrine).
`, { status: 'active' });

  await patch(DIRS.negocio + '/lean-canvas.md', `# Lean Canvas

## Problema
1. Estabelecimentos não conseguem entregar em todo o Brasil com custo e prazo previsíveis.
2. Clientes não confiam no status e na data de entrega de compras online.
3. Entregadores não têm uma plataforma unificada para corridas de múltiplos vendedores.

## Solução
Plataforma nacional que orquestra coleta em postos/hubs, roteirização e última milha com entregadores independentes.

## Proposta de valor única
Entrega garantida com rastreamento e rede híbrida (hubs + entregadores locais), conectando qualquer estabelecimento a qualquer cliente no país.

## Segmentos de clientes
| Segmento | Quem é | Dor principal |
|---|---|---|
| Cliente final | Comprador online | Prazo incerto, falta de rastreio |
| Estabelecimento | Loja, e-commerce, logista | Custo alto e cobertura limitada |
| Entregador | Motorista, motoboy, van | Renda irregular, apps fragmentados |

## Canais
App cliente (React), app entregador (Flutter), portal/API para estabelecimentos, parcerias com hubs logísticos.

## Fontes de receita
Taxa por entrega, comissão sobre pedido, planos para estabelecimentos com volume.

## Estrutura de custo
Infra cloud, pagamentos, suporte, hubs de coleta (parcerias), aquisição de entregadores e estabelecimentos.

## Métricas-chave
Entregas concluídas no prazo, NPS cliente, entregadores ativos/semana, GMV.

## Vantagem injusta
Rede de coleta + distribuição pensada para escala nacional desde o MVP, com squads donos de cada microserviço.
`, { status: 'active' });

  await patch(DIRS.negocio + '/business-model.md', `# Modelo de Negócio

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
`, { status: 'active' });

  await patch(DIRS.negocio + '/roadmap.md', `# Roadmap

## Agora
| Feature | Prioridade | Status | Sprint alvo | Squad |
|---|---|---|---|---|
| Bootstrap monorepo e microserviços | Alta | Em andamento | SPRINT-01 | plataforma |
| Autenticação e perfis | Alta | Backlog | SPRINT-01 | identidade |
| Configuração de projeto e ambientes | Alta | Backlog | SPRINT-01 | plataforma |

## Próximo
| Feature | Prioridade | Status | Squad |
|---|---|---|---|
| Cadastro de estabelecimentos | Alta | Planejado | estabelecimentos |
| Fluxo de pedido (criar → confirmar) | Alta | Planejado | pedidos |
| App cliente — catálogo e checkout | Média | Planejado | app-cliente |
| Aceite de corrida no app entregador | Média | Planejado | app-entregador |
| Pagamento com split | Alta | Planejado | pagamentos |

## Depois
| Feature | Prioridade | Squad |
|---|---|---|
| Postos de coleta e hubs | Média | logistica |
| Roteirização inteligente | Média | logistica |
| SLA e garantia de entrega | Alta | pedidos + logistica |
| Expansão multi-região | Alta | plataforma |
`, { status: 'active' });

  await patch(DIRS.negocio + '/concorrentes.md', `# Análise de Concorrentes

## Panorama
| Concorrente | Público | Pontos fortes | Pontos fracos | Modelo |
|---|---|---|---|---|
| iFood / Rappi | Restaurantes e consumo imediato | Base instalada, UX madura | Foco em food delivery urbano; taxas altas | Comissão + entrega |
| Melhor Envio / Loggi | E-commerce e lojistas | Cotação multi-transportadora | Menos controle da última milha própria | Frete agregado |
| Correios / transportadoras | Envio nacional | Cobertura ampla | Prazo e rastreio inconsistentes | Frete tradicional |
| Entregadores informais / WhatsApp | Pequenos vendedores | Custo baixo, flexível | Sem escala, sem garantia | Informal |

## Nossa diferenciação
- Rede própria de orquestração (hubs + entregadores) com **garantia de SLA** visível ao cliente.
- Cobertura nacional pensada desde o desenho (não só grandes capitais).
- Arquitetura de microserviços: cada domínio evolui com squad dono.

## Ameaças
- Grandes players replicarem modelo híbrido hub + app.
- Regulação trabalhista de entregadores.
- Guerra de preços em taxa de entrega nas regiões piloto.
`, { status: 'active' });

  await patch(DIRS.negocio + '/metricas.md', `# Métricas

## North Star Metric
**Entregas concluídas no prazo** — captura valor para cliente, estabelecimento e entregador.

## KPIs por área
| Métrica | O que mede | Meta MVP | Como coletar |
|---|---|---|---|
| Entregas no prazo (%) | Qualidade operacional | ≥ 92% | order-service + logistics-service |
| Entregadores ativos/semana | Oferta de última milha | 50 na região piloto | logistics-service |
| Estabelecimentos ativos | Lado oferta | 20 no piloto | merchant-service |
| Pedidos concluídos/semana | Tração | 200 | order-service |
| NPS cliente | Satisfação | ≥ 40 | pesquisa pós-entrega |
| GMV | Volume transacionado | R$ 50k/mês piloto | payment-service |

## Cadência de acompanhamento
- **Diário:** entregas, pedidos, incidentes (squads operacionais).
- **Semanal:** review de sprint + OKR-001 (Joana + tech-lead).
- **Mensal:** unit economics e expansão regional.
`, { status: 'active' });

  await patch(DIRS.negocio + '/riscos.md', `# Riscos e Premissas

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
`, { status: 'active' });

  // OKR
  await patch(path.join(DIRS.okrs, 'OKR-001-validar-mvp.md'), `# Validar MVP

## Resultados-chave
- [ ] 20 estabelecimentos cadastrados e publicando catálogo (merchant-service)
- [ ] 50 entregadores ativos aceitando corridas na região piloto (logistics-service)
- [ ] 200 pedidos concluídos com ≥ 92% no prazo (order + logistics)
- [ ] 3 microserviços backend + gateway em produção de staging (plataforma)
`, {
    status: 'active',
    objective: 'Validar MVP do Full Delivery na região piloto',
    period: '2026-Q3',
    owner: 'joana',
    progress: 0,
  });

  // Personas
  const personas = [
    {
      file: 'PERSONA-001-cliente.md',
      id: 'PERSONA-001',
      tags: ['cliente', 'consumidor'],
      title: 'Mariana — Cliente online',
      body: `# Mariana — Cliente online

## Perfil
28 anos, compra roupas e eletrônicos online 2–3x/mês, mora em cidade média fora das capitais.

## Dores
- Prazo de entrega incerto e rastreio impreciso.
- Medo de extravio sem resposta rápida do vendedor.
- Frete caro para cidades menores.

## Comportamento financeiro atual
Usa marketplaces nacionais e Instagram; paga no PIX ou cartão; compara frete antes de fechar.

## O que faria migrar pra gente
Rastreamento em tempo real, data garantida e suporte centralizado em caso de atraso.
`,
    },
    {
      file: 'PERSONA-002-entregador.md',
      id: 'PERSONA-002',
      tags: ['entregador', 'motorista'],
      title: 'Carlos — Entregador',
      body: `# Carlos — Entregador

## Perfil
35 anos, motoboy e carro utilitário, faz entregas para 3 apps diferentes na região.

## Dores
- Corridas mal pagas e ociosidade entre picos.
- Apps diferentes com regras e pagamentos fragmentados.
- Falta de previsibilidade de ganho semanal.

## Comportamento financeiro atual
Recebe por corrida via PIX; prefere pagamento rápido (D+0 ou D+1).

## O que faria migrar pra gente
Volume constante de corridas, pagamento transparente e rotas otimizadas entre coleta e entrega.
`,
    },
    {
      file: 'PERSONA-003-logista.md',
      id: 'PERSONA-003',
      tags: ['estabelecimento', 'logista'],
      title: 'Roberto — Logista / Lojista',
      body: `# Roberto — Logista / Lojista

## Perfil
Dono de e-commerce de autopeças com 80–150 pedidos/dia, envia para todo o Brasil.

## Dores
- Cotação de frete complexa e múltiplas transportadoras.
- Reclamação de cliente por atraso sem visibilidade.
- Custo logístico come come a margem.

## Comportamento financeiro atual
Negocia contrato com transportadoras; usa Melhor Envio para parte dos envios.

## O que faria migrar pra gente
Uma API/plataforma só para cotar, despachar e rastrear com SLA e repasse claro.
`,
    },
  ];

  for (const p of personas) {
    const fp = path.join(DIRS.personas, p.file);
    try {
      await updateDoc(fp, () => ({
        content: p.body,
        data: { id: p.id, type: 'persona', status: 'active', tags: p.tags },
      }));
    } catch (err) {
      if (err.code === 'ENOENT') {
        await createDoc(fp, { id: p.id, type: 'persona', status: 'active', tags: p.tags }, p.body);
      } else throw err;
    }
  }

  // --- Técnico ---
  await patch(DIRS.tecnico + '/tech-stack.md', `# Stack Tecnológica

## Backend
- **NestJS** (TypeScript) — um serviço por squad/domínio.
- **PostgreSQL** — banco por serviço (schema isolado).
- **Comunicação:** REST síncrono via API Gateway; eventos assíncronos (fila — a definir em ADR).

## Frontend
- **React** — app web cliente (\`client-app\`, squad app-cliente).
- **Flutter** — app entregador (\`courier-app\`, squad app-entregador).

## Banco de dados
- **PostgreSQL** — consistência transacional em pedidos, pagamentos e cadastros.

## Infraestrutura
- Monorepo com serviços em \`services/<nome>\`.
- API Gateway (\`api-gateway\`) como ponto único de entrada.
- Ambientes: local → staging → produção (ver [environments](../05-ops/environments.md)).

## Ferramentas de apoio
- ESLint, Prettier, testes unitários/e2e por serviço.
- CI por serviço (pipeline a configurar na SPRINT-01).
- Observabilidade: logs estruturados + health checks (plataforma).

## Por quê
A equipe já tem experiência com NestJS, React e Flutter — reduz curva de aprendizado no MVP.
Decisão registrada em [ADR-001](decisions/ADR-001-escolha-de-stack-do-projeto.md).
Arquitetura de microserviços em [ADR-002](decisions/ADR-002-arquitetura-microservicos.md).
`, { status: 'active' });

  await patch(DIRS.tecnico + '/system-architecture.md', `# Arquitetura do Sistema

## Visão geral
Arquitetura de **microserviços**: cada squad é dono de um serviço deployável. O **api-gateway** centraliza autenticação, roteamento e rate limit.

\`\`\`mermaid
flowchart TB
    subgraph clients [Clientes]
        CA[client-app React]
        COU[courier-app Flutter]
        MER[Portal estabelecimento]
    end

    GW[api-gateway]

    subgraph services [Microserviços — 1 squad = 1 serviço]
        ID[identity-service]
        MS[merchant-service]
        OS[order-service]
        LS[logistics-service]
        PS[payment-service]
    end

    CA --> GW
    COU --> GW
    MER --> GW
    GW --> ID
    GW --> MS
    GW --> OS
    GW --> LS
    GW --> PS
    OS -.->|eventos| LS
    OS -.->|eventos| PS
\`\`\`

## Componentes
| Serviço | Squad | Responsabilidade | Stack |
|---|---|---|---|
| api-gateway | plataforma | Roteamento, auth middleware, contratos OpenAPI | NestJS |
| identity-service | identidade | Login, JWT, perfis, papéis (cliente/entregador/lojista) | NestJS + Postgres |
| merchant-service | estabelecimentos | Lojas, catálogo, horários | NestJS + Postgres |
| order-service | pedidos | Pedidos, status, histórico | NestJS + Postgres |
| logistics-service | logistica | Entregadores, corridas, hubs, rotas | NestJS + Postgres |
| payment-service | pagamentos | Cobrança, split, repasse | NestJS + Postgres |
| client-app | app-cliente | UI comprador | React |
| courier-app | app-entregador | UI entregador | Flutter |

## Fluxo de dados — pedido ponta a ponta
1. Cliente autentica via **identity-service** (token JWT no gateway).
2. Cliente monta carrinho consultando **merchant-service**.
3. **order-service** cria pedido e emite evento \`order.created\`.
4. **payment-service** processa pagamento e confirma \`payment.approved\`.
5. **logistics-service** aloca entregador/coleta e atualiza rastreio.
6. Apps consultam status via gateway; eventos mantêm serviços desacoplados.

## Princípios
- Banco por serviço — sem join cross-service no DB.
- Contratos versionados no gateway (plataforma).
- Deploy independente por squad.
`, { status: 'active' });

  await patch(DIRS.tecnico + '/data-model.md', `# Modelo de Dados

Cada microserviço possui schema Postgres próprio. Entidades compartilhadas referenciam IDs externos (ex.: \`user_id\` do identity-service).

## Entidades por serviço
| Serviço | Entidade | Descrição | Atributos-chave |
|---|---|---|---|
| identity-service | User | Usuário da plataforma | id, email, password_hash, role |
| identity-service | Profile | Dados de perfil | user_id, name, phone, document |
| merchant-service | Merchant | Estabelecimento | id, name, cnpj, address, owner_user_id |
| merchant-service | Product | Item do catálogo | id, merchant_id, name, price, stock |
| order-service | Order | Pedido | id, customer_id, merchant_id, status, total |
| order-service | OrderItem | Linha do pedido | order_id, product_id, qty, unit_price |
| logistics-service | Courier | Entregador | id, user_id, vehicle_type, status |
| logistics-service | Delivery | Corrida/entrega | id, order_id, courier_id, hub_id, status |
| logistics-service | Hub | Posto/coleta | id, name, geo, capacity |
| payment-service | Payment | Transação | id, order_id, amount, status, method |
| payment-service | Payout | Repasse | id, payment_id, recipient_type, amount |

## Relacionamentos (lógicos — entre serviços)
\`\`\`mermaid
erDiagram
    USER ||--o| PROFILE : possui
    MERCHANT ||--o{ PRODUCT : oferece
    ORDER ||--|{ ORDER_ITEM : contem
    ORDER ||--o| DELIVERY : gera
    COURIER ||--o{ DELIVERY : executa
    HUB ||--o{ DELIVERY : origina
    ORDER ||--o| PAYMENT : pago_por
    PAYMENT ||--o{ PAYOUT : distribui
\`\`\`
`, { status: 'active' });

  await patch(DIRS.tecnico + '/integrations.md', `# Integrações

## Gateway de pagamentos (a definir)
- **Tipo:** Adquirente / PIX / cartão
- **Status:** planejado
- **Função:** Cobrança do cliente e split para estabelecimento e entregador
- **Serviço dono:** payment-service

## Mapas e geolocalização
- **Tipo:** API externa (Google Maps / OpenStreetMap)
- **Status:** planejado
- **Função:** Rotas, distância e ETA no logistics-service e apps
- **Serviço dono:** logistics-service

## Notificações push
- **Tipo:** FCM (Firebase Cloud Messaging)
- **Status:** planejado
- **Função:** Alertas de pedido, corrida e entrega nos apps
- **Serviço dono:** a definir (evento consumido pelos apps)

## E-mail transacional
- **Tipo:** Provedor SMTP/API (SendGrid, Resend, etc.)
- **Status:** planejado
- **Função:** Confirmação de cadastro, recibo de pedido
- **Serviço dono:** identity-service / order-service
`, { status: 'active' });

  // ADR-001
  await patch(path.join(DIRS.decisions, 'ADR-001-escolha-de-stack-do-projeto.md'), `# ADR-001 — Escolha de stack do projeto

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
`, { status: 'accepted' });

  // ADR-002 — criar se não existir
  const adr2Path = path.join(DIRS.decisions, 'ADR-002-arquitetura-microservicos.md');
  const adr2Body = `# ADR-002 — Arquitetura de microserviços por squad

## Contexto
O produto envolve domínios distintos (identidade, lojas, pedidos, logística, pagamentos, apps). Precisamos de ownership claro e deploy independente conforme o time cresce.

## Decisão
Adotar **microserviços com 1 squad = 1 serviço** (ou app):
- \`api-gateway\` → plataforma
- \`identity-service\` → identidade
- \`merchant-service\` → estabelecimentos
- \`order-service\` → pedidos
- \`logistics-service\` → logística
- \`payment-service\` → pagamentos
- \`client-app\` → app-cliente
- \`courier-app\` → app-entregador

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
`;
  try {
    await updateDoc(adr2Path, () => ({
      content: adr2Body,
      data: { id: 'ADR-002', type: 'decision', status: 'accepted', supersedes: null, tags: ['arquitetura', 'microservicos'] },
    }));
  } catch (err) {
    if (err.code === 'ENOENT') {
      await createDoc(adr2Path, {
        id: 'ADR-002',
        type: 'decision',
        status: 'accepted',
        supersedes: null,
        tags: ['arquitetura', 'microservicos'],
      }, adr2Body);
    } else throw err;
  }

  // --- Entrega: stories ---
  const stories = [
    {
      file: 'STORY-001-configuracoes-dos-projetos.md',
      title: 'Configurações do monorepo e ambientes',
      squad: 'plataforma',
      kind: 'chore',
      priority: 'high',
      points: 5,
      assignees: ['gabriel-natan'],
      body: `## História
Como tech lead, quero o monorepo configurado com padrões de lint, env e scripts por serviço,
para que cada squad possa desenvolver seu microserviço de forma consistente.

## Critérios de aceite
- [ ] Estrutura \`services/<nome>\` criada para cada microserviço do mapa de squads
- [ ] Variáveis de ambiente documentadas por serviço
- [ ] Scripts \`dev\`, \`build\` e \`test\` funcionando no mínimo para api-gateway
- [ ] README na raiz explicando como subir o ambiente local

## Notas técnicas
Squad **plataforma** — serviço \`api-gateway\`. Base para STORY-002 e STORY-003.
`,
    },
    {
      file: 'STORY-002-iniciar-a-base-deles.md',
      title: 'Bootstrap dos microserviços NestJS',
      squad: 'plataforma',
      kind: 'feature',
      priority: 'high',
      points: 8,
      assignees: ['gabriel-natan', 'ana'],
      body: `## História
Como squad de plataforma, quero os esqueletos NestJS dos serviços principais,
para que os squads de domínio comecem a implementar features em paralelo.

## Critérios de aceite
- [ ] Projetos NestJS criados: api-gateway, identity-service, order-service
- [ ] Health check (\`/health\`) em cada serviço
- [ ] Docker Compose local com Postgres (instância ou schemas separados)
- [ ] Gateway roteando pelo menos identity-service

## Notas técnicas
Depende de STORY-001. Identidade (Ana) assume identity-service após o bootstrap.
`,
    },
    {
      file: 'STORY-003-organizar-projeto-com-microservicos.md',
      title: 'Organizar ownership squad ↔ serviço',
      squad: 'plataforma',
      kind: 'docs',
      priority: 'medium',
      points: 3,
      assignees: ['gabriel-natan'],
      body: `## História
Como organização, quero squads e serviços mapeados na documentação e no repositório,
para que cada time saiba qual microserviço é seu e quais contratos expor.

## Critérios de aceite
- [ ] squads.json com 1 serviço por squad
- [ ] system-architecture.md atualizado com diagrama
- [ ] ADR-002 aceito descrevendo a decisão
- [ ] Histórias futuras já tagueadas com squad no Kanban

## Notas técnicas
Esta história documenta a estrutura que estamos adotando agora.
`,
    },
    {
      file: 'STORY-004-autenticacao.md',
      title: 'Autenticação e perfis de usuário',
      squad: 'identidade',
      kind: 'feature',
      priority: 'high',
      points: 8,
      assignees: ['ana'],
      body: `## História
Como usuário (cliente, entregador ou lojista), quero me cadastrar e autenticar com segurança,
para acessar as funcionalidades do Full Delivery.

## Critérios de aceite
- [ ] POST /auth/register e POST /auth/login no identity-service
- [ ] JWT emitido com role (customer, courier, merchant)
- [ ] Gateway valida token e repassa claims aos serviços
- [ ] Perfis básicos: nome, telefone, e-mail
- [ ] Testes unitários dos fluxos principais

## Notas técnicas
Squad **identidade** — serviço \`identity-service\`. Depende do bootstrap (STORY-002).
`,
    },
  ];

  for (const s of stories) {
    const fp = path.join(DIRS.backlog, s.file);
    await updateDoc(fp, ({ data }) => ({
      content: `# ${s.title}\n\n${s.body}`,
      data: {
        ...data,
        squad: s.squad,
        kind: s.kind,
        priority: s.priority,
        points: s.points,
        assignees: s.assignees,
        epic: 'mvp',
        sprint: 'SPRINT-01',
        status: data.status || 'backlog',
      },
    }));
  }

  // Sprint
  await patch(path.join(DIRS.sprints, 'SPRINT-01.md'), `# Sprint 01

## Objetivo da sprint
Colocar a fundação técnica no ar: monorepo, microserviços base (gateway + identity + order skeleton), autenticação e documentação de arquitetura alinhada aos squads.

## Histórias incluídas
- STORY-001 — Configurações do monorepo
- STORY-002 — Bootstrap NestJS
- STORY-003 — Ownership squad ↔ serviço
- STORY-004 — Autenticação

## Retrospectiva
_(preenchida ao final)_
`, {
    status: 'active',
    start_date: '2026-07-09',
    end_date: '2026-07-23',
  });

  console.log('Documentação enriquecida com sucesso.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
