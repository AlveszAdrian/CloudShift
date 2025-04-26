# Documentação da Plataforma AWS Monitor

Esta documentação fornece detalhes sobre a plataforma AWS Monitor, sua arquitetura, componentes e como cada parte do sistema funciona, com foco especial no sistema de alertas e SIEM.

## Índice

1. [Visão Geral da Plataforma](#visão-geral-da-plataforma)
2. [Sistema de Alertas](./alert-system.md)
3. [Cloud SIEM](./cloud-siem.md)
4. [Componentes do Dashboard](./dashboard-components.md)
5. [Gerenciamento de Segurança IAM](./iam-security.md)
6. [Rotação de Credenciais](./credential-rotation.md)
7. [Análise de Segurança](./security-scanning.md)

## Visão Geral da Plataforma

AWS Monitor é uma plataforma abrangente para monitoramento e proteção de recursos AWS. Ela oferece:

- Alertas de segurança em tempo real e detecção de vulnerabilidades
- Gerenciamento de acesso IAM e credenciais
- Verificação de conformidade de segurança
- Dashboard para monitoramento de recursos AWS
- Análise de segurança automatizada e relatórios
- Sistema integrado de SIEM para análise de logs de segurança

A plataforma é construída com Next.js e utiliza um banco de dados Prisma para armazenar alertas, dados do usuário e credenciais AWS.

## Estrutura da Documentação

Nossa documentação está organizada nas seguintes seções:

- [**Sistema de Alertas**](./alert-system.md): Detalhes sobre como os alertas são criados, gerenciados e exibidos
- [**Cloud SIEM**](./cloud-siem.md): Documentação sobre o Sistema de Gerenciamento de Eventos e Informações de Segurança na nuvem
- [**Componentes do Dashboard**](./dashboard-components.md): Informações sobre os principais componentes do dashboard
- [**Gerenciamento de Segurança IAM**](./iam-security.md): Documentação sobre monitoramento e gerenciamento de segurança IAM
- [**Rotação de Credenciais**](./credential-rotation.md): Guia para o sistema de rotação de credenciais
- [**Análise de Segurança**](./security-scanning.md): Informações sobre o sistema de análise de vulnerabilidades

## Arquitetura Técnica

A plataforma AWS Monitor é construída com as seguintes tecnologias-chave:

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes, Node.js
- **Banco de Dados**: SQLite com Prisma ORM
- **Integração AWS**: AWS SDK para JavaScript

A plataforma utiliza uma arquitetura modular com serviços especializados para diferentes tipos de recursos AWS, permitindo extensibilidade e análise de segurança focada. 