#!/usr/bin/env node
/**
 * Cria SPRINT-04 — piloto regional, produção e portal lojista.
 */
import path from 'node:path';
import { createDoc, updateDoc } from '../server/lib/docsWriter.js';
import { DIRS } from '../server/lib/paths.js';
import { nextId } from '../server/lib/idGenerator.js';
import { validate } from '../server/lib/validator.js';
import { withLock } from '../server/lib/lock.js';

const SPRINT_ID = 'SPRINT-04';
const SPRINT_START = '2026-08-21';
const SPRINT_END = '2026-09-03';

const stories = [
  // --- Plataforma ---
  {
    title: 'Deploy produção e gestão de secrets',
    slug: 'deploy-producao-secrets',
    squad: 'plataforma',
    kind: 'chore',
    priority: 'high',
    points: 5,
    assignees: ['gabriel-natan'],
    body: `## História
Como squad de plataforma, quero ambiente de produção configurado com secrets seguros,
para lançar o piloto regional com confiabilidade operacional.

## Critérios de aceite
- [ ] Infra produção provisionada (cloud ou VPS documentada)
- [ ] Secrets em vault/env seguro — nunca no repositório
- [ ] Deploy de todos os microserviços + gateway em produção
- [ ] Smoke test automatizado pós-deploy

## Notas técnicas
Evolução do CI/CD da SPRINT-03. Atualizar \`environments.md\`.
`,
  },
  {
    title: 'Rate limiting e hardening do API Gateway',
    slug: 'rate-limiting-hardening-gateway',
    squad: 'plataforma',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['gabriel-natan'],
    body: `## História
Como plataforma, quero rate limiting e headers de segurança no gateway,
para proteger o piloto contra abuso e ataques básicos.

## Critérios de aceite
- [ ] Rate limit por IP e por usuário autenticado
- [ ] Headers: CORS restrito, HSTS, X-Content-Type-Options
- [ ] Bloqueio temporário após N tentativas de login falhas
- [ ] Métricas de 429 expostas no health agregado

## Notas técnicas
Serviço \`api-gateway\`.
`,
  },

  // --- Identidade ---
  {
    title: 'KYC — upload e validação de documentos',
    slug: 'kyc-upload-documentos',
    squad: 'identidade',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['ana'],
    body: `## História
Como lojista ou entregador, quero enviar documentos para verificação,
para operar no piloto com conformidade mínima.

## Critérios de aceite
- [ ] Upload de CNH (entregador) e CNPJ/contrato social (lojista)
- [ ] Status: \`pending\`, \`approved\`, \`rejected\` com motivo
- [ ] Armazenamento seguro (S3 ou equivalente)
- [ ] Bloqueio de operação até KYC aprovado (flag por role)

## Notas técnicas
identity-service. Revisão manual no MVP — fila admin futura.
`,
  },
  {
    title: 'Gestão de sessões e revogação de tokens',
    slug: 'gestao-sessoes-revogacao',
    squad: 'identidade',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['ana'],
    body: `## História
Como usuário, quero ver dispositivos logados e revogar sessões,
para ter controle de segurança da minha conta.

## Critérios de aceite
- [ ] GET /auth/sessions lista sessões ativas
- [ ] DELETE /auth/sessions/:id revoga refresh token
- [ ] Logout global invalida todos os tokens do usuário
- [ ] Registro de último acesso por dispositivo

## Notas técnicas
Complementa refresh token da SPRINT-03.
`,
  },

  // --- Estabelecimentos ---
  {
    title: 'Portal web do lojista — MVP',
    slug: 'portal-web-lojista-mvp',
    squad: 'estabelecimentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gerson'],
    body: `## História
Como lojista, quero um portal web para gerenciar loja, produtos e pedidos,
para operar sem depender apenas de API.

## Critérios de aceite
- [ ] Login via identity-service (role merchant)
- [ ] Telas: dashboard, pedidos, catálogo, configurações da loja
- [ ] Atualizar status de pedido (preparing, ready)
- [ ] Responsivo para tablet/desktop

## Notas técnicas
React em \`services/merchant-portal\` ou módulo em client-app. Consome merchant + order APIs.
`,
  },
  {
    title: 'Relatório de vendas e exportação CSV',
    slug: 'relatorio-vendas-csv',
    squad: 'estabelecimentos',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['gerson'],
    body: `## História
Como lojista, quero exportar relatório de vendas por período,
para conciliar financeiro e acompanhar desempenho no piloto.

## Critérios de aceite
- [ ] GET /merchants/:id/reports/sales?from=&to=
- [ ] Campos: pedido, data, valor, taxa, status
- [ ] Export CSV downloadável no portal
- [ ] Filtro por status e intervalo de datas

## Notas técnicas
merchant-service agrega dados do order-service.
`,
  },

  // --- Pedidos ---
  {
    title: 'Avaliação pós-entrega e NPS in-app',
    slug: 'avaliacao-pos-entrega-nps',
    squad: 'pedidos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['elton'],
    body: `## História
Como cliente, quero avaliar a entrega e a loja após receber o pedido,
para ajudar a melhorar a qualidade do serviço.

## Critérios de aceite
- [ ] POST /orders/:id/rating com nota 1–5 e comentário opcional
- [ ] Avaliação separada: loja e entrega
- [ ] Solicitar avaliação via push após status \`delivered\`
- [ ] Métrica NPS calculável para OKR-001

## Notas técnicas
order-service. Alimenta métricas em \`metricas.md\`.
`,
  },

  // --- Pagamentos ---
  {
    title: 'Gateway de pagamentos em produção',
    slug: 'gateway-pagamentos-producao',
    squad: 'pagamentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['elton'],
    body: `## História
Como plataforma, quero o gateway de pagamentos em ambiente de produção,
para processar cobranças reais no piloto regional.

## Critérios de aceite
- [ ] Credenciais produção configuradas via secrets
- [ ] Webhook produção com validação de assinatura
- [ ] Idempotência em POST /payments
- [ ] Logs de reconciliação diária

## Notas técnicas
Evolução do sandbox da SPRINT-03. Documentar em \`integrations.md\`.
`,
  },
  {
    title: 'Repasse automático D+1 para lojistas e entregadores',
    slug: 'repasse-automatico-d1',
    squad: 'pagamentos',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['elton'],
    body: `## História
Como lojista ou entregador, quero receber meu repasse no dia seguinte à entrega,
para ter previsibilidade de caixa no piloto.

## Critérios de aceite
- [ ] Job diário processa payouts com status \`pending\` → \`scheduled\`
- [ ] Simulação de transferência (ledger) com data D+1
- [ ] GET /payouts?recipient_id= para consulta
- [ ] Notificação por e-mail ao processar repasse

## Notas técnicas
Transferência bancária real fica para fase pós-piloto.
`,
  },

  // --- Logística ---
  {
    title: 'Geofencing da região piloto',
    slug: 'geofencing-regiao-piloto',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['mark'],
    body: `## História
Como operação, quero limitar pedidos e corridas à região piloto,
para controlar escopo e qualidade antes da expansão nacional.

## Critérios de aceite
- [ ] Polígono ou raio da região piloto configurável
- [ ] Validação de endereço de entrega dentro da área
- [ ] Entregadores só recebem corridas na região
- [ ] Mensagem clara ao usuário fora da cobertura

## Notas técnicas
logistics-service + validação no order-service.
`,
  },
  {
    title: 'Painel operacional de hubs e capacidade',
    slug: 'painel-hubs-capacidade',
    squad: 'logistica',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['mark'],
    body: `## História
Como operador logístico, quero ver ocupação dos hubs e postos de coleta,
para balancear carga na rede do piloto.

## Critérios de aceite
- [ ] GET /hubs/overview com capacidade vs ocupação atual
- [ ] Alerta quando hub atinge 80% da capacidade
- [ ] Histórico de volume por hub (últimos 7 dias)
- [ ] Integração com roteirização da SPRINT-03

## Notas técnicas
Suporte à expansão multi-hub na mesma região.
`,
  },
  {
    title: 'Garantia de reentrega por atraso grave',
    slug: 'garantia-reentrega-atraso',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['mark'],
    body: `## História
Como cliente, quero que a plataforma acione reentrega ou compensação em atraso grave,
para confiar na promessa de entrega do Full Delivery.

## Critérios de aceite
- [ ] Regra: atraso > 2h do \`promised_at\` dispara fluxo de garantia
- [ ] Status \`delivery.guarantee_triggered\` com ação: reentrega ou crédito mock
- [ ] Notificação ao cliente e ao suporte
- [ ] Evento registrado para métricas de SLA

## Notas técnicas
Primeira versão da garantia de entrega — crédito mock no MVP.
`,
  },

  // --- App Cliente ---
  {
    title: 'App cliente — avaliação e suporte in-app',
    slug: 'app-cliente-avaliacao-suporte',
    squad: 'app-cliente',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['gerson'],
    body: `## História
Como cliente, quero avaliar o pedido e abrir chamado de suporte pelo app,
para resolver problemas sem sair da plataforma.

## Critérios de aceite
- [ ] Tela de avaliação pós-entrega (nota + comentário)
- [ ] FAQ básico e botão "Falar com suporte"
- [ ] Formulário de suporte envia e-mail ou ticket mock
- [ ] Integração com API de rating do order-service

## Notas técnicas
Complementa portal e NPS backend.
`,
  },
  {
    title: 'Pesquisa UX com usuários do piloto — app cliente',
    slug: 'pesquisa-ux-piloto-cliente',
    squad: 'app-cliente',
    kind: 'design',
    priority: 'high',
    points: 8,
    assignees: ['beatriz'],
    body: `## História
Como designer, quero conduzir pesquisa com clientes reais do piloto,
para priorizar melhorias antes da expansão.

## Critérios de aceite
- [ ] Roteiro de entrevista com 5 clientes do piloto
- [ ] Registro de fricções na jornada de compra e rastreio
- [ ] Relatório com top 5 melhorias priorizadas
- [ ] Ajustes rápidos de UI implementáveis na sprint

## Notas técnicas
Alimenta backlog pós-piloto e OKR-001 (NPS).
`,
  },

  // --- App Entregador ---
  {
    title: 'App entregador — modo offline para corrida ativa',
    slug: 'app-entregador-modo-offline',
    squad: 'app-entregador',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['ana'],
    body: `## História
Como entregador, quero atualizar status da corrida mesmo com internet instável,
para não perder progresso em áreas com sinal fraco.

## Critérios de aceite
- [ ] Fila local de ações pendentes (picked_up, delivered)
- [ ] Sincronização automática ao reconectar
- [ ] Indicador visual de modo offline no app
- [ ] Conflito resolvido com timestamp do servidor

## Notas técnicas
courier-app Flutter. Crítico para operação em campo no piloto.
`,
  },
  {
    title: 'Acompanhamento de campo — entregadores do piloto',
    slug: 'acompanhamento-campo-entregadores',
    squad: 'app-entregador',
    kind: 'design',
    priority: 'high',
    points: 8,
    assignees: ['john'],
    body: `## História
Como designer, quero acompanhar entregadores reais durante o piloto,
para identificar problemas de UX em condições reais de uso.

## Critérios de aceite
- [ ] Shadowing com 3 entregadores por 1 dia cada
- [ ] Registro de dificuldades: aceite, navegação, comprovante
- [ ] Lista priorizada de melhorias no app
- [ ] Ajustes de UI críticos documentados para dev

## Notas técnicas
Trabalho em par com Ana e squad logística.
`,
  },

  // --- Produto / Ops ---
  {
    title: 'Onboarding de 20 lojas e tracking OKR-001',
    slug: 'onboarding-lojas-okr',
    squad: null,
    kind: 'docs',
    priority: 'high',
    points: 3,
    assignees: ['joana'],
    body: `## História
Como product owner, quero onboarding estruturado de estabelecimentos piloto e tracking do OKR,
para validar o MVP com dados reais.

## Critérios de aceite
- [ ] Checklist de onboarding por loja (KYC, catálogo, treinamento)
- [ ] Meta: 20 lojas ativas publicando catálogo
- [ ] Planilha/dashboard de progresso do OKR-001
- [ ] Ritual semanal de review com squads

## Notas técnicas
Coordena identidade, estabelecimentos e logística.
`,
  },
  {
    title: 'Runbook de produção e plano de incidentes',
    slug: 'runbook-producao-incidentes',
    squad: null,
    kind: 'docs',
    priority: 'high',
    points: 3,
    assignees: ['joana'],
    body: `## História
Como operação, quero runbook de produção e plano de resposta a incidentes,
para o piloto não parar por falta de procedimento.

## Critérios de aceite
- [ ] Runbook atualizado em \`docs/05-ops/runbook.md\`
- [ ] Playbook: serviço fora, pagamento falhou, fila parada
- [ ] Contatos de escalação e SLA interno de resposta
- [ ] Simulacro de incidente realizado com o time

## Notas técnicas
Gabriel revisa parte técnica; Joana dona do processo.
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
      tags: ['mvp', 'sprint-04', 'piloto'],
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
      tags: ['mvp', 'piloto'],
    },
    `# Sprint 04\n\n## Objetivo da sprint\n_(atualizado após criar histórias)_\n\n## Histórias incluídas\n\n## Retrospectiva\n_(preenchida ao final)_\n`
  );

  const created = [];
  for (const s of stories) {
    const id = await createStory(s);
    created.push(id);
    console.log(`  + ${id} — ${s.title}`);
  }

  const list = created.map((id) => `- ${id}`).join('\n');
  await updateDoc(sprintPath, () => ({
    content: `# Sprint 04

## Objetivo da sprint
Lançar o piloto regional: produção no ar, portal do lojista, pagamentos reais, KYC, geofencing e onboarding de 20 estabelecimentos com métricas do OKR-001.

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
| Piloto regional — produção e onboarding | Alta | Planejado | SPRINT-04 | todos |
| Portal lojista e pagamentos produção | Alta | Planejado | SPRINT-04 | estabelecimentos + pagamentos |
| KYC, geofencing e garantia de entrega | Alta | Planejado | SPRINT-04 | identidade + logística |

## Próximo
| Feature | Prioridade | Status | Squad |
|---|---|---|---|
| Expansão segunda região | Alta | Planejado | plataforma + logística |
| Transferência bancária real (repasse) | Alta | Planejado | pagamentos |
| Painel admin operações | Média | Planejado | plataforma |

## Depois
| Feature | Prioridade | Squad |
|---|---|---|
| Roteirização inteligente (ML) | Média | logística |
| Seguro de carga e garantia estendida | Alta | pedidos + logística |
| Cobertura nacional por fases | Alta | plataforma |
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
