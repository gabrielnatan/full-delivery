---
created: '2026-07-09'
updated: '2026-07-09'
id: STORY-069
type: story
status: todo
priority: high
points: 2
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
# Proxy reverso no gateway para identity-service

## Contexto
Subtask de **STORY-002**. Primeira integração entre serviços via gateway.

## Passo a passo
1. No `api-gateway`, instalar `@nestjs/axios` ou `http-proxy-middleware`.
2. Configurar variável `IDENTITY_SERVICE_URL=http://localhost:3001` no `.env`.
3. Criar `ProxyModule` ou usar middleware que encaminha:
   - `/api/identity/*` → `identity-service`
4. Testar encaminhamento:
   - Subir gateway (3000) e identity (3001)
   - `curl http://localhost:3000/api/identity/health` deve retornar health do identity
5. Adicionar log de request no gateway (method, path, status).
6. Tratar erro quando identity estiver offline (502 com mensagem clara).

## Critérios de aceite
- [ ] Gateway proxy `/api/identity/*` para identity-service
- [ ] Health do identity acessível via gateway
- [ ] Erro 502 quando serviço downstream está down

