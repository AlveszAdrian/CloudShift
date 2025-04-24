# AWS Monitoring Platform

Uma plataforma para monitoramento e gerenciamento de recursos da AWS, incluindo EC2, S3, IAM e outros serviços.

## Funcionalidades

- **Dashboard Unificado**: Visualize todos os seus recursos AWS em um único lugar
- **Gerenciamento IAM**: Interface intuitiva para gerenciar usuários, grupos, funções e políticas IAM
- **Monitoramento de Segurança**: Identificação de problemas de segurança nos seus recursos AWS
- **Multi-conta**: Suporte para gerenciar múltiplas contas/credenciais AWS

## Pré-requisitos

- Node.js 14.x ou superior
- NPM 6.x ou superior
- Uma conta AWS e credenciais com permissões adequadas

## Configuração Inicial

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_segredo_aqui
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

5. Popule o banco de dados com dados iniciais (opcional):

```bash
npm run seed
```

## Iniciando a Plataforma

Para iniciar a plataforma de monitoramento AWS, utilize o script principal:

```bash
# No Windows
start-platform.bat
```

Este script vai:
1. Verificar o ambiente necessário
2. Gerar o cliente Prisma
3. Executar as migrações do banco de dados
4. Iniciar o servidor Next.js
5. Abrir automaticamente o navegador com o dashboard

O servidor estará disponível em http://localhost:3000/dashboard

## Adicionando Credenciais AWS

1. Acesse a página de configurações
2. Clique em "Adicionar Credencial AWS"
3. Insira o nome da credencial, Access Key ID, Secret Access Key e região

## Estrutura do Projeto

- `src/app` - Rotas e páginas da aplicação
- `src/components` - Componentes React reutilizáveis
- `src/lib` - Utilitários e funções auxiliares
- `src/hooks` - React Hooks personalizados
- `prisma` - Configuração e esquema do banco de dados

## Segurança

- Todas as credenciais AWS são armazenadas de forma criptografada
- Autenticação de usuários implementada com NextAuth.js
- Não compartilhe suas chaves de acesso AWS ou as credenciais de acesso à plataforma

## Solução de Problemas

### A aplicação não inicia

- Verifique se todas as dependências foram instaladas
- Confirme que as variáveis de ambiente estão configuradas corretamente
- Verifique os logs para possíveis erros

### Erros de conexão com a AWS

- Verifique se as credenciais AWS são válidas
- Confirme que o usuário tem as permissões necessárias na AWS
- Verifique a conectividade com a internet


