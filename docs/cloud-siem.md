# Cloud SIEM

O Sistema de Gerenciamento de Eventos e Informações de Segurança (SIEM) na Nuvem é um componente avançado da plataforma AWS Monitor que permite centralizar, analisar e responder a eventos de segurança e logs de toda a infraestrutura AWS. Este documento explica como o Cloud SIEM funciona, seus componentes principais e como utilizá-lo eficientemente.

## Visão Geral

O Cloud SIEM integra-se ao AWS CloudWatch Logs para coletar, processar e analisar logs de diversos serviços AWS. Ele fornece:

- Detecção de ameaças em tempo real
- Correlação de eventos de segurança
- Regras personalizáveis de detecção
- Alertas automatizados
- Monitoramento contínuo
- Análise de conformidade

## Componentes do SIEM

### Grupos de Log do CloudWatch

O SIEM utiliza os seguintes grupos de log padrão:

- `/aws/siem/security-events`: Eventos de segurança gerais
- `/aws/siem/network-activity`: Atividades de rede, como tráfego VPC Flow Logs
- `/aws/siem/authentication`: Eventos de autenticação e login
- `/aws/siem/api-activity`: Chamadas de API e atividades administrativas

### Filtros Métricos

Os filtros métricos processam os logs recebidos e extraem métricas importantes:

- `SecurityFailedActions`: Monitora ações de segurança com falha
- `FailedAuthentication`: Monitora tentativas de autenticação mal-sucedidas
- `SuspiciousAPIActivity`: Identifica atividades de API potencialmente maliciosas

### Alarmes do CloudWatch

Os alarmes são configurados para notificar sobre situações anômalas:

- `HighRateOfFailedAuthentication`: Alerta sobre múltiplas falhas de autenticação
- `CriticalSecurityFailures`: Notifica sobre falhas críticas de segurança

### Regras SIEM

As regras SIEM são padrões que identificam comportamentos suspeitos nos logs:

- **Failed Login Attempts**: Detecta tentativas repetidas de login com falha
- **Root Account Usage**: Identifica uso da conta root (prática não recomendada)
- **IAM Policy Changes**: Monitora alterações nas políticas de IAM
- **Security Group Changes**: Alerta sobre modificações em security groups

## Auto-Configuração

O Cloud SIEM oferece um recurso de auto-configuração que facilita a implementação inicial. Este processo:

1. Cria os grupos de log necessários no CloudWatch
2. Configura filtros métricos para monitorar padrões específicos nos logs
3. Estabelece alarmes para detectar anomalias
4. Implementa regras SIEM padrão para detecção de ameaças comuns

Para iniciar a auto-configuração:

1. Navegue até a página Cloud SIEM
2. Selecione uma credencial AWS válida
3. Clique no botão "Auto-Configure CloudSIEM"
4. Revise as ações propostas e confirme

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

- `logs:CreateLogGroup`
- `logs:PutMetricFilter`
- `logs:DescribeLogGroups`
- `logs:PutQueryDefinition`
- `logs:StartQuery`
- `logs:GetQueryResults`
- `cloudwatch:PutMetricAlarm`
- `cloudwatch:DescribeAlarms`

## Melhores Práticas

- Implemente o SIEM o mais cedo possível em seu ambiente AWS
- Personalize regras adicionais específicas para sua infraestrutura
- Mantenha suas regras atualizadas à medida que seu ambiente evolui
- Revise regularmente os alertas gerados pelo SIEM
- Integre com outras ferramentas de segurança quando necessário
- Configure retenção de logs apropriada para cumprir requisitos de conformidade

## Solução de Problemas

Se o Cloud SIEM não estiver funcionando corretamente:

1. Verifique se o CloudWatch está configurado corretamente
2. Confirme se as permissões da credencial AWS são suficientes
3. Verifique se os grupos de log existem e estão recebendo dados
4. Teste suas regras SIEM individualmente
5. Use o botão "Auto-Configure CloudSIEM" para restaurar a configuração padrão 