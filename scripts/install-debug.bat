@echo off
:: ========================================
:: INSTALLATION DEBUG SITEJET
:: Version avec diagnostic complet
:: ========================================

setlocal EnableDelayedExpansion
color 0B

echo.
echo =====================================
echo  DIAGNOSTIC COMPLET SITEJET
echo =====================================
echo.

:: Informations système
echo [INFO] Informations systeme:
echo - OS: %OS%
echo - Processeur: %PROCESSOR_ARCHITECTURE%
echo - Utilisateur: %USERNAME%
echo - Repertoire: %CD%
echo.

:: Test Node.js
echo [DIAGNOSTIC 1] Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ECHEC: Commande 'node' introuvable dans PATH
    echo PATH actuel: %PATH%
    pause
    exit /b 1
) else (
    echo OK: Commande 'node' trouvee
    node --version 2>&1
    echo Code retour: %errorlevel%
)

echo.

:: Test npm
echo [DIAGNOSTIC 2] npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ECHEC: Commande 'npm' introuvable dans PATH
    pause
    exit /b 1
) else (
    echo OK: Commande 'npm' trouvee
    echo Version npm:
    npm --version 2>&1
    echo Code retour: %errorlevel%
    
    :: Test npm config
    echo Configuration npm:
    npm config get registry 2>&1
    echo.
)

:: Test structure
echo [DIAGNOSTIC 3] Structure fichiers...
echo Repertoire actuel: %CD%
if exist app (
    echo OK: Dossier 'app' existe
    if exist app\package.json (
        echo OK: Fichier 'app\package.json' existe
        echo Contenu package.json ^(premières lignes^):
        type app\package.json | head -10 2>nul || (
            echo Les 5 premieres lignes:
            for /f "tokens=*" %%a in ('type app\package.json') do (
                echo %%a
                set /a count+=1
                if !count! geq 5 goto :done
            )
            :done
        )
    ) else (
        echo ECHEC: Fichier 'app\package.json' manquant
    )
) else (
    echo ECHEC: Dossier 'app' manquant
    echo Fichiers presents:
    dir /b
)

echo.

:: Test npm install (dry-run)
echo [DIAGNOSTIC 4] Test npm install...
if exist app\package.json (
    cd app
    echo Test installation dependencies...
    npm install --dry-run --silent 2>&1 | findstr /i "error" && (
        echo AVERTISSEMENT: Erreurs potentielles detectees
    ) || (
        echo OK: Test npm install reussi
    )
    cd ..
) else (
    echo IGNORE: package.json manquant
)

echo.

:: Test espace disque
echo [DIAGNOSTIC 5] Espace disque...
for /f "tokens=3" %%a in ('dir /-c 2^>nul ^| findstr /i "libre"') do (
    echo Espace libre: %%a octets
    goto :space_done
)
echo Impossible de determiner l'espace libre
:space_done

echo.

:: Test connectivité npm
echo [DIAGNOSTIC 6] Connectivite npm...
npm ping 2>&1 | findstr /i "pong" && (
    echo OK: Connexion au registry npm
) || (
    echo AVERTISSEMENT: Probleme de connexion npm
)

echo.

:: Résumé
echo =====================================
echo  RESUME DU DIAGNOSTIC
echo =====================================

:: Variables d'environnement importantes
echo Variables importantes:
echo - NODE_ENV: %NODE_ENV%
echo - npm_config_cache: %npm_config_cache%
echo - APPDATA: %APPDATA%

echo.
echo Si tous les tests passent, vous pouvez:
echo 1. Utiliser install-simple.bat
echo 2. Ou installer manuellement:
echo    cd app
echo    npm install
echo    npm run dev

echo.
echo Appuyez sur une touche pour fermer...
pause >nul