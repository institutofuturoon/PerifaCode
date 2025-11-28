@echo off
echo ========================================
echo Deploy das Regras do Firestore
echo ========================================
echo.

echo Verificando Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Firebase CLI nao encontrado!
    echo.
    echo Instale com: npm install -g firebase-tools
    echo.
    pause
    exit /b 1
)

echo Firebase CLI encontrado!
echo.

echo Fazendo deploy das regras do Firestore...
firebase deploy --only firestore:rules

if errorlevel 1 (
    echo.
    echo [ERRO] Falha no deploy!
    echo.
    echo Verifique se voce esta logado: firebase login
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [SUCESSO] Regras atualizadas!
echo ========================================
echo.
pause
