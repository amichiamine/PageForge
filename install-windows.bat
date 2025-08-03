@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul
title PageForge - Installation Windows

:: Couleurs pour l'affichage
set "ESC="
set "GREEN=%ESC%[92m"
set "RED=%ESC%[91m"
set "YELLOW=%ESC%[93m"
set "BLUE=%ESC%[94m"
set "RESET=%ESC%[0m"

echo.
echo %BLUE%╔══════════════════════════════════════════════════════════════╗%RESET%
echo %BLUE%║                    🚀 PAGEFORGE INSTALLER                    ║%RESET%
echo %BLUE%║                  Installation Automatique Windows           ║%RESET%
echo %BLUE%║                        Version 1.0.0                        ║%RESET%
echo %BLUE%╚══════════════════════════════════════════════════════════════╝%RESET%
echo.

:: Variables
set "INSTALL_DIR=%CD%\pageforge"
set "NODE_MIN_VERSION=18"
set "REQUIRED_SPACE=500"
set "LOG_FILE=%TEMP%\pageforge-install.log"

echo %YELLOW%[INFO]%RESET% Démarrage de l'installation PageForge...
echo %YELLOW%[INFO]%RESET% Dossier d'installation : %INSTALL_DIR%
echo.

:: Fonction de log
call :log "=== PageForge Installation Windows ==="
call :log "Début d'installation : %DATE% %TIME%"

:: Étape 1 : Vérification des prérequis
echo %BLUE%[1/7]%RESET% Vérification des prérequis système...
call :check_prerequisites
if errorlevel 1 goto :error

:: Étape 2 : Vérification Node.js
echo %BLUE%[2/7]%RESET% Vérification de Node.js...
call :check_nodejs
if errorlevel 1 goto :error

:: Étape 3 : Création du dossier d'installation
echo %BLUE%[3/7]%RESET% Préparation du dossier d'installation...
call :prepare_directory
if errorlevel 1 goto :error

:: Étape 4 : Téléchargement/copie des fichiers
echo %BLUE%[4/7]%RESET% Installation des fichiers PageForge...
call :install_files
if errorlevel 1 goto :error

:: Étape 5 : Installation des dépendances
echo %BLUE%[5/7]%RESET% Installation des dépendances NPM...
call :install_dependencies
if errorlevel 1 goto :error

:: Étape 6 : Configuration de l'environnement
echo %BLUE%[6/7]%RESET% Configuration de l'environnement...
call :configure_environment
if errorlevel 1 goto :error

:: Étape 7 : Tests et finalisation
echo %BLUE%[7/7]%RESET% Tests et finalisation...
call :finalize_installation
if errorlevel 1 goto :error

:: Succès
echo.
echo %GREEN%╔══════════════════════════════════════════════════════════════╗%RESET%
echo %GREEN%║                  ✅ INSTALLATION RÉUSSIE !                   ║%RESET%
echo %GREEN%╚══════════════════════════════════════════════════════════════╝%RESET%
echo.
echo %GREEN%🎉 PageForge a été installé avec succès !%RESET%
echo.
echo %YELLOW%📁 Dossier d'installation :%RESET% %INSTALL_DIR%
echo %YELLOW%🌐 URL d'accès :%RESET% http://localhost:5000
echo.
echo %BLUE%🚀 Pour démarrer PageForge :%RESET%
echo    cd "%INSTALL_DIR%"
echo    npm run dev
echo.
echo %YELLOW%📖 Documentation complète disponible dans :%RESET% %INSTALL_DIR%\docs\
echo.

:: Proposition de démarrage automatique
set /p "start_now=Voulez-vous démarrer PageForge maintenant ? (O/n): "
if /i "!start_now!"=="O" (
    echo %BLUE%[INFO]%RESET% Démarrage de PageForge...
    cd "%INSTALL_DIR%"
    start "" cmd /k "npm run dev"
    echo %GREEN%✅ PageForge démarré !%RESET% Ouvrez http://localhost:5000 dans votre navigateur
)

call :log "Installation terminée avec succès"
pause
goto :eof

:: ============================================================================
:: FONCTIONS
:: ============================================================================

:check_prerequisites
    call :log "Vérification des prérequis"
    
    :: Vérification de l'espace disque
    for /f "tokens=3" %%a in ('dir /-c ^| find "bytes free"') do set "free_space=%%a"
    set "free_space=!free_space:,=!"
    set /a "free_mb=!free_space!/1048576"
    
    if !free_mb! LSS %REQUIRED_SPACE% (
        echo %RED%❌ Espace disque insuffisant !%RESET%
        echo    Requis : %REQUIRED_SPACE% MB
        echo    Disponible : !free_mb! MB
        call :log "ERREUR: Espace disque insuffisant"
        exit /b 1
    )
    
    echo %GREEN%   ✅ Espace disque suffisant (!free_mb! MB disponibles)%RESET%
    
    :: Vérification des permissions
    echo test > "%TEMP%\pageforge-test.tmp" 2>nul
    if not exist "%TEMP%\pageforge-test.tmp" (
        echo %RED%❌ Permissions insuffisantes !%RESET%
        call :log "ERREUR: Permissions insuffisantes"
        exit /b 1
    )
    del "%TEMP%\pageforge-test.tmp" 2>nul
    
    echo %GREEN%   ✅ Permissions suffisantes%RESET%
    call :log "Prérequis validés"
    exit /b 0

:check_nodejs
    call :log "Vérification Node.js"
    
    :: Vérifier si Node.js est installé
    node --version > nul 2>&1
    if errorlevel 1 (
        echo %RED%❌ Node.js n'est pas installé !%RESET%
        echo.
        echo %YELLOW%📥 Installation de Node.js requise :%RESET%
        echo    1. Téléchargez Node.js depuis : https://nodejs.org
        echo    2. Installez Node.js version 18 ou supérieure
        echo    3. Redémarrez ce script après installation
        echo.
        call :log "ERREUR: Node.js non installé"
        pause
        exit /b 1
    )
    
    :: Vérifier la version
    for /f "tokens=1 delims=." %%a in ('node --version') do (
        set "node_major=%%a"
        set "node_major=!node_major:v=!"
    )
    
    if !node_major! LSS %NODE_MIN_VERSION% (
        echo %RED%❌ Version Node.js insuffisante !%RESET%
        echo    Version installée : !node_major!
        echo    Version requise : %NODE_MIN_VERSION%+
        call :log "ERREUR: Version Node.js insuffisante"
        exit /b 1
    )
    
    echo %GREEN%   ✅ Node.js version !node_major! détecté%RESET%
    
    :: Vérifier NPM
    npm --version > nul 2>&1
    if errorlevel 1 (
        echo %RED%❌ NPM non disponible !%RESET%
        call :log "ERREUR: NPM non disponible"
        exit /b 1
    )
    
    echo %GREEN%   ✅ NPM disponible%RESET%
    call :log "Node.js et NPM validés"
    exit /b 0

:prepare_directory
    call :log "Préparation du dossier d'installation"
    
    :: Créer le dossier d'installation
    if exist "%INSTALL_DIR%" (
        echo %YELLOW%⚠️  Le dossier %INSTALL_DIR% existe déjà%RESET%
        set /p "overwrite=Voulez-vous le remplacer ? (O/n): "
        if /i "!overwrite!"=="O" (
            echo %YELLOW%   🗑️  Suppression du dossier existant...%RESET%
            rmdir /s /q "%INSTALL_DIR%" 2>nul
            call :log "Dossier existant supprimé"
        ) else (
            echo %RED%❌ Installation annulée par l'utilisateur%RESET%
            call :log "Installation annulée"
            exit /b 1
        )
    )
    
    mkdir "%INSTALL_DIR%" 2>nul
    if not exist "%INSTALL_DIR%" (
        echo %RED%❌ Impossible de créer le dossier d'installation !%RESET%
        call :log "ERREUR: Création dossier impossible"
        exit /b 1
    )
    
    echo %GREEN%   ✅ Dossier d'installation créé%RESET%
    call :log "Dossier d'installation préparé"
    exit /b 0

:install_files
    call :log "Installation des fichiers"
    
    :: Recherche du fichier ZIP
    set "zip_found="
    for %%f in (pageforge-*.zip pageforge.zip build.zip) do (
        if exist "%%f" (
            set "zip_found=%%f"
            goto :zip_found
        )
    )
    
    :zip_found
    if not defined zip_found (
        echo %YELLOW%⚠️  Aucun fichier ZIP PageForge trouvé%RESET%
        echo.
        echo %BLUE%📦 Options d'installation :%RESET%
        echo    1. Placez le fichier pageforge.zip dans ce dossier
        echo    2. Ou téléchargement automatique (si disponible)
        echo.
        
        set /p "download_option=Télécharger automatiquement ? (O/n): "
        if /i "!download_option!"=="O" (
            call :download_pageforge
            if errorlevel 1 exit /b 1
        ) else (
            echo %RED%❌ Fichier PageForge requis !%RESET%
            call :log "ERREUR: Fichier ZIP non trouvé"
            exit /b 1
        )
    ) else (
        echo %GREEN%   ✅ Fichier trouvé : !zip_found!%RESET%
        call :extract_zip "!zip_found!"
        if errorlevel 1 exit /b 1
    )
    
    call :log "Fichiers installés"
    exit /b 0

:extract_zip
    call :log "Extraction du fichier ZIP : %~1"
    
    :: Utiliser PowerShell pour extraire (Windows 10+)
    powershell -Command "Expand-Archive -Path '%~1' -DestinationPath '%INSTALL_DIR%' -Force" > nul 2>&1
    if errorlevel 1 (
        echo %RED%❌ Erreur lors de l'extraction !%RESET%
        call :log "ERREUR: Extraction ZIP échouée"
        exit /b 1
    )
    
    echo %GREEN%   ✅ Fichiers extraits avec succès%RESET%
    exit /b 0

:download_pageforge
    call :log "Téléchargement PageForge"
    echo %BLUE%   📥 Téléchargement de PageForge...%RESET%
    
    :: URL de téléchargement (à adapter selon vos besoins)
    set "download_url=https://github.com/pageforge/releases/latest/download/pageforge.zip"
    
    :: Téléchargement avec PowerShell
    powershell -Command "Invoke-WebRequest -Uri '%download_url%' -OutFile 'pageforge.zip'" > nul 2>&1
    if errorlevel 1 (
        echo %RED%❌ Échec du téléchargement !%RESET%
        echo    Veuillez télécharger manuellement PageForge
        call :log "ERREUR: Téléchargement échoué"
        exit /b 1
    )
    
    echo %GREEN%   ✅ Téléchargement terminé%RESET%
    call :extract_zip "pageforge.zip"
    exit /b 0

:install_dependencies
    call :log "Installation des dépendances NPM"
    
    cd "%INSTALL_DIR%"
    
    :: Vérification du package.json
    if not exist "package.json" (
        echo %RED%❌ Fichier package.json non trouvé !%RESET%
        call :log "ERREUR: package.json manquant"
        exit /b 1
    )
    
    echo %BLUE%   📦 Installation des dépendances...%RESET%
    echo    (Cela peut prendre quelques minutes)
    
    npm install --silent > "%LOG_FILE%" 2>&1
    if errorlevel 1 (
        echo %RED%❌ Erreur lors de l'installation NPM !%RESET%
        echo    Consultez les logs : %LOG_FILE%
        call :log "ERREUR: Installation NPM échouée"
        exit /b 1
    )
    
    echo %GREEN%   ✅ Dépendances installées avec succès%RESET%
    call :log "Dépendances NPM installées"
    exit /b 0

:configure_environment
    call :log "Configuration de l'environnement"
    
    cd "%INSTALL_DIR%"
    
    :: Copier le fichier .env.example vers .env
    if exist ".env.example" (
        copy ".env.example" ".env" > nul
        echo %GREEN%   ✅ Fichier .env créé depuis .env.example%RESET%
    ) else (
        :: Créer un .env basique
        echo # PageForge - Configuration Locale > .env
        echo NODE_ENV=development >> .env
        echo PORT=5000 >> .env
        echo DATABASE_URL=postgresql://localhost:5432/pageforge >> .env
        echo %GREEN%   ✅ Fichier .env créé avec configuration par défaut%RESET%
    )
    
    :: Information sur la base de données
    echo.
    echo %YELLOW%📋 Configuration Base de Données :%RESET%
    echo    Par défaut : PostgreSQL local (postgresql://localhost:5432/pageforge)
    echo    Pour modifier : Éditez le fichier %INSTALL_DIR%\.env
    echo.
    
    call :log "Environnement configuré"
    exit /b 0

:finalize_installation
    call :log "Finalisation de l'installation"
    
    cd "%INSTALL_DIR%"
    
    :: Test de l'installation
    echo %BLUE%   🧪 Test de l'installation...%RESET%
    npm run check > nul 2>&1
    if errorlevel 1 (
        echo %YELLOW%⚠️  Avertissement : Tests échoués (non bloquant)%RESET%
        call :log "Avertissement: Tests échoués"
    ) else (
        echo %GREEN%   ✅ Tests réussis%RESET%
        call :log "Tests réussis"
    )
    
    :: Créer des raccourcis utiles
    echo @echo off > start-pageforge.bat
    echo cd "%INSTALL_DIR%" >> start-pageforge.bat
    echo npm run dev >> start-pageforge.bat
    
    echo @echo off > build-pageforge.bat
    echo cd "%INSTALL_DIR%" >> build-pageforge.bat
    echo npm run build >> build-pageforge.bat
    
    echo %GREEN%   ✅ Raccourcis créés%RESET%
    
    :: Créer un dossier docs avec informations
    mkdir docs 2>nul
    echo # PageForge - Installation Locale Windows > docs\README.md
    echo. >> docs\README.md
    echo Installation terminée le %DATE% à %TIME% >> docs\README.md
    echo Dossier d'installation : %INSTALL_DIR% >> docs\README.md
    echo. >> docs\README.md
    echo ## Commandes utiles : >> docs\README.md
    echo - Démarrer : npm run dev >> docs\README.md
    echo - Build : npm run build >> docs\README.md
    echo - Tests : npm run check >> docs\README.md
    
    call :log "Installation finalisée"
    exit /b 0

:log
    echo %DATE% %TIME% - %~1 >> "%LOG_FILE%"
    exit /b 0

:error
    echo.
    echo %RED%╔══════════════════════════════════════════════════════════════╗%RESET%
    echo %RED%║                     ❌ ERREUR D'INSTALLATION                  ║%RESET%
    echo %RED%╚══════════════════════════════════════════════════════════════╝%RESET%
    echo.
    echo %RED%L'installation a échoué.%RESET%
    echo %YELLOW%Consultez les logs pour plus de détails : %LOG_FILE%%RESET%
    echo.
    call :log "Installation échouée"
    pause
    exit /b 1