# ========================================
# SiteJet - Installation Rapide PowerShell
# Version minimaliste pour résolution rapide
# ========================================

$Host.UI.RawUI.WindowTitle = "SiteJet Installation Rapide"

Write-Host @"

   ⚡ SITEJET - INSTALLATION RAPIDE ⚡
   =================================

"@ -ForegroundColor Yellow

Write-Host "Vérification Node.js..." -ForegroundColor Cyan

# Test rapide Node.js
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js manquant - Installez depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Test rapide npm
try {
    $npmVersion = & npm --version 2>$null
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm manquant" -ForegroundColor Red
    exit 1
}

# Vérification structure
if (-not (Test-Path "../package.json")) {
    Write-Host "❌ Structure SiteJet incorrecte" -ForegroundColor Red
    Write-Host "Exécutez depuis le dossier scripts/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prérequis OK" -ForegroundColor Green
Write-Host ""

# Installation rapide
Write-Host "Installation des dépendances..." -ForegroundColor Cyan
Push-Location ".."

try {
    # Configuration npm rapide
    & npm config set audit false 2>$null
    & npm config set fund false 2>$null
    
    # Installation
    & npm install --no-audit --no-fund --silent
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Installation réussie" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Réessai avec options de compatibilité..." -ForegroundColor Yellow
        & npm install --legacy-peer-deps --silent
    }
    
    # Configuration minimale
    "DATABASE_URL=sqlite:./database.db`nNODE_ENV=development`nPORT=3000" | Out-File -FilePath ".env" -Encoding UTF8
    
    # Test DB
    & npm run db:push >$null 2>&1
    
    Write-Host ""
    Write-Host "🎉 INSTALLATION TERMINÉE !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Démarrage:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
    
    $start = Read-Host "Démarrer maintenant ? (O/N)"
    if ($start -match '^[OoYy]') {
        & npm run dev
    }
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Pop-Location
}