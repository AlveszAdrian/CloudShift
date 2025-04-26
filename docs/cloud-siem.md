# Cloud SIEM

O Sistema de Gerenciamento de Eventos e Informações de Segurança (SIEM) na Nuvem é um componente avançado da plataforma AWS Monitor que permite centralizar, analisar e responder a eventos de segurança e logs de toda a infraestrutura AWS. Este documento explica como o Cloud SIEM funciona, seus componentes principais e como utilizá-lo eficientemente.

## Visão Geral

O Cloud SIEM integra-se ao AWS CloudWatch Logs e CloudTrail para coletar, processar e analisar logs de diversos serviços AWS. Ele fornece:

- Detecção de ameaças em tempo real
- Correlação de eventos de segurança
- Regras personalizáveis de detecção
- Alertas automatizados
- Monitoramento contínuo
- Análise de conformidade

## Arquitetura

O Cloud SIEM utiliza a seguinte arquitetura na AWS:

1. **AWS CloudTrail** - Registra eventos de atividade em toda a conta AWS
2. **CloudWatch Logs** - Armazena e processa logs de várias fontes
3. **CloudWatch Metrics** - Monitora padrões específicos através de filtros de métrica
4. **CloudWatch Alarms** - Alerta sobre condições anômalas
5. **IAM Roles** - Gerencia permissões para os serviços se comunicarem

O fluxo de dados funciona da seguinte forma:

```
CloudTrail → CloudWatch Logs → Filtros de Métrica → CloudWatch Alarms → Alertas SIEM
```

## Componentes do SIEM

### Grupos de Log do CloudWatch

O SIEM utiliza os seguintes grupos de log padrão:

- `/aws/siem/security-events`: Eventos de segurança gerais e agregação de outros logs
- `/aws/siem/network-activity`: Atividades de rede, como tráfego VPC Flow Logs
- `/aws/siem/authentication`: Eventos de autenticação e login
- `/aws/siem/api-activity`: Chamadas de API e atividades administrativas
- `/aws/cloudtrail/management-events`: Logs específicos do CloudTrail

Todos os grupos de log são configurados com uma política de retenção de 30 dias.

### Configuração do CloudTrail

O SIEM cria ou atualiza um trail no CloudTrail chamado `CloudSIEM-Trail` com as seguintes características:

- Multi-região ativado para capturar eventos de todas as regiões AWS
- Validação de arquivo de log habilitada para garantir integridade
- Eventos de serviços globais incluídos (como IAM, Route53, etc.)
- Integração com CloudWatch Logs para análise em tempo real
- Papel IAM dedicado para o CloudTrail escrever nos logs

### IAM Roles e Permissões

O SIEM cria as seguintes funções IAM:

- **CloudTrailToCloudWatchLogsRole**: Permite que o CloudTrail escreva nos grupos de log do CloudWatch

Esta função possui uma política de confiança que permite ao serviço CloudTrail assumir a função, e uma política de permissões que concede acesso para:
- Criar streams de log
- Enviar eventos de log
- Descrever streams de log

### Filtros de Métrica

Os filtros métricos processam os logs recebidos e extraem métricas importantes:

- `SecurityFailedActions`: Monitora ações de segurança com falha
- `FailedAuthentication`: Monitora tentativas de autenticação mal-sucedidas
- `SuspiciousAPIActivity`: Identifica atividades de API potencialmente maliciosas
- `S3BucketCreation`: Detecta quando novos buckets S3 são criados
- `S3BucketCreationExtended`: Versão estendida para maior precisão na detecção

### Subscription Filters

Filtros de assinatura são configurados para garantir que todos os eventos relevantes sejam encaminhados para o grupo de log central de segurança:

- Eventos do CloudTrail são encaminhados para `/aws/siem/security-events` para centralização

### Alarmes do CloudWatch

Os alarmes são configurados para notificar sobre situações anômalas:

- `HighRateOfFailedAuthentication`: Alerta sobre múltiplas falhas de autenticação
- `CriticalSecurityFailures`: Notifica sobre falhas críticas de segurança
- `S3BucketCreationAlert`: Alerta quando um novo bucket S3 é criado

### Regras SIEM

As regras SIEM são padrões que identificam comportamentos suspeitos nos logs:

- **Failed Login Attempts**: Detecta tentativas repetidas de login com falha
- **Root Account Usage**: Identifica uso da conta root (prática não recomendada)
- **IAM Policy Changes**: Monitora alterações nas políticas de IAM
- **Security Group Changes**: Alerta sobre modificações em security groups
- **Administrator Group Membership Changes**: Detecta quando usuários são adicionados a grupos de administrador
- **S3 Bucket Creation**: Identifica quando novos buckets S3 são criados

## Auto-Configuração

### Visão Geral

O Cloud SIEM oferece um poderoso recurso de auto-configuração que configura completamente a infraestrutura necessária na AWS. Este processo automatizado:

1. Cria os grupos de log necessários no CloudWatch com retenção apropriada
2. Configura um trail do CloudTrail dedicado e conecta aos logs
3. Cria as roles IAM necessárias com permissões adequadas
4. Estabelece filtros de métrica para monitorar padrões específicos
5. Configura filtros de assinatura para centralizar logs
6. Define alarmes do CloudWatch para detectar anomalias
7. Implementa regras SIEM padrão para detecção de ameaças comuns

### Requisitos para Auto-Configuração

Para executar a auto-configuração com sucesso, sua credencial AWS precisa ter as seguintes permissões:

- CloudTrail: `CreateTrail`, `UpdateTrail`, `StartLogging`, `DescribeTrails`
- CloudWatch Logs: `CreateLogGroup`, `PutRetentionPolicy`, `PutMetricFilter`, `PutSubscriptionFilter`
- CloudWatch: `PutMetricAlarm`, `DescribeAlarms`
- IAM: `CreateRole`, `PutRolePolicy`, `GetRole`
- STS: `GetCallerIdentity` (para obter o ID da conta)

### Processo de Auto-Configuração

Para iniciar a auto-configuração:

1. Navegue até a página Cloud SIEM
2. Selecione uma credencial AWS válida
3. Clique no botão "Auto-Configure CloudSIEM"
4. Revise a tela de confirmação que explica todas as alterações a serem realizadas
5. Clique em "Proceed with Configuration" para iniciar o processo
6. Acompanhe o progresso da configuração na tela

Durante a configuração, você verá atualizações em tempo real sobre cada etapa do processo. Ao concluir, um resumo detalhado das alterações será exibido, incluindo:

- Número de grupos de log criados
- Número de filtros de métrica configurados
- Número de alarmes estabelecidos
- Número de regras SIEM implementadas
- Status da configuração do CloudTrail

Se ocorrerem problemas durante a configuração, informações de diagnóstico detalhadas serão exibidas para ajudar na resolução.

### Remoção da Configuração

Caso seja necessário desfazer as configurações do SIEM, a plataforma oferece um recurso de remoção completa:

1. Navegue até a página Cloud SIEM
2. Selecione a mesma credencial AWS usada para a configuração
3. Clique no botão "Remove CloudSIEM Config"
4. Revise o aviso de confirmação detalhando quais recursos serão removidos
5. Clique em "Confirm Removal" para iniciar o processo
6. Acompanhe o progresso da remoção na tela

O processo de remoção:
- Remove o trail CloudTrail criado pelo SIEM
- Exclui a role IAM e as políticas associadas
- Remove os alarmes do CloudWatch
- Remove os filtros de métrica e filtros de inscrição
- Exclui os grupos de log criados pelo SIEM

**Atenção**: A remoção é irreversível e todos os logs armazenados serão excluídos permanentemente.

## API Cloud SIEM

### Estrutura da API

O Cloud SIEM é suportado por uma API REST robusta que permite automação e integração com outros sistemas:

#### Endpoints Principais:

- **GET /api/aws/siem/rules** - Lista todas as regras SIEM configuradas
- **POST /api/aws/siem/rules** - Cria uma nova regra SIEM
- **PUT /api/aws/siem/rules/:id** - Atualiza uma regra existente
- **DELETE /api/aws/siem/rules/:id** - Remove uma regra existente
- **POST /api/aws/siem/autoconfig** - Executa a autoconfiguração do ambiente
- **POST /api/aws/siem/autoconfig/remove** - Remove a configuração SIEM do ambiente AWS

### Implementação Técnica

A implementação da API utiliza Next.js API Routes e interage com os seguintes serviços AWS:

1. **CloudTrail Client**:
   - Cria e gerencia trails
   - Configura o envio de logs para o CloudWatch
   - Habilita o registro de eventos globais

2. **CloudWatch Logs Client**:
   - Gerencia grupos de log e retenção
   - Configura filtros de métrica para detectar padrões específicos
   - Estabelece filtros de assinatura para centralização de logs

3. **CloudWatch Client**:
   - Configura alarmes para métricas específicas
   - Define thresholds, períodos de avaliação e ações

4. **IAM Client**:
   - Cria e gerencia roles IAM para permissões entre serviços
   - Configura políticas de confiança e permissões
   - Gerencia acessos para serviços AWS interagirem entre si

5. **STS Client**:
   - Obtém a identidade atual para referência do ID da conta
   - Valida permissões e acesso

## Criação de Regras Personalizadas

Você pode criar regras SIEM personalizadas para atender às necessidades específicas do seu ambiente:

1. Navegue até a página Cloud SIEM
2. Clique em "Nova Regra"
3. Defina:
   - Nome e descrição
   - Tipo de regra (padrão de log, threshold, evento, detecção de anomalia)
   - Severidade
   - Status (ativo, inativo, teste)
   - Padrão/consulta de detecção

### Sintaxe de Consulta

A sintaxe para as regras segue o formato JSON Path para CloudWatch Logs:

```
{ $.eventName = "ConsoleLogin" && $.errorMessage = "Failed authentication" }
```

Para eventos do CloudTrail, você pode utilizar padrões mais específicos, como:

```
{ $.eventSource = "s3.amazonaws.com" && $.eventName = "CreateBucket" }
```

## Monitoramento de Eventos S3

O Cloud SIEM inclui funcionalidades específicas para monitorar eventos do Amazon S3:

1. **Filtros de Métrica Dedicados**:
   - Detecta criação de buckets S3
   - Monitora alterações de política em buckets existentes
   - Identifica modificações de ACLs

2. **Regras SIEM Específicas**:
   - Alerta sobre criação de buckets públicos
   - Detecta remoção de criptografia de buckets
   - Monitora modificações em políticas de bucket que possam comprometer a segurança

3. **Alarmes**:
   - Notifica imediatamente sobre criação de novos buckets
   - Alerta sobre alterações de permissão que concedem acesso público

## Gerenciamento de Regras

O SIEM permite gerenciar regras existentes:

- **Ativar/Desativar**: Controle quais regras estão ativas
- **Editar**: Modifique parâmetros de regras existentes
- **Excluir**: Remova regras desnecessárias
- **Filtrar**: Procure regras específicas por nome, descrição ou tipo

## Integração com Alertas

Os eventos detectados pelo SIEM são integrados ao sistema de alertas da plataforma:

1. Quando uma regra SIEM detecta um evento correspondente, um alerta é gerado
2. O alerta inclui detalhes sobre o evento, severidade, recurso afetado
3. Os alertas são exibidos no Dashboard de Segurança
4. Os usuários podem resolver, descartar ou investigar cada alerta

## Requisitos e Permissões

Para utilizar o Cloud SIEM, sua credencial AWS precisa ter as seguintes permissões:

### CloudTrail
- `cloudtrail:CreateTrail`
- `cloudtrail:UpdateTrail`
- `cloudtrail:StartLogging`
- `cloudtrail:StopLogging`
- `cloudtrail:DescribeTrails`
- `cloudtrail:GetTrailStatus`
- `cloudtrail:DeleteTrail`

### CloudWatch Logs
- `logs:CreateLogGroup`
- `logs:DeleteLogGroup`
- `logs:PutRetentionPolicy`
- `logs:PutMetricFilter`
- `logs:DeleteMetricFilter`
- `logs:DescribeLogGroups`
- `logs:DescribeMetricFilters`
- `logs:PutSubscriptionFilter`
- `logs:DeleteSubscriptionFilter`
- `logs:PutQueryDefinition`
- `logs:StartQuery`
- `logs:GetQueryResults`

### CloudWatch
- `cloudwatch:PutMetricAlarm`
- `cloudwatch:DeleteAlarms`
- `cloudwatch:DescribeAlarms`

### IAM
- `iam:CreateRole`
- `iam:DeleteRole`
- `iam:GetRole`
- `iam:PutRolePolicy`
- `iam:DeleteRolePolicy`

### STS
- `sts:GetCallerIdentity`

### S3
- `s3:ListAllMyBuckets`

## Melhores Práticas

- Implemente o SIEM o mais cedo possível em seu ambiente AWS
- Utilize a função de autoconfiguração para garantir a configuração correta
- Personalize regras adicionais específicas para sua infraestrutura
- Mantenha suas regras atualizadas à medida que seu ambiente evolui
- Revise regularmente os alertas gerados pelo SIEM
- Integre com outras ferramentas de segurança quando necessário
- Configure retenção de logs apropriada para cumprir requisitos de conformidade
- Realize backups de suas regras SIEM personalizadas antes de remover a configuração

## Solução de Problemas

Se o Cloud SIEM não estiver funcionando corretamente:

### Problemas de Configuração
1. Verifique se o CloudTrail está configurado corretamente e está enviando logs para o CloudWatch
2. Confirme se as permissões da credencial AWS são suficientes
3. Verifique se os grupos de log existem e estão recebendo dados
4. Confirme que os filtros de métrica estão configurados corretamente
5. Verifique se o ARN do grupo de logs do CloudTrail termina com `:*` (necessário para funcionamento correto)

### Problemas de Detecção
1. Teste suas regras SIEM individualmente
2. Verifique se os eventos estão sendo registrados corretamente no CloudTrail
3. Use o console AWS para verificar se os eventos esperados estão disponíveis nos logs
4. Confirme que o padrão da sua regra corresponde ao formato real dos eventos

### Resolver Problemas Comuns
1. **Logs não aparecem**: Verifique se o CloudTrail está registrando eventos e se a integração com CloudWatch está funcionando
2. **Regras não detectam eventos**: Revise a sintaxe da regra e compare com eventos reais nos logs
3. **Erros de permissão**: Verifique as permissões IAM detalhadas na seção de requisitos
4. **Problemas com a autoconfiguração**: Use o botão "Auto-Configure CloudSIEM" para restaurar a configuração padrão e verifique as informações de diagnóstico
5. **Filtros de métrica não funcionam**: Confirme que o padrão do filtro corresponde ao formato dos eventos no log

Se necessário, remova completamente a configuração usando o botão "Remove CloudSIEM Config" e execute a autoconfiguração novamente. 