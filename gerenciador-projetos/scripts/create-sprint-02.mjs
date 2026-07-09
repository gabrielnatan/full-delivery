#!/usr/bin/env node
/**
 * Cria SPRINT-02 e histórias por squad/serviço/integração.
 */
import path from 'node:path';
import { createDoc, updateDoc } from '../server/lib/docsWriter.js';
import { DIRS } from '../server/lib/paths.js';
import { nextId, slugify } from '../server/lib/idGenerator.js';
import { validate } from '../server/lib/validator.js';
import { withLock } from '../server/lib/lock.js';

const SPRINT_ID = 'SPRINT-02';
const SPRINT_START = '2026-07-24';
const SPRINT_END = '2026-08-06';

const stories = [
  // --- Plataforma ---
  {
    title: 'Barramento de eventos entre microserviços',
    slug: 'barramento-de-eventos',
    squad: 'plataforma',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gabriel-natan'],
    body: `## História
Como squad de plataforma, quero um barramento de eventos (Redis Streams ou RabbitMQ),
para que pedidos, pagamentos e logística se comuniquem de forma desacoplada.

## Critérios de aceite
- [ ] Biblioteca compartilhada de publicação/consumo de eventos no monorepo
- [ ] Eventos padronizados: \`order.created\`, \`payment.approved\`, \`delivery.assigned\`
- [ ] Dead-letter e retry configurados no ambiente local
- [ ] Documentação do contrato de eventos em \`docs/02-tecnico/\`

## Notas técnicas
Serviço \`api-gateway\` + lib compartilhada. Base para order-service e payment-service.
`,
  },
  {
    title: 'Gateway: rotas e contratos OpenAPI de todos os serviços',
    slug: 'gateway-openapi-todos-servicos',
    squad: 'plataforma',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['gabriel-natan'],
    body: `## História
Como desenvolvedor de qualquer squad, quero que o api-gateway roteie para todos os microserviços com contrato documentado,
para integrar apps e serviços sem adivinhar endpoints.

## Critérios de aceite
- [ ] Rotas proxy para identity, merchant, order, logistics e payment
- [ ] Spec OpenAPI agregada ou por serviço publicada em \`/docs\`
- [ ] Middleware de JWT reutilizado em todas as rotas protegidas
- [ ] Health check agregado no gateway

## Notas técnicas
Depende do bootstrap da SPRINT-01 (STORY-002).
`,
  },

  // --- App Cliente ---
  {
    title: 'Perfis completos por papel de usuário',
    slug: 'perfis-por-papel',
    squad: 'identidade',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['ana'],
    body: `## História
Como usuário, quero completar meu perfil conforme meu papel (cliente, entregador ou lojista),
para que os serviços downstream tenham dados mínimos para operar.

## Critérios de aceite
- [ ] Campos por role: cliente (endereço), entregador (veículo, CNH), lojista (CNPJ, razão social)
- [ ] PATCH /profiles/:userId com validação por role
- [ ] Gateway repassa \`user_id\` e \`role\` nos headers
- [ ] Testes dos fluxos por papel

## Notas técnicas
Serviço \`identity-service\`. Depende de STORY-004 (autenticação).
`,
  },
  {
    title: 'Integração e-mail transacional no cadastro',
    slug: 'integracao-email-cadastro',
    squad: 'identidade',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['ana'],
    body: `## História
Como novo usuário, quero receber e-mail de boas-vindas e confirmação de cadastro,
para validar que minha conta foi criada com sucesso.

## Critérios de aceite
- [ ] Adapter para provedor (Resend ou SendGrid) com mock em local
- [ ] E-mail disparado em \`POST /auth/register\`
- [ ] Template HTML básico com nome e link de confirmação
- [ ] Falha de e-mail não bloqueia cadastro (log + retry)

## Notas técnicas
Integração documentada em \`integrations.md\`.
`,
  },

  // --- Estabelecimentos ---
  {
    title: 'CRUD de estabelecimentos',
    slug: 'crud-estabelecimentos',
    squad: 'estabelecimentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gerson'],
    body: `## História
Como lojista, quero cadastrar e editar meu estabelecimento,
para começar a vender pelo Full Delivery.

## Critérios de aceite
- [ ] Bootstrap \`merchant-service\` com Postgres próprio
- [ ] POST/GET/PATCH /merchants vinculado ao \`owner_user_id\` do identity
- [ ] Campos: nome, CNPJ, endereço, horário de funcionamento, status
- [ ] Validação de CNPJ e autorização (só dono edita)

## Notas técnicas
Serviço \`merchant-service\`.
`,
  },
  {
    title: 'CRUD de catálogo de produtos',
    slug: 'crud-catalogo-produtos',
    squad: 'estabelecimentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['gerson'],
    body: `## História
Como lojista, quero cadastrar produtos com preço e estoque,
para que clientes possam montar pedidos.

## Critérios de aceite
- [ ] POST/GET/PATCH/DELETE /merchants/:id/products
- [ ] Campos: nome, descrição, preço, estoque, imagem (URL), ativo/inativo
- [ ] Listagem pública de produtos por estabelecimento
- [ ] Testes de API dos fluxos principais

## Notas técnicas
Depende do CRUD de estabelecimentos (STORY anterior do squad).
`,
  },

  // --- Pedidos ---
  {
    title: 'Criar pedido a partir do catálogo',
    slug: 'criar-pedido',
    squad: 'pedidos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['elton'],
    body: `## História
Como cliente, quero criar um pedido com itens de um estabelecimento,
para iniciar o fluxo de compra e entrega.

## Critérios de aceite
- [ ] Bootstrap \`order-service\` com Postgres próprio
- [ ] POST /orders com \`merchant_id\`, itens (product_id, qty) e endereço de entrega
- [ ] Validação de estoque via chamada ao merchant-service
- [ ] Evento \`order.created\` publicado no barramento
- [ ] Cálculo de subtotal e total do pedido

## Notas técnicas
Depende de merchant-service e barramento de eventos (plataforma).
`,
  },
  {
    title: 'Ciclo de status e eventos do pedido',
    slug: 'status-eventos-pedido',
    squad: 'pedidos',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['elton'],
    body: `## História
Como operador do sistema, quero que o pedido transite por status claros com eventos,
para rastrear o ciclo de vida ponta a ponta.

## Critérios de aceite
- [ ] Status: \`pending\` → \`paid\` → \`preparing\` → \`shipped\` → \`delivered\` / \`cancelled\`
- [ ] PATCH /orders/:id/status com regras de transição válidas
- [ ] Eventos \`order.paid\`, \`order.shipped\`, \`order.delivered\` no barramento
- [ ] GET /orders/:id com histórico de status

## Notas técnicas
Integra com payment-service e logistics-service via eventos.
`,
  },

  // --- Logística ---
  {
    title: 'Cadastro e disponibilidade de entregadores',
    slug: 'cadastro-entregadores',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['mark'],
    body: `## História
Como entregador, quero me cadastrar e ficar disponível para corridas,
para receber entregas na rede Full Delivery.

## Critérios de aceite
- [ ] Bootstrap \`logistics-service\` com Postgres próprio
- [ ] POST /couriers vinculado ao \`user_id\` (role courier)
- [ ] Campos: tipo de veículo, placa, status (offline/available/busy)
- [ ] PATCH /couriers/:id/availability

## Notas técnicas
Serviço \`logistics-service\`. Perfil base vem do identity-service.
`,
  },
  {
    title: 'CRUD de hubs e postos de coleta',
    slug: 'crud-hubs-coleta',
    squad: 'logistica',
    kind: 'feature',
    priority: 'medium',
    points: 3,
    assignees: ['mark'],
    body: `## História
Como operador logístico, quero cadastrar hubs e postos de coleta,
para orquestrar a rede de distribuição nacional.

## Critérios de aceite
- [ ] POST/GET/PATCH /hubs com nome, endereço, geo (lat/lng), capacidade
- [ ] Tipos: \`hub\` (centro de distribuição) e \`pickup_point\` (posto de coleta)
- [ ] Listagem por região/cidade

## Notas técnicas
Base para roteirização futura.
`,
  },
  {
    title: 'Integração mapas — distância e ETA',
    slug: 'integracao-mapas-eta',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['mark'],
    body: `## História
Como sistema de logística, quero calcular distância e tempo estimado entre dois pontos,
para cotar prazo de entrega e alocar entregador.

## Critérios de aceite
- [ ] Adapter para API de mapas (Google Maps ou OpenStreetMap/Nominatim)
- [ ] Endpoint GET /logistics/eta?from=&to= retornando distância (km) e duração (min)
- [ ] Mock funcional em ambiente local sem chave de produção
- [ ] Cache simples de consultas repetidas (Redis ou in-memory)

## Notas técnicas
Integração documentada em \`integrations.md\`.
`,
  },
  {
    title: 'Alocar entrega e rastrear status',
    slug: 'alocar-entrega-rastreio',
    squad: 'logistica',
    kind: 'feature',
    priority: 'high',
    points: 3,
    assignees: ['mark'],
    body: `## História
Como sistema, quero criar uma entrega quando o pedido é pago e atribuir a um entregador,
para que cliente e lojista acompanhem o status.

## Critérios de aceite
- [ ] Consumir evento \`order.paid\` e criar \`Delivery\`
- [ ] POST /deliveries/:id/assign vincula entregador disponível
- [ ] Status: \`pending\` → \`picked_up\` → \`in_transit\` → \`delivered\`
- [ ] Evento \`delivery.assigned\` publicado no barramento
- [ ] GET /deliveries/:id para rastreio

## Notas técnicas
Depende de cadastro de entregadores e barramento de eventos.
`,
  },

  // --- Pagamentos ---
  {
    title: 'Cobrança PIX mock e confirmação de pagamento',
    slug: 'pix-mock-cobranca',
    squad: 'pagamentos',
    kind: 'feature',
    priority: 'high',
    points: 5,
    assignees: ['elton'],
    body: `## História
Como cliente, quero pagar meu pedido via PIX (simulado no MVP),
para destravar o fluxo de preparo e entrega.

## Critérios de aceite
- [ ] Bootstrap \`payment-service\` com Postgres próprio
- [ ] POST /payments com \`order_id\` e valor → retorna QR code / copia-e-cola mock
- [ ] Webhook mock POST /payments/webhook confirma pagamento
- [ ] Evento \`payment.approved\` publicado no barramento
- [ ] Ledger interno de split (merchant / courier / platform) ao aprovar

## Notas técnicas
Elton integra pagamento com pedidos. Gateway real fica para sprint futura.
`,
  },

  // --- App Cliente ---
  {
    title: 'Design system e jornada de compra no app cliente',
    slug: 'design-app-cliente-jornada',
    squad: 'app-cliente',
    kind: 'design',
    priority: 'high',
    points: 8,
    assignees: ['beatriz'],
    body: `## História
Como designer do app cliente, quero o design system e as telas da jornada de compra,
para o time implementar o React app na sprint seguinte.

## Critérios de aceite
- [ ] Tokens de cor, tipografia e componentes base no Figma
- [ ] Telas: login, listagem de lojas, detalhe do produto, carrinho, checkout, rastreio
- [ ] Fluxo navegável com estados vazio, loading e erro
- [ ] Handoff com specs para desenvolvimento

## Notas técnicas
App \`client-app\` (React). Integração com APIs via gateway na sprint 03.
`,
  },
  {
    title: 'Scaffold React client-app com autenticação',
    slug: 'scaffold-react-client-app',
    squad: 'app-cliente',
    kind: 'chore',
    priority: 'medium',
    points: 3,
    assignees: ['gerson'],
    body: `## História
Como squad app-cliente, quero o projeto React inicial integrado ao identity-service,
para começar a implementar as telas do design.

## Critérios de aceite
- [ ] Projeto React (Vite) em \`services/client-app\`
- [ ] Tela de login consumindo POST /auth/login via gateway
- [ ] Armazenamento seguro do JWT e interceptor HTTP
- [ ] Roteamento básico (login → home)

## Notas técnicas
Gerson apoia após merchant-service; Beatriz valida UI com wireframes.
`,
  },

  // --- App Entregador ---
  {
    title: 'Design onboarding e corridas no app entregador',
    slug: 'design-app-entregador',
    squad: 'app-entregador',
    kind: 'design',
    priority: 'high',
    points: 8,
    assignees: ['john'],
    body: `## História
Como designer do app entregador, quero telas de onboarding e gestão de corridas,
para o time implementar o Flutter app na sprint seguinte.

## Critérios de aceite
- [ ] Telas: onboarding, cadastro veículo, disponibilidade, lista de corridas, detalhe da corrida, navegação
- [ ] Estados: offline, aguardando, em rota, entregue
- [ ] Componentes alinhados ao design system (variante mobile)
- [ ] Protótipo navegável no Figma

## Notas técnicas
App \`courier-app\` (Flutter).
`,
  },
  {
    title: 'Scaffold Flutter courier-app com autenticação',
    slug: 'scaffold-flutter-courier-app',
    squad: 'app-entregador',
    kind: 'chore',
    priority: 'medium',
    points: 3,
    assignees: ['ana'],
    body: `## História
Como squad app-entregador, quero o projeto Flutter inicial integrado ao identity-service,
para implementar as telas de corrida na sprint seguinte.

## Critérios de aceite
- [ ] Projeto Flutter em \`services/courier-app\`
- [ ] Tela de login com role courier
- [ ] Persistência do token e chamadas autenticadas ao gateway
- [ ] Build Android emulador funcionando

## Notas técnicas
Ana apoia após identity-service; John valida fluxo com protótipo.
`,
  },

  // --- Produto (transversal) ---
  {
    title: 'Especificação do fluxo E2E pedido completo',
    slug: 'especificacao-fluxo-e2e',
    squad: null,
    kind: 'docs',
    priority: 'high',
    points: 3,
    assignees: ['joana'],
    body: `## História
Como product owner, quero a especificação do fluxo ponta a ponta documentada,
para alinhar squads na integração entre serviços.

## Critérios de aceite
- [ ] Diagrama de sequência: cadastro → pedido → pagamento → entrega
- [ ] Critérios de aceite E2E para demo do MVP
- [ ] Matriz de responsabilidade squad × evento
- [ ] Revisado com tech-lead e squads de pedidos/logística/pagamentos

## Notas técnicas
Documento em \`docs/02-tecnico/\` ou anexo à sprint.
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
      tags: ['mvp', 'sprint-02'],
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
  // Criar sprint
  const sprintPath = path.join(DIRS.sprints, `${SPRINT_ID}.md`);
  try {
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
      `# Sprint 02

## Objetivo da sprint
Entregar o primeiro fluxo vertical integrado: cadastro com perfil → loja e produtos → pedido → pagamento mock → alocação de entrega, com integrações de e-mail, mapas e push preparadas.

## Histórias incluídas
_(lista gerada automaticamente — fonte de verdade: campo sprint: em cada STORY)_

## Retrospectiva
_(preenchida ao final)_
`
    );
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  const created = [];
  for (const s of stories) {
    const id = await createStory(s);
    created.push(id);
    console.log(`  + ${id} — ${s.title}`);
  }

  // Atualizar corpo da sprint com lista de histórias
  const list = created.map((id) => `- ${id}`).join('\n');
  await updateDoc(sprintPath, ({ content }) => ({
    content: `# Sprint 02

## Objetivo da sprint
Entregar o primeiro fluxo vertical integrado: cadastro com perfil → loja e produtos → pedido → pagamento mock → alocação de entrega, com integrações de e-mail, mapas e push preparadas.

## Histórias incluídas
${list}

## Retrospectiva
_(preenchida ao final)_
`,
  }));

  // Atualizar roadmap
  await updateDoc(path.join(DIRS.negocio, 'roadmap.md'), ({ data, content }) => {
    const agora = `| Bootstrap e autenticação | Alta | Concluindo | SPRINT-01 | plataforma + identidade |
| Fluxo vertical pedido → pagamento → entrega | Alta | Planejado | SPRINT-02 | todos os squads |
| Apps cliente e entregador (UI) | Média | Planejado | SPRINT-02 / 03 | app-cliente + app-entregador |`;

    const novoContent = content.replace(
      /\| Bootstrap monorepo[\s\S]*?\| plataforma \+ identidade \|/,
      agora
    );
    return { content: novoContent !== content ? novoContent : content, data };
  });

  const totalPts = stories.reduce((s, x) => s + x.points, 0);
  console.log(`\n✓ ${SPRINT_ID} criada com ${created.length} histórias (${totalPts} pts totais)`);
  console.log('\nCarga por pessoa:');
  const load = {};
  for (const s of stories) {
    for (const a of s.assignees) load[a] = (load[a] || 0) + s.points;
  }
  for (const [who, pts] of Object.entries(load).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${who}: ${pts} pts`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
