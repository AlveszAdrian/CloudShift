@echo off
echo ===================================================
echo          AWS MONITORING PLATFORM v1.0
echo ===================================================
echo Iniciando plataforma de monitoramento AWS...
echo.

rem Mudar para o diretório do script
cd /d "%~dp0"

echo [1/4] Verificando ambiente...
if not exist package.json (
    echo ERRO: Arquivo package.json nao encontrado!
    echo Certifique-se de executar este script no diretorio raiz do projeto.
    echo Pressione qualquer tecla para sair...
    pause > nul
    exit /b 1
)

echo [2/4] Gerando cliente Prisma...
call npx prisma generate

echo [3/4] Verificando migrações do banco de dados...
call npx prisma migrate dev --name init

echo [4/4] Iniciando servidor Next.js...
start cmd /k "npm run dev"

echo.
echo Aguardando inicializacao do servidor (5 segundos)...
timeout /t 5 /nobreak > nul

echo Abrindo navegador...
start http://localhost:3000/dashboard

echo ===================================================
echo Servidor iniciado com sucesso!
echo - Dashboard disponível em: http://localhost:3000/dashboard
echo - API disponível em: http://localhost:3000/api
echo ===================================================
echo Para encerrar o servidor, feche o terminal do Next.js
echo. 