---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-067
type: story
status: todo
priority: high
points: 1
epic: mvp
sprint: SPRINT-01
parent: STORY-002
kind: feature
squad: plataforma
tags:
  - mvp
  - sprint-01
  - subtask
assignees:
  - gabriel-natan
---
# Health check /health padronizado nos 3 serviços

## Contexto
Subtask de **STORY-002**. Contrato uniforme para monitoramento e gateway agregado.

## Passo a passo
1. Em cada serviço (gateway, identity, order), instalar `@nestjs/terminus` (opcional) ou criar controller simples.
2. Criar `HealthController` com `GET /health` retornando:
   ```json
   { "status": "ok", "service": "identity-service", "timestamp": "..." }
   ```
3. Padronizar formato de resposta nos 3 serviços (mesmos campos).
4. Testar com curl em cada porta:
   - `curl localhost:3000/health`
   - `curl localhost:3001/health`
   - `curl localhost:3002/health`
5. Documentar contrato em comentário no HealthController ou em `docs/02-tecnico/`.

## Critérios de aceite
- [ ] `GET /health` responde 200 nos 3 serviços
- [ ] JSON padronizado com `status`, `service` e `timestamp`
- [ ] Testado via curl localmente

