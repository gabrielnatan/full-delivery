#!/usr/bin/env node
/**
 * Cria subtasks refinadas para as histórias da SPRINT-01.
 */
import path from 'node:path';
import { createDoc } from '../server/lib/docsWriter.js';
import { readDoc } from '../server/lib/docsReader.js';
import { DIRS } from '../server/lib/paths.js';
import { nextId, slugify } from '../server/lib/idGenerator.js';
import { validate } from '../server/lib/validator.js';
import { withLock } from '../server/lib/lock.js';
import { isValidSquad } from '../server/lib/squads.js';
import { validateAssignees } from '../server/lib/team.js';

const SPRINT = 'SPRINT-01';
const KINDS = new Set(['bug', 'feature', 'chore', 'planning', 'docs', 'spike', 'design']);

const SERVICES = [
  'api-gateway',
  'identity-service',
  'merchant-service',
  'order-service',
  'logistics-service',
  'payment-service',
  'client-app',
  'courier-app',
];

async function createSubtask({ parent, title, ...rest }) {
  const body = rest.body;
  const filePath = await withLock(DIRS.backlog, async () => {
    const id = await nextId(DIRS.backlog, 'STORY', 3);
    const data = {
      id,
      type: 'story',
      status: rest.status || 'todo',
      priority: rest.priority || 'high',
      points: Number(rest.points ?? 1),
      epic: 'mvp',
      sprint: SPRINT,
      parent: parent.toUpperCase(),
      kind: KINDS.has(rest.kind) ? rest.kind : 'chore',
      squad: rest.squad || null,
      tags: ['mvp', 'sprint-01', 'subtask'],
      assignees: rest.assignees || [],
    };

    const { valid, errors } = await validate('story', data);
    if (!valid) throw new Error(`${title}: ${errors.join(', ')}`);
    if (data.squad && !(await isValidSquad(data.squad))) {
      throw new Error(`squad inválido: ${data.squad}`);
    }
    if (data.assignees.length) {
      const av = await validateAssignees(data.assignees);
      if (!av.valid) throw new Error(av.errors.join(', '));
    }

    const fp = path.join(DIRS.backlog, `${id}-${slugify(title)}.md`);
    await createDoc(fp, data, `# ${title}\n\n${body}\n`);
    return fp;
  });
  const doc = await readDoc(filePath);
  console.log(`  + ${doc.id} ← ${parent}: ${title}`);
  return doc.id;
}

const subtasks = [
  // ═══════════════════════════════════════════════════════════════════════════
  // STORY-001 — Configurações do monorepo e ambientes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    parent: 'STORY-001',
    title: 'Criar estrutura de pastas services/ no monorepo',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-001**. Primeiro passo: definir onde cada microserviço vive no repositório.

## Passo a passo
1. Na raiz do repositório, criar a pasta \`services/\`.
2. Dentro de \`services/\`, criar uma subpasta vazia para cada serviço do mapa de squads:
   - \`api-gateway\`
   - \`identity-service\`
   - \`merchant-service\`
   - \`order-service\`
   - \`logistics-service\`
   - \`payment-service\`
   - \`client-app\`
   - \`courier-app\`
3. Em cada pasta, adicionar um \`.gitkeep\` ou \`README.md\` com uma linha indicando o squad dono (copiar de \`docs/04-time/squads.json\`).
4. Criar pasta \`packages/\` na raiz para código compartilhado futuro (ex.: \`packages/shared-events\`).
5. Commitar: \`STORY-001: estrutura de pastas services/\`.

## Critérios de aceite
- [ ] Pastas de todos os 8 serviços existem em \`services/\`
- [ ] Cada pasta tem README com squad e nome do serviço
- [ ] Pasta \`packages/\` criada na raiz
`,
  },
  {
    parent: 'STORY-001',
    title: 'Configurar npm workspaces na raiz do monorepo',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-001**. Habilitar monorepo com workspaces para instalar dependências de forma centralizada.

## Passo a passo
1. Na raiz, inicializar \`package.json\` se ainda não existir: \`npm init -y\`.
2. Adicionar campo \`workspaces\`:
   \`\`\`json
   "workspaces": ["services/*", "packages/*"]
   \`\`\`
3. Definir scripts na raiz:
   - \`"dev:gateway": "npm run dev -w api-gateway"\`
   - \`"build:all": "npm run build --workspaces --if-present"\`
   - \`"test:all": "npm run test --workspaces --if-present"\`
4. Rodar \`npm install\` na raiz e confirmar que não há erros.
5. Documentar no README que novos serviços entram automaticamente via glob \`services/*\`.

## Critérios de aceite
- [ ] \`package.json\` raiz com workspaces configurados
- [ ] Scripts \`dev:gateway\`, \`build:all\` e \`test:all\` definidos
- [ ] \`npm install\` na raiz executa sem erro
`,
  },
  {
    parent: 'STORY-001',
    title: 'ESLint, Prettier e TypeScript base compartilhados',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-001**. Padrão de código único para todos os squads backend.

## Passo a passo
1. Instalar na raiz (devDependencies): \`eslint\`, \`@typescript-eslint/parser\`, \`@typescript-eslint/eslint-plugin\`, \`prettier\`, \`eslint-config-prettier\`.
2. Criar \`eslint.config.js\` (ou \`.eslintrc.js\`) na raiz com regras para TypeScript/NestJS.
3. Criar \`.prettierrc\` na raiz (singleQuote, trailingComma, printWidth 100).
4. Criar \`tsconfig.base.json\` na raiz com \`strict: true\`, \`esModuleInterop: true\`.
5. Adicionar scripts na raiz: \`"lint": "eslint services --ext .ts"\` e \`"format": "prettier --write ."\`.
6. Criar \`.editorconfig\` para consistência entre IDEs.
7. Rodar \`npm run lint\` — deve passar (ou sem arquivos ainda).

## Critérios de aceite
- [ ] ESLint e Prettier configurados na raiz
- [ ] \`tsconfig.base.json\` disponível para serviços herdarem
- [ ] Scripts \`lint\` e \`format\` funcionam
`,
  },
  {
    parent: 'STORY-001',
    title: 'Variáveis de ambiente — .env.example por serviço',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-001**. Documentar variáveis antes de implementar cada serviço.

## Passo a passo
1. Criar \`.env.example\` na raiz com variáveis globais:
   - \`NODE_ENV=development\`
   - \`LOG_LEVEL=debug\`
2. Para cada serviço NestJS em \`services/<nome>/\`, criar \`.env.example\` com:
   - \`PORT\` (porta única por serviço: gateway 3000, identity 3001, order 3002…)
   - \`DATABASE_URL\` (Postgres)
   - \`JWT_SECRET\` (apenas identity e gateway)
3. Adicionar \`.env\` ao \`.gitignore\` global se ainda não estiver.
4. Criar seção em \`docs/05-ops/setup-ambiente-local.md\` com tabela:

   | Serviço | Porta | Variáveis obrigatórias |
   |---|---|---|

5. Commitar exemplos — **nunca** commitar \`.env\` com valores reais.

## Critérios de aceite
- [ ] \`.env.example\` existe na raiz e em cada serviço NestJS planejado
- [ ] Portas documentadas sem conflito
- [ ] \`setup-ambiente-local.md\` atualizado com tabela de variáveis
`,
  },
  {
    parent: 'STORY-001',
    title: 'Scripts dev/build/test no api-gateway e README de setup',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-001**. Serviço piloto para validar que o monorepo funciona de ponta a ponta.

## Passo a passo
1. Em \`services/api-gateway/\`, garantir \`package.json\` com scripts:
   - \`"dev": "nest start --watch"\` (ou \`tsx watch\` se ainda sem Nest)
   - \`"build": "nest build"\`
   - \`"test": "jest"\`
2. Se o Nest ainda não foi gerado, criar \`package.json\` mínimo com script \`dev\` que sobe um servidor hello-world na porta 3000.
3. Na raiz do repositório, escrever README.md com seção **Começando**:
   \`\`\`bash
   git clone <repo>
   cd full-delivery
   npm install
   cp .env.example .env
   npm run dev:gateway
   curl http://localhost:3000/health
   \`\`\`
4. Validar que um dev novo consegue subir o gateway seguindo só o README.
5. Commitar: \`STORY-001: scripts e README de setup local\`.

## Critérios de aceite
- [ ] \`npm run dev:gateway\` sobe o serviço na porta 3000
- [ ] \`npm run build\` e \`npm run test\` existem no api-gateway
- [ ] README raiz com passos de setup testados
`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STORY-002 — Bootstrap dos microserviços NestJS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    parent: 'STORY-002',
    title: 'Gerar projeto NestJS do api-gateway',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-002**. Primeiro microserviço real com NestJS CLI.

## Passo a passo
1. Instalar Nest CLI global ou usar \`npx @nestjs/cli\`.
2. Em \`services/api-gateway/\`, gerar projeto:
   \`\`\`bash
   npx @nestjs/cli new . --skip-git --package-manager npm
   \`\`\`
3. Ajustar \`package.json\` para nome \`@full-delivery/api-gateway\`.
4. Estender \`tsconfig.json\` do serviço com \`"extends": "../../tsconfig.base.json"\`.
5. Configurar porta via \`process.env.PORT ?? 3000\` em \`main.ts\`.
6. Remover boilerplate desnecessário (manter AppModule limpo).
7. Verificar \`npm run dev\` dentro da pasta e via workspace raiz.

## Critérios de aceite
- [ ] NestJS rodando em \`services/api-gateway\`
- [ ] Porta configurável por env
- [ ] Herda tsconfig e lint da raiz
`,
  },
  {
    parent: 'STORY-002',
    title: 'Gerar projeto NestJS do identity-service',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-002**. Esqueleto do serviço de identidade — Ana assume após bootstrap.

## Passo a passo
1. Em \`services/identity-service/\`, gerar projeto NestJS (mesmo processo do gateway).
2. Nome do pacote: \`@full-delivery/identity-service\`.
3. Porta padrão: \`3001\` (documentar no \`.env.example\`).
4. Criar módulo vazio \`AuthModule\` e \`UsersModule\` (só estrutura de pastas).
5. Adicionar dependência \`@nestjs/config\` e carregar \`.env\`.
6. Confirmar que o serviço sobe independente do gateway.

## Critérios de aceite
- [ ] identity-service sobe na porta 3001
- [ ] Módulos Auth e Users criados (vazios)
- [ ] ConfigModule carrega variáveis de ambiente
`,
  },
  {
    parent: 'STORY-002',
    title: 'Gerar projeto NestJS do order-service',
    points: 1,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['ana'],
    body: `## Contexto
Subtask de **STORY-002**. Terceiro serviço base — Elton assume na SPRINT-02.

## Passo a passo
1. Em \`services/order-service/\`, gerar projeto NestJS.
2. Nome do pacote: \`@full-delivery/order-service\`.
3. Porta padrão: \`3002\`.
4. Criar módulo vazio \`OrdersModule\`.
5. Configurar \`@nestjs/config\` + \`.env.example\` com \`DATABASE_URL\`.
6. Validar build e dev independentes.

## Critérios de aceite
- [ ] order-service sobe na porta 3002
- [ ] OrdersModule criado
- [ ] Build passa sem erros
`,
  },
  {
    parent: 'STORY-002',
    title: 'Health check /health padronizado nos 3 serviços',
    points: 1,
    kind: 'feature',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-002**. Contrato uniforme para monitoramento e gateway agregado.

## Passo a passo
1. Em cada serviço (gateway, identity, order), instalar \`@nestjs/terminus\` (opcional) ou criar controller simples.
2. Criar \`HealthController\` com \`GET /health\` retornando:
   \`\`\`json
   { "status": "ok", "service": "identity-service", "timestamp": "..." }
   \`\`\`
3. Padronizar formato de resposta nos 3 serviços (mesmos campos).
4. Testar com curl em cada porta:
   - \`curl localhost:3000/health\`
   - \`curl localhost:3001/health\`
   - \`curl localhost:3002/health\`
5. Documentar contrato em comentário no HealthController ou em \`docs/02-tecnico/\`.

## Critérios de aceite
- [ ] \`GET /health\` responde 200 nos 3 serviços
- [ ] JSON padronizado com \`status\`, \`service\` e \`timestamp\`
- [ ] Testado via curl localmente
`,
  },
  {
    parent: 'STORY-002',
    title: 'Docker Compose com Postgres para desenvolvimento local',
    points: 2,
    kind: 'chore',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-002**. Banco local compartilhado com isolamento por schema ou database.

## Passo a passo
1. Na raiz, criar \`docker-compose.yml\` com serviço \`postgres:16\`.
2. Configurar:
   - Porta \`5432:5432\`
   - Usuário/senha: \`full_delivery / full_delivery\`
   - Volume persistente \`pgdata\`
3. **Opção A (recomendada MVP):** um database, schemas separados:
   - \`identity\`, \`orders\` (criar via script init)
4. Criar \`docker/postgres/init.sql\`:
   \`\`\`sql
   CREATE SCHEMA IF NOT EXISTS identity;
   CREATE SCHEMA IF NOT EXISTS orders;
   \`\`\`
5. Atualizar \`.env.example\` de cada serviço com \`DATABASE_URL\` apontando para o schema correto.
6. Subir com \`docker compose up -d\` e validar conexão com \`psql\` ou DBeaver.
7. Documentar no README: \`docker compose up -d\` antes de \`npm run dev\`.

## Critérios de aceite
- [ ] Postgres sobe com \`docker compose up -d\`
- [ ] Schemas \`identity\` e \`orders\` criados automaticamente
- [ ] DATABASE_URL documentada por serviço
`,
  },
  {
    parent: 'STORY-002',
    title: 'Proxy reverso no gateway para identity-service',
    points: 2,
    kind: 'feature',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-002**. Primeira integração entre serviços via gateway.

## Passo a passo
1. No \`api-gateway\`, instalar \`@nestjs/axios\` ou \`http-proxy-middleware\`.
2. Configurar variável \`IDENTITY_SERVICE_URL=http://localhost:3001\` no \`.env\`.
3. Criar \`ProxyModule\` ou usar middleware que encaminha:
   - \`/api/identity/*\` → \`identity-service\`
4. Testar encaminhamento:
   - Subir gateway (3000) e identity (3001)
   - \`curl http://localhost:3000/api/identity/health\` deve retornar health do identity
5. Adicionar log de request no gateway (method, path, status).
6. Tratar erro quando identity estiver offline (502 com mensagem clara).

## Critérios de aceite
- [ ] Gateway proxy \`/api/identity/*\` para identity-service
- [ ] Health do identity acessível via gateway
- [ ] Erro 502 quando serviço downstream está down
`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STORY-003 — Organizar ownership squad ↔ serviço
  // ═══════════════════════════════════════════════════════════════════════════
  {
    parent: 'STORY-003',
    title: 'Validar squads.json — 1 squad = 1 serviço',
    points: 1,
    kind: 'docs',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-003**. Fonte de verdade do ownership no gerenciador de projetos.

## Passo a passo
1. Abrir \`docs/04-time/squads.json\` no gerenciador (view Squads).
2. Para cada squad, confirmar que \`services\` tem **exatamente 1** entrada.
3. Conferir mapa esperado:
   | Squad | Serviço |
   |---|---|
   | plataforma | api-gateway |
   | identidade | identity-service |
   | estabelecimentos | merchant-service |
   | pedidos | order-service |
   | logistica | logistics-service |
   | pagamentos | payment-service |
   | app-cliente | client-app |
   | app-entregador | courier-app |
4. Corrigir via API/UI qualquer squad sem serviço ou com múltiplos.
5. Conferir \`docs/04-time/team.json\`: cada dev com \`squad\` válido.
6. Rodar \`npm run lint:docs\` para validar referências.

## Critérios de aceite
- [ ] 8 squads com 1 serviço cada em squads.json
- [ ] Membros do time com squad válido (ou null para produto transversal)
- [ ] lint:docs passa
`,
  },
  {
    parent: 'STORY-003',
    title: 'Atualizar system-architecture.md com diagrama Mermaid',
    points: 1,
    kind: 'docs',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-003**. Documentação visual da arquitetura para todos os squads.

## Passo a passo
1. Abrir \`docs/02-tecnico/system-architecture.md\`.
2. Atualizar diagrama Mermaid com todos os 8 serviços e apps.
3. Atualizar tabela **Componentes** com colunas: Serviço | Squad | Responsabilidade | Stack.
4. Descrever fluxo de dados resumido (auth → pedido → pagamento → entrega).
5. Linkar para ADR-001 (stack) e ADR-002 (microserviços).
6. Editar via gerenciador ou \`docsWriter\` — não quebrar frontmatter.
7. Validar que o Mermaid renderiza no preview do gerenciador.

## Critérios de aceite
- [ ] Diagrama inclui gateway + 5 backends + 2 apps
- [ ] Tabela de componentes alinhada ao squads.json
- [ ] Links para ADRs funcionando
`,
  },
  {
    parent: 'STORY-003',
    title: 'Registrar e aceitar ADR-002 arquitetura microserviços',
    points: 1,
    kind: 'docs',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-003**. Decisão formal de 1 squad = 1 serviço.

## Passo a passo
1. Verificar se \`docs/02-tecnico/decisions/ADR-002-arquitetura-microservicos.md\` existe.
2. Se necessário, criar via POST \`/api/decisions\` com:
   - Contexto: domínios distintos, ownership por squad
   - Decisão: lista dos 8 serviços
   - Alternativas: monólito modular (descartado)
   - Consequências: deploy independente, banco por serviço
3. Alterar \`status\` para \`accepted\` no frontmatter.
4. Referenciar ADR-002 em \`tech-stack.md\`.
5. Comunicar no canal do time o mapa squad → serviço.

## Critérios de aceite
- [ ] ADR-002 existe com status \`accepted\`
- [ ] Lista completa de serviços na decisão
- [ ] tech-stack.md referencia o ADR
`,
  },
  {
    parent: 'STORY-003',
    title: 'Mapa squad→pasta no repo e tags nos cards do Kanban',
    points: 1,
    kind: 'docs',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-003**. Liga documentação, código e Kanban.

## Passo a passo
1. Criar arquivo \`services/README.md\` na raiz de services/ com tabela:

   | Pasta | Squad | Dono principal |
   |---|---|---|

2. Para cada história do backlog (SPRINT-01 em diante), verificar campo \`squad:\` no frontmatter.
3. No gerenciador Kanban, filtrar por squad e confirmar que cards aparecem corretamente.
4. Histórias sem squad (ex.: produto transversal) mantêm \`squad: null\`.
5. Adicionar convenção no README raiz: *"Todo PR deve referenciar STORY-XXX do squad dono"*.

## Critérios de aceite
- [ ] \`services/README.md\` com mapa completo squad → pasta → pessoa
- [ ] Histórias SPRINT-02+ têm squad preenchido
- [ ] Kanban filtra por squad sem erros
`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STORY-004 — Autenticação e perfis de usuário
  // ═══════════════════════════════════════════════════════════════════════════
  {
    parent: 'STORY-004',
    title: 'Modelagem User e Profile + migration Postgres',
    points: 1,
    kind: 'feature',
    squad: 'identidade',
    assignees: ['ana'],
    body: `## Contexto
Subtask de **STORY-004**. Base de dados do identity-service.

## Passo a passo
1. No \`identity-service\`, instalar \`@nestjs/typeorm\` (ou Prisma) + \`pg\`.
2. Criar entidade \`User\`:
   - \`id\` (uuid), \`email\` (unique), \`password_hash\`, \`role\` (enum: customer, courier, merchant)
   - \`created_at\`, \`updated_at\`
3. Criar entidade \`Profile\`:
   - \`user_id\` (FK), \`name\`, \`phone\`, \`document\` (opcional)
4. Configurar TypeORM para schema \`identity\` (DATABASE_URL da SPRINT-002).
5. Gerar e rodar migration inicial.
6. Validar tabelas com \`psql\` ou cliente SQL.

## Critérios de aceite
- [ ] Tabelas \`users\` e \`profiles\` no schema identity
- [ ] Migration versionada no repositório
- [ ] Conexão com Postgres do Docker Compose funcionando
`,
  },
  {
    parent: 'STORY-004',
    title: 'POST /auth/register com hash bcrypt',
    points: 2,
    kind: 'feature',
    squad: 'identidade',
    assignees: ['ana'],
    body: `## Contexto
Subtask de **STORY-004**. Cadastro seguro de novos usuários.

## Passo a passo
1. Instalar \`bcrypt\` e \`class-validator\` + \`class-transformer\`.
2. Criar DTO \`RegisterDto\`: email, password (min 8 chars), name, phone, role.
3. Implementar \`AuthService.register()\`:
   - Validar e-mail único (409 se duplicado)
   - Hash senha com bcrypt (salt rounds ≥ 10)
   - Criar User + Profile em transação
4. Criar \`AuthController\` com \`POST /auth/register\`.
5. Retornar 201 com \`{ id, email, role }\` — **nunca** retornar password_hash.
6. Testar via curl/Postman:
   \`\`\`bash
   curl -X POST localhost:3001/auth/register \\
     -H 'Content-Type: application/json' \\
     -d '{"email":"a@b.com","password":"senha123","name":"Ana","phone":"11999","role":"customer"}'
   \`\`\`

## Critérios de aceite
- [ ] Register cria user e profile
- [ ] Senha armazenada com bcrypt
- [ ] E-mail duplicado retorna 409
- [ ] Validação de campos obrigatórios (400)
`,
  },
  {
    parent: 'STORY-004',
    title: 'POST /auth/login e emissão de JWT com role',
    points: 2,
    kind: 'feature',
    squad: 'identidade',
    assignees: ['ana'],
    body: `## Contexto
Subtask de **STORY-004**. Autenticação e token para o gateway repassar.

## Passo a passo
1. Instalar \`@nestjs/jwt\` e \`@nestjs/passport\` + \`passport-jwt\`.
2. Configurar \`JWT_SECRET\` e \`JWT_EXPIRES_IN=1d\` no \`.env\`.
3. Criar DTO \`LoginDto\`: email, password.
4. Implementar \`AuthService.login()\`:
   - Buscar user por email
   - Comparar senha com bcrypt.compare
   - Se inválido: 401 Unauthorized
   - Gerar JWT com payload: \`{ sub: userId, email, role }\`
5. Criar \`POST /auth/login\` retornando \`{ access_token, user: { id, email, role, name } }\`.
6. Testar login com usuário criado no register.

## Critérios de aceite
- [ ] Login com credenciais válidas retorna JWT
- [ ] Credenciais inválidas retornam 401
- [ ] Token contém claims \`sub\`, \`email\` e \`role\`
`,
  },
  {
    parent: 'STORY-004',
    title: 'Middleware JWT no api-gateway',
    points: 1,
    kind: 'feature',
    squad: 'plataforma',
    assignees: ['gabriel-natan'],
    body: `## Contexto
Subtask de **STORY-004**. Gateway valida token antes de rotear para serviços protegidos.

## Passo a passo
1. No \`api-gateway\`, instalar \`@nestjs/jwt\` e \`passport-jwt\`.
2. Usar o **mesmo** \`JWT_SECRET\` do identity-service no \`.env\` do gateway.
3. Criar \`JwtAuthGuard\` que valida Bearer token no header \`Authorization\`.
4. Aplicar guard em rotas protegidas (ex.: \`/api/identity/profile\`).
5. Rotas públicas sem guard: \`/auth/register\`, \`/auth/login\`, \`/health\`.
6. Ao validar, repassar headers aos downstreams:
   - \`X-User-Id\`, \`X-User-Role\`, \`X-User-Email\`
7. Testar: request sem token → 401; com token válido → passa.

## Critérios de aceite
- [ ] Rotas protegidas exigem JWT válido
- [ ] Rotas de auth são públicas via gateway
- [ ] Claims repassados em headers para serviços downstream
`,
  },
  {
    parent: 'STORY-004',
    title: 'GET/PATCH perfil básico do usuário autenticado',
    points: 1,
    kind: 'feature',
    squad: 'identidade',
    assignees: ['ana'],
    body: `## Contexto
Subtask de **STORY-004**. Dados complementares além do login.

## Passo a passo
1. Criar \`ProfileController\` no identity-service.
2. \`GET /profile/me\` — usa \`user_id\` do header \`X-User-Id\` (injetado pelo gateway):
   - Retorna name, phone, email, role
3. \`PATCH /profile/me\` — atualiza name e phone (e-mail imutável nesta fase).
4. Criar guard interno que lê \`X-User-Id\` (confiança no gateway na rede interna).
5. Proteger rotas via gateway com JwtAuthGuard.
6. Testar fluxo completo: register → login → GET profile com token.

## Critérios de aceite
- [ ] GET /profile/me retorna dados do usuário logado
- [ ] PATCH /profile/me atualiza name e phone
- [ ] Usuário A não acessa perfil do usuário B
`,
  },
  {
    parent: 'STORY-004',
    title: 'Testes unitários dos fluxos de autenticação',
    points: 1,
    kind: 'chore',
    squad: 'identidade',
    assignees: ['ana'],
    body: `## Contexto
Subtask de **STORY-004**. Garantir qualidade mínima antes de merge.

## Passo a passo
1. Configurar Jest no identity-service (já vem com Nest).
2. Escrever testes para \`AuthService\`:
   - \`register\` cria usuário com hash correto
   - \`register\` rejeita e-mail duplicado
   - \`login\` retorna token para credenciais válidas
   - \`login\` lança erro para senha errada
3. Mockar repositório TypeORM (não bater no banco real nos unit tests).
4. Rodar \`npm run test\` no identity-service — todos passando.
5. Opcional: 1 teste e2e com Supertest em \`POST /auth/register\` + \`POST /auth/login\`.

## Critérios de aceite
- [ ] ≥ 4 testes unitários em AuthService passando
- [ ] \`npm run test\` verde no identity-service
- [ ] Cobertura dos fluxos register e login
`,
  },
];

async function main() {
  console.log('Criando subtasks da SPRINT-01...\n');
  const byParent = {};
  for (const st of subtasks) {
    await createSubtask(st);
    byParent[st.parent] = (byParent[st.parent] || 0) + 1;
  }
  console.log('\nResumo:');
  for (const [parent, count] of Object.entries(byParent)) {
    console.log(`  ${parent}: ${count} subtasks`);
  }
  console.log(`\n✓ ${subtasks.length} subtasks criadas.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
