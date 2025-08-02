# ========================================
# SiteJet - Installation PowerShell
# Version robuste pour Windows
# ========================================

param(
    [switch]$SkipChecks,
    [switch]$Minimal,
    [string]$Port = "3000"
)

# Configuration
$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "SiteJet Installation"

# Couleurs
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }

# Logo
Clear-Host
Write-Host @"

   ███████╗██╗████████╗███████╗     ██╗███████╗████████╗
   ██╔════╝██║╚══██╔══╝██╔════╝     ██║██╔════╝╚══██╔══╝
   ███████╗██║   ██║   █████╗       ██║█████╗     ██║   
   ╚════██║██║   ██║   ██╔══╝  ██   ██║██╔══╝     ██║   
   ███████║██║   ██║   ███████╗╚█████╔╝███████╗   ██║   
   ╚══════╝╚═╝   ╚═╝   ╚══════╝ ╚════╝ ╚══════╝   ╚═╝   

   Éditeur Visuel de Sites Web - Installation PowerShell
   ===================================================

"@ -ForegroundColor Magenta

Write-Info "Environnement: Windows $(([Environment]::OSVersion.Version).Major).$(([Environment]::OSVersion.Version).Minor)"
Write-Info "Utilisateur: $env:USERNAME"
Write-Info "PowerShell: $($PSVersionTable.PSVersion)"
Write-Host ""

try {
    # ========================================
    # 1. VÉRIFICATIONS SYSTÈME
    # ========================================
    
    if (-not $SkipChecks) {
        Write-Info "Vérification des prérequis..."
        
        # Test Node.js
        try {
            $nodeVersion = & node --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Node.js détecté: $nodeVersion"
            } else {
                throw "Node.js non trouvé"
            }
        } catch {
            Write-Error "Node.js n'est pas installé ou accessible"
            Write-Info "Téléchargez Node.js depuis: https://nodejs.org"
            Write-Info "Redémarrez votre ordinateur après installation"
            exit 1
        }
        
        # Test npm
        try {
            $npmVersion = & npm --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "npm détecté: $npmVersion"
            } else {
                throw "npm non trouvé"
            }
        } catch {
            Write-Error "npm n'est pas accessible"
            Write-Info "Réinstallez Node.js depuis https://nodejs.org"
            exit 1
        }
        
        # Test structure
        if (-not (Test-Path "../app")) {
            Write-Error "Dossier 'app' manquant"
            Write-Info "Exécutez ce script depuis le dossier 'scripts'"
            exit 1
        }
        
        if (-not (Test-Path "../app/package.json")) {
            Write-Error "Fichier 'package.json' manquant"
            exit 1
        }
        
        Write-Success "Tous les prérequis sont satisfaits"
        Write-Host ""
    }
    
    # ========================================
    # 2. PRÉPARATION
    # ========================================
    
    Write-Info "Préparation de l'installation..."
    
    # Aller dans le dossier app
    Push-Location "../app"
    
    # Configuration npm optimisée
    & npm config set registry https://registry.npmjs.org/ 2>$null
    & npm config set fund false 2>$null
    & npm config set audit false 2>$null
    
    Write-Success "Configuration npm optimisée"
    
    # ========================================
    # 3. INSTALLATION DES DÉPENDANCES
    # ========================================
    
    Write-Info "Installation des dépendances..."
    Write-Info "Cela peut prendre 2-5 minutes selon votre connexion..."
    Write-Host ""
    
    # Options npm robustes
    $npmArgs = @(
        "install",
        "--no-audit",
        "--no-fund", 
        "--prefer-offline",
        "--progress=false"
    )
    
    if ($Minimal) {
        $npmArgs += "--production"
    }
    
    # Installation avec gestion d'erreur
    $installProcess = Start-Process -FilePath "npm" -ArgumentList $npmArgs -Wait -PassThru -NoNewWindow
    
    if ($installProcess.ExitCode -ne 0) {
        Write-Warning "Installation échouée, tentative avec options alternatives..."
        
        # Nettoyage cache
        & npm cache clean --force 2>$null
        
        # Réessai avec options de compatibilité
        $fallbackArgs = @(
            "install",
            "--legacy-peer-deps",
            "--no-audit",
            "--no-fund"
        )
        
        $retryProcess = Start-Process -FilePath "npm" -ArgumentList $fallbackArgs -Wait -PassThru -NoNewWindow
        
        if ($retryProcess.ExitCode -ne 0) {
            Write-Error "Installation impossible"
            Write-Info "Solutions possibles:"
            Write-Info "1. Vérifiez votre connexion internet"
            Write-Info "2. Essayez: npm cache clean --force"
            Write-Info "3. Redémarrez votre ordinateur"
            exit 1
        }
    }
    
    Write-Success "Dépendances installées avec succès"
    
    # ========================================
    # 4. CONFIGURATION
    # ========================================
    
    Write-Info "Configuration de l'environnement..."
    
    # Créer le fichier .env
    if (Test-Path "../config/.env.example") {
        Copy-Item "../config/.env.example" ".env" -Force
        Write-Success "Configuration copiée depuis le template"
    } else {
        $envContent = @"
DATABASE_URL=sqlite:./database.db
NODE_ENV=development
PORT=$Port
SESSION_SECRET=dev-secret-key-$(Get-Random)
CORS_ORIGIN=http://localhost:$Port
"@
        $envContent | Out-File -FilePath ".env" -Encoding UTF8
        Write-Success "Configuration par défaut créée"
    }
    
    # ========================================
    # 5. INITIALISATION BASE DE DONNÉES
    # ========================================
    
    Write-Info "Initialisation de la base de données..."
    
    try {
        $dbProcess = Start-Process -FilePath "npm" -ArgumentList @("run", "db:push") -Wait -PassThru -NoNewWindow -RedirectStandardError "nul"
        
        if ($dbProcess.ExitCode -eq 0) {
            Write-Success "Base de données initialisée"
        } else {
            Write-Warning "Problème d'initialisation de la base de données"
            Write-Info "L'application fonctionnera en mode dégradé"
        }
    } catch {
        Write-Warning "Initialisation DB ignorée (optionnelle)"
    }
    
    # ========================================
    # 6. TEST DE DÉMARRAGE
    # ========================================
    
    if (-not $Minimal) {
        Write-Info "Test de démarrage..."
        
        # Test que les modules sont bien installés
        if (Test-Path "node_modules") {
            $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
            Write-Success "$moduleCount modules installés"
        }
        
        # Test du script de démarrage
        if (Get-Content "package.json" | Select-String '"dev"') {
            Write-Success "Script de démarrage configuré"
        }
    }
    
    # ========================================
    # 7. FINALISATION
    # ========================================
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " INSTALLATION TERMINÉE AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Info "Comment démarrer SiteJet:"
    Write-Host "1. " -NoNewline; Write-Host "cd $((Get-Location).Path)" -ForegroundColor Yellow
    Write-Host "2. " -NoNewline; Write-Host "npm run dev" -ForegroundColor Yellow  
    Write-Host "3. " -NoNewline; Write-Host "Ouvrir http://localhost:$Port" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Info "Fichiers créés:"
    Write-Host "- Configuration: .env"
    Write-Host "- Dépendances: node_modules/"
    Write-Host "- Documentation: ../docs/"
    Write-Host ""
    
    # Proposition de démarrage automatique
    $startNow = Read-Host "Voulez-vous démarrer SiteJet maintenant ? (O/N)"
    
    if ($startNow -match '^[OoYy]') {
        Write-Info "Démarrage de SiteJet..."
        Write-Info "Appuyez sur Ctrl+C pour arrêter"
        Write-Host ""
        
        & npm run dev
    } else {
        Write-Info "Pour démarrer plus tard:"
        Write-Host "cd $((Get-Location).Path)" -ForegroundColor Yellow
        Write-Host "npm run dev" -ForegroundColor Yellow
    }
    
} catch {
    Write-Error "Erreur pendant l'installation: $($_.Exception.Message)"
    Write-Info "Consultez la documentation dans ../docs/TROUBLESHOOTING.md"
    exit 1
} finally {
    # Retour au dossier initial
    Pop-Location -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Installation PowerShell terminée." -ForegroundColor Magenta