#!/usr/bin/env node
/**
 * Cria SPRINT-03 — apps, integrações avançadas e demo MVP.
 */
import path from 'node:path';
import { createDoc, updateDoc } from '../server/lib/docsWriter.js';
import { DIRS } from '../server/lib/paths.js';
import { nextId } from '../server/lib/idGenerator.js';
import { validate } from '../server/lib/validator.js';
import { withLock } from '../server/lib/lock.js';

const SPRINT_ID = 'SPRINT-03';
const SPRINT_START = '2026-08-07';
const SPRINT_END = '2026-08-20';

const stories = [
  // --- Plataforma ---
  {
    title: 'Serviço de push FCM e registro de device tokens',
    slug: 'servico-push-fcm',
    squad: 'plataforma',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gabriel-natan'],
    body: `## História
Como plataforma, quero um serviço central de notificações push via FCM,
para que apps recebam alertas de pedido, pagamento e corrida em tempo real.

## Critérios de aceite
- [ ] Endpoint POST /notifications/devices registra token por \`user_id\`
- [ ] Publicação de push ao consumir eventos \`order.paid\`, \`delivery.assigned\`
- [ ] Integração Firebase staging configurada
- [ ] Documentação atualizada em \`integrations.md\`

## Notas técnicas
Spike da SPRINT-02 evolui para serviço. Pode viver no gateway ou módulo compartilhado.
`,
  },
  {
    title: 'CI/CD por microserviço no monorepo',
    slug: 'cicd-por-microservico',
    squad: 'plataforma',
    kind: 'chore',
    priority: 'high',
    points: 3,
    assignees: ['gabriel-natan'],
    body: `## História
Como squad de plataforma, quero pipeline de CI por serviço (lint, test, build),
para deploy independente e confiança nas entregas de cada squad.

## Critérios de aceite
- [ ] Workflow GitHub Actions (ou equivalente) por pasta \`services/*\`
- [ ] Lint e testes rodam em PR
- [ ] Build de imagem Docker por serviço
- [ ] Deploy automático em staging ao merge na main

## Notas técnicas
Base para ambiente de demo do MVP.
`,
  },
  {
    title: 'Observabilidade — logs estruturados e health agregado',
    slug: 'observabilidade-logs-health',
    squad: 'plataforma',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['gabriel-natan'],
    body: `## História
Como tech lead, quero logs estruturados e dashboard de health de todos os serviços,
para diagnosticar falhas no fluxo integrado rapidamente.

## Critérios de aceite
- [ ] Formato JSON de log padronizado (request_id, service, level)
- [ ] GET /health no gateway agrega status de cada microserviço
- [ ] Correlação de request_id entre gateway e serviços downstream
- [ ] Guia de troubleshooting em \`docs/05-ops/runbook.md\`

## Notas técnicas
Preparação para piloto em staging.
`,
  },

  // --- Identidade ---
  {
    title: 'Refresh token e recuperação de senha',
    slug: 'refresh-token-recuperacao-senha',
    squad: 'identidade',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['ana'],
    body: `## História
Como usuário, quero renovar minha sessão com segurança e recuperar senha por e-mail,
para não precisar fazer login a cada uso do app.

## Critérios de aceite
- [ ] POST /auth/refresh emite novo JWT a partir de refresh token
- [ ] POST /auth/forgot-password envia link por e-mail
- [ ] POST /auth/reset-password redefine senha com token temporário
- [ ] Refresh token revogável no logout

## Notas técnicas
Reutiliza integração de e-mail da SPRINT-02.
`,
  },

  // --- Estabelecimentos ---
  {
    title: 'Dashboard de pedidos do lojista',
    slug: 'dashboard-pedidos-lojista',
    squad: 'estabelecimentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gerson'],
    body: `## História
Como lojista, quero ver e atualizar o status dos pedidos da minha loja,
para gerenciar preparo e despacho sem sair do ecossistema Full Delivery.

## Critérios de aceite
- [ ] GET /merchants/:id/orders lista pedidos com filtros (status, data)
- [ ] PATCH para marcar \`preparing\` e \`ready_for_pickup\`
- [ ] Integração com order-service (chamada ou consumo de evento)
- [ ] Autorização: só dono do merchant acessa

## Notas técnicas
API no \`merchant-service\` consumindo dados do order-service.
`,
  },

  // --- Pedidos ---
  {
    title: 'E-mail de confirmação e atualização de pedido',
    slug: 'email-confirmacao-pedido',
    squad: 'pedidos',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['elton'],
    body: `## História
Como cliente, quero receber e-mail quando meu pedido for confirmado ou mudar de status,
para acompanhar a compra mesmo fora do app.

## Critérios de aceite
- [ ] E-mail ao criar pedido com resumo e valor
- [ ] E-mail em transições: pago, enviado, entregue
- [ ] Template HTML reutilizável
- [ ] Usa adapter de e-mail já configurado

## Notas técnicas
Integração transacional — order-service publica, worker envia e-mail.
`,
  },
  {
    title: 'Cancelamento de pedido e estorno mock',
    slug: 'cancelamento-estorno-pedido',
    squad: 'pedidos',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['elton'],
    body: `## História
Como cliente, quero cancelar um pedido antes do envio e receber estorno,
para ter flexibilidade na compra online.

## Critérios de aceite
- [ ] POST /orders/:id/cancel com regras (só antes de \`shipped\`)
- [ ] Evento \`order.cancelled\` publicado
- [ ] payment-service processa estorno mock
- [ ] Status final \`cancelled\` com motivo registrado

## Notas técnicas
Integra order-service e payment-service via eventos.
`,
  },

  // --- Pagamentos ---
  {
    title: 'Integração gateway de pagamentos sandbox',
    slug: 'gateway-pagamentos-sandbox',
    squad: 'pagamentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['elton'],
    body: `## História
Como plataforma, quero integrar um gateway de pagamentos em ambiente sandbox,
para substituir o PIX mock por fluxo mais próximo da produção.

## Critérios de aceite
- [ ] Adapter para provedor (Mercado Pago, Stripe ou Pagar.me sandbox)
- [ ] POST /payments cria cobrança real em sandbox
- [ ] Webhook de confirmação validado com assinatura
- [ ] Ledger de split mantido após confirmação

## Notas técnicas
Evolução do payment-service da SPRINT-02. Documentar em \`integrations.md\`.
`,
  },

  // --- Logística ---
  {
    title: 'Roteirização coleta-hub-entrega',
    slug: 'roteirizacao-coleta-hub-entrega',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['mark'],
    body: `## História
Como sistema de logística, quero calcular rota com parada em hub quando necessário,
para otimizar entregas de longa distância na rede nacional.

## Critérios de aceite
- [ ] Algoritmo escolhe hub intermediário quando distância > limiar configurável
- [ ] Rota retorna waypoints: coleta → hub → entrega
- [ ] ETA total considera todas as pernas
- [ ] Integração com API de mapas da SPRINT-02

## Notas técnicas
Serviço \`logistics-service\`. Base para expansão multi-região.
`,
  },
  {
    title: 'SLA de entrega e alertas de atraso',
    slug: 'sla-entrega-alertas-atraso',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['mark'],
    body: `## História
Como cliente, quero ver o prazo garantido e ser alertado se houver atraso,
para confiar na promessa de entrega do Full Delivery.

## Critérios de aceite
- [ ] Campo \`promised_at\` calculado no momento da alocação
- [ ] Job verifica entregas próximas do limite e em atraso
- [ ] Evento \`delivery.delayed\` dispara push e e-mail
- [ ] GET /deliveries/:id expõe SLA e status de pontualidade

## Notas técnicas
North Star Metric: entregas no prazo.
`,
  },
  {
    title: 'Push de nova corrida no app entregador',
    slug: 'push-nova-corrida-entregador',
    squad: 'logistica',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['mark'],
    body: `## História
Como entregador, quero receber push quando uma nova corrida estiver disponível,
para aceitar rapidamente sem ficar com o app aberto.

## Critérios de aceite
- [ ] Ao criar entrega sem entregador, notificar couriers disponíveis na região
- [ ] Payload do push contém \`delivery_id\` e resumo
- [ ] Integração com serviço FCM da plataforma
- [ ] Deep link abre tela de detalhe no courier-app

## Notas técnicas
Depende do serviço FCM (STORY desta sprint — plataforma).
`,
  },

  // --- App Cliente ---
  {
    title: 'App cliente — lojas, carrinho e checkout',
    slug: 'app-cliente-lojas-checkout',
    squad: 'app-cliente',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gerson'],
    body: `## História
Como cliente, quero navegar lojas, montar carrinho e pagar pelo app React,
para comprar e solicitar entrega pelo Full Delivery.

## Critérios de aceite
- [ ] Listagem de estabelecimentos e produtos via gateway
- [ ] Carrinho com edição de quantidade
- [ ] Checkout integrado ao payment-service (sandbox)
- [ ] Telas seguem design da SPRINT-02 (Beatriz valida)

## Notas técnicas
Evolução do scaffold \`client-app\`. Depende de merchant, order e payment.
`,
  },
  {
    title: 'App cliente — rastreio de pedido em tempo real',
    slug: 'app-cliente-rastreio-pedido',
    squad: 'app-cliente',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['gerson'],
    body: `## História
Como cliente, quero acompanhar o status e a localização da minha entrega no app,
para saber quando o pedido vai chegar.

## Critérios de aceite
- [ ] Tela de rastreio com timeline de status
- [ ] Mapa com posição estimada (quando disponível)
- [ ] Push ao mudar status (via FCM)
- [ ] Polling ou websocket para atualização

## Notas técnicas
Consome order-service e logistics-service.
`,
  },
  {
    title: 'Validação UX e polish do app cliente',
    slug: 'validacao-ux-app-cliente',
    squad: 'app-cliente',
    kind: 'design',
    priority: 'medium',
    points: 8,
    assignees: ['beatriz'],
    body: `## História
Como designer, quero validar e polir a implementação do app cliente,
para garantir usabilidade antes da demo do MVP.

## Critérios de aceite
- [ ] Review de todas as telas implementadas vs Figma
- [ ] Ajustes de spacing, tipografia e estados de erro
- [ ] Teste de usabilidade com 2 usuários internos
- [ ] Lista de débitos visuais priorizada para sprint seguinte

## Notas técnicas
Trabalho em par com Gerson (dev React).
`,
  },

  // --- App Entregador ---
  {
    title: 'App entregador — aceitar e executar corridas',
    slug: 'app-entregador-corridas',
    squad: 'app-entregador',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['ana'],
    body: `## História
Como entregador, quero ver corridas disponíveis, aceitar e atualizar o status da entrega,
para completar o fluxo operacional pelo app Flutter.

## Critérios de aceite
- [ ] Lista de corridas pendentes e ativas
- [ ] Aceitar/recusar corrida com feedback imediato
- [ ] Atualizar status: picked_up → in_transit → delivered
- [ ] Foto ou confirmação de entrega (mock)

## Notas técnicas
Evolução do scaffold \`courier-app\`. Integra logistics-service.
`,
  },
  {
    title: 'App entregador — navegação e mapa da rota',
    slug: 'app-entregador-navegacao-mapa',
    squad: 'app-entregador',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['ana'],
    body: `## História
Como entregador, quero ver a rota no mapa e abrir navegação externa,
para chegar ao destino com eficiência.

## Critérios de aceite
- [ ] Mapa com origem, hub (se houver) e destino
- [ ] Botão abre Google Maps / Waze com coordenadas
- [ ] ETA exibido na tela da corrida
- [ ] Funciona offline para última rota carregada (cache básico)

## Notas técnicas
Consome endpoint de ETA do logistics-service.
`,
  },
  {
    title: 'Validação UX e polish do app entregador',
    slug: 'validacao-ux-app-entregador',
    squad: 'app-entregador',
    kind: 'design',
    priority: 'medium',
    points: 8,
    assignees: ['john'],
    body: `## História
Como designer, quero validar e polir a implementação do app entregador,
para garantir jornada fluida em campo antes da demo.

## Critérios de aceite
- [ ] Review de telas vs protótipo Figma
- [ ] Teste em dispositivo real (Android)
- [ ] Ajustes de contraste, botões e feedback tátil
- [ ] Checklist de acessibilidade mínima

## Notas técnicas
Trabalho em par com Ana (dev Flutter).
`,
  },

  // --- Produto ---
  {
    title: 'Roteiro e critérios da demo MVP',
    slug: 'roteiro-demo-mvp',
    squad: null,
    kind: 'docs',
    priority: 'high',
    points: 3,
    assignees: ['joana'],
    body: `## História
Como product owner, quero roteiro de demo e critérios de sucesso do MVP,
para apresentar o fluxo completo a stakeholders na região piloto.

## Critérios de aceite
- [ ] Script de demo: cadastro → compra → pagamento → entrega
- [ ] Dados de seed para ambiente staging
- [ ] Checklist de métricas a coletar na demo (OKR-001)
- [ ] Agenda de validação com 3 estabelecimentos piloto

## Notas técnicas
Alinhado à spec E2E da SPRINT-02 (STORY-022).
`,
  },
];

async function createStory(story) {
  const id = await withLock(DIRS.backlog, async () => {
    const storyId = await nextId(DIRS.backlog, 'STORY', 3);
    const data = {
      id: storyId,
      type: 'story',
      status: 'backlog',
      priority: story.priority,
      points: story.points,
      epic: 'mvp',
      sprint: SPRINT_ID,
      parent: null,
      kind: story.kind,
      squad: story.squad,
      tags: ['mvp', 'sprint-03'],
      assignees: story.assignees,
    };

    const { valid, errors } = await validate('story', data);
    if (!valid) throw new Error(`${storyId}: ${errors.join(', ')}`);

    const body = `# ${story.title}\n\n${story.body}`;
    const filePath = path.join(DIRS.backlog, `${storyId}-${story.slug}.md`);
    await createDoc(filePath, data, body);
    return storyId;
  });
  return id;
}

async function main() {
  const sprintPath = path.join(DIRS.sprints, `${SPRINT_ID}.md`);
  await createDoc(
    sprintPath,
    {
      id: SPRINT_ID,
      type: 'sprint',
      status: 'planned',
      start_date: SPRINT_START,
      end_date: SPRINT_END,
      tags: ['mvp'],
    },
    `# Sprint 03

## Objetivo da sprint
_(será atualizado após criar histórias)_

## Histórias incluídas

## Retrospectiva
_(preenchida ao final)_
`
  );

  const created = [];
  for (const s of stories) {
    const id = await createStory(s);
    created.push(id);
    console.log(`  + ${id} — ${s.title}`);
  }

  const list = created.map((id) => `- ${id}`).join('\n');
  await updateDoc(sprintPath, () => ({
    content: `# Sprint 03

## Objetivo da sprint
MVP demonstrável nos apps: jornada completa de compra e entrega, push notifications, pagamento sandbox, SLA de entrega e ambiente staging pronto para piloto.

## Histórias incluídas
${list}

## Retrospectiva
_(preenchida ao final)_
`,
  }));

  await updateDoc(path.join(DIRS.negocio, 'roadmap.md'), () => ({
    content: `# Roadmap

## Agora
| Feature | Prioridade | Status | Sprint alvo | Squad |
|---|---|---|---|---|
| Apps cliente e entregador (UI completa) | Alta | Planejado | SPRINT-03 | app-cliente + app-entregador |
| Push FCM e pagamento sandbox | Alta | Planejado | SPRINT-03 | plataforma + pagamentos |
| SLA, roteirização e demo MVP | Alta | Planejado | SPRINT-03 | logística + produto |

## Próximo
| Feature | Prioridade | Status | Squad |
|---|---|---|---|
| Piloto região com estabelecimentos reais | Alta | Planejado | todos |
| Gateway pagamentos produção | Alta | Planejado | pagamentos |
| Portal web do lojista | Média | Planejado | estabelecimentos |

## Depois
| Feature | Prioridade | Squad |
|---|---|---|
| Roteirização inteligente (ML) | Média | logística |
| Expansão multi-região | Alta | plataforma |
| Garantia de entrega e seguro | Alta | pedidos + logística |
`,
  }));

  const totalPts = stories.reduce((s, x) => s + x.points, 0);
  console.log(`\n✓ ${SPRINT_ID} criada com ${created.length} histórias (${totalPts} pts totais)`);
  const load = {};
  for (const s of stories) {
    for (const a of s.assignees) load[a] = (load[a] || 0) + s.points;
  }
  console.log('\nCarga por pessoa:');
  for (const [who, pts] of Object.entries(load).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${who}: ${pts} pts`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
