# Sistema de Alertas

O sistema de alertas é um componente central da plataforma AWS Monitor que detecta, rastreia e gerencia problemas de segurança em recursos AWS. Este documento explica como os alertas são criados, gerenciados e exibidos na plataforma.

## Modelo de Dados de Alertas

Os alertas são armazenados em um banco de dados com a seguinte estrutura:

- `id`: Identificador único para o alerta
- `title`: Título do alerta descrevendo o problema
- `description`: Descrição detalhada do problema de segurança
- `resourceId`: Identificador do recurso AWS afetado pelo problema
- `resourceType`: Tipo de recurso AWS (ex: EC2Instance, IAMUser, SecurityGroup)
- `severity`: Nível de severidade (CRITICAL, HIGH, MEDIUM, LOW)
- `status`: Status atual (active, dismissed, resolved)
- `createdAt`: Timestamp de quando o alerta foi criado
- `updatedAt`: Timestamp de quando o alerta foi atualizado pela última vez
- `credentialId`: Referência à credencial AWS usada para descobrir o alerta

## Processo de Geração de Alertas

Os alertas são gerados através de vários processos:

1. **Verificações Agendadas**: Verificações de segurança automatizadas executadas periodicamente
2. **Verificações Manuais**: Verificações iniciadas pelo usuário no painel de Segurança
3. **Monitoramento em Tempo Real**: Monitoramento contínuo de eventos AWS através das APIs AWS

### Fluxo do Processo de Verificação

1. O usuário seleciona um perfil de credencial AWS para verificação
2. A plataforma se conecta à API AWS usando as credenciais selecionadas
3. Serviços de segurança verificam tipos específicos de recursos em busca de vulnerabilidades:
   - `IAMSecurityService`: Verifica usuários IAM, funções e políticas
   - `EC2SecurityService`: Verifica instâncias EC2, grupos de segurança e volumes
   - `VulnerabilityService`: Verificação abrangente em múltiplos serviços AWS
4. Problemas de segurança são identificados com base em melhores práticas e requisitos de conformidade
5. Cada problema de segurança é convertido em um alerta através da função `createAlertFromSecurityIssue`
6. Alertas são armazenados no banco de dados e exibidos no dashboard

## Gerenciamento de Alertas

A plataforma oferece várias maneiras de gerenciar alertas:

- **Filtragem**: Filtrar alertas por severidade, status, tipo de recurso e credencial AWS
- **Descartar**: Marcar alertas como descartados para reconhecê-los sem resolver
- **Resolver**: Marcar alertas como resolvidos após resolver o problema de segurança
- **Visão Detalhada**: Ver informações detalhadas sobre um alerta clicando nele

## Endpoints da API de Alertas

A plataforma inclui diversos endpoints de API para gerenciamento de alertas:

- `GET /api/alerts`: Recuperar alertas com filtragem opcional
- `PATCH /api/alerts`: Atualizar status de alerta (descartar ou resolver)
- `POST /api/alerts/iam`: Iniciar verificação de segurança IAM
- `POST /api/alerts/scan`: Iniciar verificação de segurança abrangente
- `GET /api/alerts/ec2`: Recuperar alertas específicos de EC2

## Componentes de Exibição de Alertas

Os alertas são exibidos no painel de Segurança com os seguintes componentes:

- **Cards de Resumo de Alertas**: Exibem contagens de alertas por severidade
- **Lista de Alertas**: Lista filtrável e ordenável de todos os alertas
- **Modal de Detalhes do Alerta**: Visão detalhada de um alerta específico
- **Badges de Status de Alerta**: Indicadores visuais de severidade e status do alerta 