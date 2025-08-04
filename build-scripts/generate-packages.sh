#!/bin/bash

# 🚀 GÉNÉRATEUR DE PACKAGES PAGEFORGE - SCRIPT UNIFIÉ
# 
# Crée automatiquement tous les packages de déploiement
# Compatible Linux, macOS et Windows (avec WSL/Git Bash)

set -e

VERSION="2.0.0"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGES_DIR="$BASE_DIR/packages"
BUILD_SCRIPTS_DIR="$BASE_DIR/build-scripts"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 PAGEFORGE v$VERSION                     ║"
    echo "║              Générateur de Packages Unifié                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_requirements() {
    echo "🔍 Vérification des prérequis..."
    
    # Python
    if command -v python3 &> /dev/null; then
        print_success "Python 3 détecté"
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version 2>&1 | cut -d" " -f2 | cut -d"." -f1)
        if [ "$PYTHON_VERSION" = "3" ]; then
            print_success "Python 3 détecté"
            PYTHON_CMD="python"
        else
            print_error "Python 3 requis"
            exit 1
        fi
    else
        print_error "Python non trouvé"
        echo "Installez Python 3 :"
        echo "  Ubuntu/Debian: sudo apt install python3"
        echo "  macOS: brew install python3"
        echo "  Windows: https://python.org"
        exit 1
    fi
    
    # PHP (optionnel pour certains packages)
    if command -v php &> /dev/null; then
        PHP_VERSION=$(php --version | head -n1 | cut -d" " -f2 | cut -d"." -f1,2)
        print_success "PHP $PHP_VERSION détecté"
    else
        print_warning "PHP non détecté (optionnel)"
    fi
    
    # Node.js (optionnel)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION détecté"
    else
        print_warning "Node.js non détecté (optionnel)"
    fi
    
    echo
}

cleanup_old_packages() {
    echo "🧹 Nettoyage des anciens packages..."
    
    if [ -d "$PACKAGES_DIR" ]; then
        rm -rf "$PACKAGES_DIR"
    fi
    
    mkdir -p "$PACKAGES_DIR"
    print_success "Dossier packages préparé"
    echo
}

generate_packages() {
    echo "📦 Génération des packages via Python..."
    echo
    
    cd "$BASE_DIR"
    
    if [ -f "$BUILD_SCRIPTS_DIR/create-packages.py" ]; then
        $PYTHON_CMD "$BUILD_SCRIPTS_DIR/create-packages.py"
    else
        print_error "Script create-packages.py non trouvé"
        exit 1
    fi
    
    echo
}

create_checksums() {
    echo "🔐 Génération des checksums..."
    
    cd "$PACKAGES_DIR"
    
    if command -v sha256sum &> /dev/null; then
        sha256sum pageforge-*.* > checksums.sha256
        print_success "Checksums SHA256 créés"
    elif command -v shasum &> /dev/null; then
        shasum -a 256 pageforge-*.* > checksums.sha256
        print_success "Checksums SHA256 créés (macOS)"
    else
        print_warning "Outil checksum non disponible"
    fi
    
    echo
}

create_release_notes() {
    echo "📝 Création des notes de version..."
    
    RELEASE_NOTES="$PACKAGES_DIR/RELEASE-NOTES-v$VERSION.md"
    
    cat > "$RELEASE_NOTES" << EOF
# PageForge v$VERSION - Notes de Version

**Date de publication :** $(date +"%Y-%m-%d %H:%M:%S")

## 📦 Packages Disponibles

### 🌐 pageforge-cpanel-v$VERSION.zip
- **Type** : Hébergement web cPanel
- **Installation** : Interface web avec support Node.js Selector
- **Prérequis** : PHP 7.4+, MySQL/PostgreSQL
- **Taille** : $(ls -lh pageforge-cpanel-*.zip 2>/dev/null | awk '{print $5}' || echo "N/A")

### 💻 pageforge-windows-v$VERSION.zip  
- **Type** : Installation locale Windows
- **Installation** : Scripts batch + interface web
- **Prérequis** : PHP 7.4+, Node.js 16+ (recommandé)
- **Taille** : $(ls -lh pageforge-windows-*.zip 2>/dev/null | awk '{print $5}' || echo "N/A")

### 🐧 pageforge-linux-v$VERSION.tar.gz
- **Type** : Installation locale Linux/macOS
- **Installation** : Scripts shell + interface web  
- **Prérequis** : PHP 7.4+, Node.js 16+ (recommandé)
- **Taille** : $(ls -lh pageforge-linux-*.tar.gz 2>/dev/null | awk '{print $5}' || echo "N/A")

### 🔧 pageforge-vscode-v$VERSION.zip
- **Type** : Environnement de développement VS Code
- **Installation** : Configuration automatique
- **Prérequis** : PHP 7.4+, Node.js 16+, VS Code, Git
- **Taille** : $(ls -lh pageforge-vscode-*.zip 2>/dev/null | awk '{print $5}' || echo "N/A")

## ✨ Nouveautés v$VERSION

### 🚀 Améliorations Majeures
- Installation cPanel avec support Node.js Selector intégré
- Interface d'installation moderne et responsive
- Scripts d'installation unifiés multi-plateformes
- Configuration automatique optimisée pour chaque environnement

### 🔧 Améliorations Techniques  
- Gestion d'erreurs améliorée dans tous les installateurs
- Support étendu des bases de données (MySQL, PostgreSQL, SQLite)
- Optimisations pour hébergements partagés
- Configuration VS Code professionnelle incluse

### 📚 Documentation
- Guides d'installation détaillés pour chaque plateforme
- Instructions spécifiques cPanel avec Node.js Selector
- Troubleshooting étendu
- Guide de développement VS Code complet

## 🛠️ Installation Rapide

### cPanel
1. Uploader pageforge-cpanel-v$VERSION.zip
2. Aller sur : votre-domaine.com/install-cpanel.php
3. Suivre l'assistant 7 étapes

### Windows
1. Extraire pageforge-windows-v$VERSION.zip
2. Double-clic sur start-installer.bat
3. Suivre l'interface web

### Linux/macOS
\`\`\`bash
tar -xzf pageforge-linux-v$VERSION.tar.gz
cd pageforge-linux-v$VERSION
./start-installer.sh
\`\`\`

### VS Code
\`\`\`bash
unzip pageforge-vscode-v$VERSION.zip
cd pageforge-vscode-v$VERSION
php setup.php
code .
\`\`\`

## 🔐 Vérification d'Intégrité

Vérifiez l'intégrité des packages avec :

\`\`\`bash
# Linux/macOS
sha256sum -c checksums.sha256

# Windows (PowerShell)
Get-FileHash pageforge-*.* -Algorithm SHA256
\`\`\`

## 🆘 Support

- **Documentation** : README.md dans chaque package
- **Installation** : Guides détaillés inclus
- **Développement** : Guide VS Code complet

---

**Note** : Cette version améliore considérablement l'expérience d'installation 
sur tous les environnements avec des interfaces modernes et une configuration automatisée.
EOF

    print_success "Notes de version créées"
    echo
}

show_summary() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ GÉNÉRATION TERMINÉE                    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo "📁 Packages générés dans : $PACKAGES_DIR"
    echo
    echo "📊 Résumé des packages :"
    
    cd "$PACKAGES_DIR"
    
    total_size=0
    for file in pageforge-*.*; do
        if [ -f "$file" ]; then
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
            total_size=$((total_size + size))
            
            # Formatage de la taille
            if [ $size -gt $((1024*1024*1024)) ]; then
                size_fmt="$(echo "scale=1; $size / 1024 / 1024 / 1024" | bc 2>/dev/null || echo "N/A") GB"
            elif [ $size -gt $((1024*1024)) ]; then
                size_fmt="$(echo "scale=1; $size / 1024 / 1024" | bc 2>/dev/null || echo "N/A") MB"
            elif [ $size -gt 1024 ]; then
                size_fmt="$(echo "scale=1; $size / 1024" | bc 2>/dev/null || echo "N/A") KB"
            else
                size_fmt="${size} B"
            fi
            
            printf "📦 %-35s %10s\n" "$file" "$size_fmt"
        fi
    done
    
    echo "─────────────────────────────────────────────────────"
    
    # Taille totale
    if [ $total_size -gt $((1024*1024*1024)) ]; then
        total_fmt="$(echo "scale=1; $total_size / 1024 / 1024 / 1024" | bc 2>/dev/null || echo "N/A") GB"
    elif [ $total_size -gt $((1024*1024)) ]; then
        total_fmt="$(echo "scale=1; $total_size / 1024 / 1024" | bc 2>/dev/null || echo "N/A") MB"
    else
        total_fmt="$(echo "scale=1; $total_size / 1024" | bc 2>/dev/null || echo "N/A") KB"
    fi
    
    printf "📊 %-35s %10s\n" "Taille totale" "$total_fmt"
    echo
    
    echo "🎯 Packages prêts pour la distribution !"
    echo "📚 Consultez RELEASE-NOTES-v$VERSION.md pour les détails"
    echo "🔐 Utilisez checksums.sha256 pour vérifier l'intégrité"
    echo
}

# Script principal
main() {
    print_header
    
    check_requirements
    cleanup_old_packages
    generate_packages
    create_checksums
    create_release_notes
    show_summary
    
    echo -e "${GREEN}🎉 Génération complète des packages PageForge v$VERSION réussie !${NC}"
}

# Gestion des options de ligne de commande
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Afficher cette aide"
        echo "  --version, -v  Afficher la version"
        echo "  --clean        Nettoyer uniquement les anciens packages"
        echo ""
        echo "Génère tous les packages PageForge pour distribution multi-plateforme."
        exit 0
        ;;
    --version|-v)
        echo "PageForge Package Generator v$VERSION"
        exit 0
        ;;
    --clean)
        echo "🧹 Nettoyage des anciens packages..."
        cleanup_old_packages
        echo "✅ Nettoyage terminé"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo "Option inconnue: $1"
        echo "Utilisez --help pour l'aide"
        exit 1
        ;;
esac