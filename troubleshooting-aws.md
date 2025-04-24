# Solução de Problemas de Acesso à AWS

Este guia ajudará você a solucionar problemas comuns ao tentar acessar recursos da AWS através da plataforma de monitoramento.

## Requisitos para Credenciais AWS

Para que a plataforma funcione corretamente, suas credenciais AWS precisam:

1. **Estar ativas e válidas** - Credenciais que não expiraram
2. **Ter permissões adequadas** - O usuário IAM precisa ter pelo menos as seguintes permissões:
   - `ec2:DescribeInstances`
   - `s3:ListAllMyBuckets`
   - `s3:GetBucketPolicy`
   - `s3:GetPublicAccessBlock`
   - `guardduty:ListDetectors`
   - `guardduty:ListFindings`
   - `guardduty:GetFindings`

## Problemas Comuns e Soluções

### 1. Credenciais Inválidas

**Sintoma**: Erro "InvalidClientTokenId" ou "CredentialsError"

**Soluções**:
- Verifique se o Access Key ID e Secret Key foram inseridos corretamente
- Confirme que a credencial ainda é válida no console da AWS
- Se estiver usando credenciais temporárias, verifique se não expiraram

### 2. Permissões Insuficientes

**Sintoma**: Erro "AccessDenied" ou "UnauthorizedOperation"

**Soluções**:
- Verifique as políticas de permissão do usuário IAM no console da AWS
- Adicione as permissões necessárias para EC2, S3 e GuardDuty
- Exemplo de política IAM mínima:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "s3:ListAllMyBuckets",
        "s3:GetBucketPolicy",
        "s3:GetPublicAccessBlock",
        "guardduty:ListDetectors",
        "guardduty:ListFindings",
        "guardduty:GetFindings"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Região Incorreta

**Sintoma**: Não são mostrados recursos que você sabe que existem

**Soluções**:
- Verifique se selecionou a região correta onde seus recursos estão localizados
- Se seus recursos estão em várias regiões, considere adicionar uma credencial para cada região

### 4. Problemas de Rede

**Sintoma**: Erros de timeout ou falhas de conexão

**Soluções**:
- Verifique sua conexão com a internet
- Verifique se não há firewalls ou proxies bloqueando o acesso à AWS
- Tente novamente em alguns minutos

### 5. Não Aparecem Instâncias EC2 ou Buckets S3

**Sintoma**: A interface mostra listas vazias, mesmo tendo certeza que existem recursos

**Soluções**:
- Confirme que existem recursos na região especificada
- Verifique os logs de erro no console do servidor
- Atualize a página após alguns segundos

## Como Verificar Logs de Erro

Para obter mais detalhes sobre erros, verifique:

1. O console do navegador (F12 > Console)
2. Os logs do servidor Next.js no terminal
3. A resposta da API no DevTools do navegador > Aba Network

## Testando suas Credenciais

Para testar se suas credenciais funcionam corretamente, experimente:

1. Usar as mesmas credenciais no AWS CLI:
   ```
   aws configure
   aws ec2 describe-instances
   aws s3 ls
   ```

2. Testar no console da AWS com o mesmo usuário IAM

## Ainda Precisa de Ajuda?

Se ainda estiver tendo problemas:

1. Verifique se a AWS SDK está atualizada
2. Tente criar um novo usuário IAM com permissões específicas para esta aplicação
3. Confirme que não há problemas com o serviço AWS usando o AWS Service Health Dashboard 