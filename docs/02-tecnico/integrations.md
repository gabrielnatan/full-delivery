---
status: active
updated: '2026-07-09'
id: integrations
type: integration
tags: []
---
# Integrações

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
