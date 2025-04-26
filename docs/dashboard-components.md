# Componentes do Dashboard

A plataforma AWS Monitor fornece um dashboard abrangente com múltiplos componentes para monitoramento e gerenciamento de recursos AWS. Este documento detalha os principais componentes do dashboard e suas funcionalidades.

## Dashboard Principal

O dashboard principal fornece uma visão geral do ambiente AWS com métricas chave e indicadores de status:

- **Pontuação de Segurança**: Classificação geral de segurança do ambiente AWS
- **Resumo de Alertas**: Contagem de alertas ativos por severidade
- **Utilização de Recursos**: Visão geral do uso de recursos AWS
- **Atividade Recente**: Linha do tempo de eventos recentes de segurança

## Dashboard de Segurança

O dashboard de Segurança é o hub central para monitoramento e gerenciamento de alertas de segurança:

- **Categorias de Alertas**: Filtra alertas por categoria (IAM, EC2, S3, etc.)
- **Filtros de Alertas**: Filtra alertas por severidade, status e tipo de recurso
- **Lista de Alertas**: Lista interativa de alertas de segurança com ordenação e filtragem
- **Detalhes do Alerta**: Modal com informações detalhadas sobre alertas selecionados
- **Controles de Verificação de Segurança**: Botões para iniciar verificações de segurança de recursos AWS

### Visualização de Alertas

O dashboard de Segurança inclui vários componentes para visualização de alertas:

- **Distribuição de Severidade de Alertas**: Gráfico mostrando a distribuição de alertas por severidade
- **Linha do Tempo de Alertas**: Linha do tempo mostrando a criação de alertas ao longo do tempo
- **Distribuição por Tipo de Recurso**: Gráfico mostrando alertas por tipo de recurso AWS

## Dashboard IAM

O dashboard IAM fornece ferramentas para gerenciamento de Identidade e Acesso da AWS:

- **Gerenciamento de Usuários**: Visualiza e gerencia usuários IAM
- **Gerenciamento de Chaves de Acesso**: Monitora e rotaciona chaves de acesso
- **Rotação de Credenciais**: Agenda e gerencia rotação de credenciais
- **Verificações de Segurança IAM**: Verifica configurações IAM para questões de segurança

### Gerenciador de Rotação de Credenciais

O componente Gerenciador de Rotação de Credenciais fornece:

- **Monitoramento da Idade das Chaves**: Rastreia a idade das chaves de acesso AWS
- **Agendamento de Rotação**: Agenda rotações de chaves para usuários IAM
- **Histórico de Rotação**: Visualiza histórico de rotações de chaves anteriores
- **Alertas de Rotação**: Alertas para chaves se aproximando da expiração

## Dashboard EC2

O dashboard EC2 fornece monitoramento e gerenciamento de instâncias EC2:

- **Lista de Instâncias**: Visualiza todas as instâncias EC2 com informações de status e segurança
- **Análise de Grupos de Segurança**: Identifica vulnerabilidades em grupos de segurança
- **Verificações de Segurança EC2**: Verifica configurações EC2 para questões de segurança
- **Gerenciamento de Volumes**: Gerencia volumes EBS e verifica criptografia

## Dashboard S3

O dashboard S3 foca no monitoramento de segurança de buckets S3:

- **Lista de Buckets**: Visualiza todos os buckets S3 com configuração de segurança
- **Verificações de Acesso Público**: Identifica buckets com acesso público
- **Status de Criptografia**: Verifica configurações de criptografia de buckets
- **Verificações de Segurança S3**: Verifica configurações S3 para questões de segurança

## Dashboard de Conformidade

O dashboard de Conformidade fornece monitoramento de conformidade:

- **Frameworks de Conformidade**: Visualiza status de conformidade para principais frameworks
- **Relatórios de Conformidade**: Gera relatórios de conformidade
- **Tarefas de Remediação**: Rastreia remediação de questões de conformidade
- **Verificações de Conformidade**: Verifica recursos AWS para questões de conformidade 