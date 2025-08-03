#!/bin/bash

# PageForge - Installation Linux/macOS
# Installation automatique et interactive
# Version 1.0.0

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# Configuration
INSTALL_DIR="./pageforge"
NODE_MIN_VERSION=18
REQUIRED_SPACE_MB=500
LOG_FILE="/tmp/pageforge-install.log"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Fonctions utilitaires
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

print_header() {
    clear
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BLUE}║                    🚀 PAGEFORGE INSTALLER                    ║${RESET}"
    echo -e "${BLUE}║                 Installation Automatique Linux              ║${RESET}"
    echo -e "${BLUE}║                        Version 1.0.0                        ║${RESET}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${RESET}"
    echo
}

print_step() {
    echo -e "${BLUE}[$1/7]${RESET} $2"
}

print_success() {
    echo -e "${GREEN}   ✅ $1${RESET}"
}

print_error() {
    echo -e "${RED}   ❌ $1${RESET}"
}

print_warning() {
    echo -e "${YELLOW}   ⚠️  $1${RESET}"
}

print_info() {
    echo -e "${CYAN}   ℹ️  $1${RESET}"
}

# Détection de l'OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        DISTRO=$(lsb_release -si 2>/dev/null || echo "Unknown")
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        DISTRO="macOS"
    else
        OS="unknown"
        DISTRO="Unknown"
    fi
    
    log "OS détecté: $OS ($DISTRO)"
}

# Vérification des prérequis système
check_prerequisites() {
    log "Début vérification prérequis"
    print_step 1 "Vérification des prérequis système..."
    
    # Vérification de l'espace disque
    local available_space
    if [[ "$OS" == "macos" ]]; then
        available_space=$(df -m . | awk 'NR==2 {print $4}')
    else
        available_space=$(df -BM . | awk 'NR==2 {gsub(/M/, "", $4); print $4}')
    fi
    
    if [[ $available_space -lt $REQUIRED_SPACE_MB ]]; then
        print_error "Espace disque insuffisant !"
        echo "   Requis : ${REQUIRED_SPACE_MB} MB"
        echo "   Disponible : ${available_space} MB"
        log "ERREUR: Espace disque insuffisant"
        return 1
    fi
    
    print_success "Espace disque suffisant (${available_space} MB disponibles)"
    
    # Vérification des permissions
    if [[ ! -w "." ]]; then
        print_error "Permissions d'écriture insuffisantes !"
        log "ERREUR: Permissions insuffisantes"
        return 1
    fi
    
    print_success "Permissions suffisantes"
    
    # Vérification des commandes essentielles
    local missing_commands=()
    
    for cmd in curl wget unzip; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        print_warning "Commandes manquantes : ${missing_commands[*]}"
        echo -e "${YELLOW}   Installation automatique des dépendances...${RESET}"
        
        if ! install_system_dependencies; then
            print_error "Impossible d'installer les dépendances système !"
            return 1
        fi
    fi
    
    print_success "Outils système disponibles"
    log "Prérequis validés"
    return 0
}

# Installation des dépendances système
install_system_dependencies() {
    log "Installation dépendances système"
    
    case "$DISTRO" in
        "Ubuntu"|"Debian")
            sudo apt-get update -qq
            sudo apt-get install -y curl wget unzip build-essential
            ;;
        "CentOS"|"RedHat"|"Fedora")
            if command -v dnf &> /dev/null; then
                sudo dnf install -y curl wget unzip gcc gcc-c++ make
            else
                sudo yum install -y curl wget unzip gcc gcc-c++ make
            fi
            ;;
        "macOS")
            # Vérifier si Homebrew est installé
            if ! command -v brew &> /dev/null; then
                print_info "Installation de Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew install curl wget
            ;;
        *)
            print_warning "Distribution non reconnue, installation manuelle requise"
            return 1
            ;;
    esac
    
    return 0
}

# Vérification de Node.js
check_nodejs() {
    log "Vérification Node.js"
    print_step 2 "Vérification de Node.js..."
    
    # Vérifier si Node.js est installé
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé !"
        echo
        echo -e "${YELLOW}📥 Installation de Node.js requise :${RESET}"
        
        read -p "   Voulez-vous installer Node.js automatiquement ? (O/n): " install_node
        if [[ $install_node =~ ^[Oo]$ ]] || [[ -z $install_node ]]; then
            if ! install_nodejs; then
                return 1
            fi
        else
            echo "   1. Installez Node.js depuis : https://nodejs.org"
            echo "   2. Ou utilisez un gestionnaire de paquets :"
            echo "      - Ubuntu/Debian: sudo apt install nodejs npm"
            echo "      - CentOS/RHEL: sudo yum install nodejs npm"
            echo "      - macOS: brew install node"
            echo "   3. Redémarrez ce script après installation"
            log "ERREUR: Node.js non installé"
            return 1
        fi
    fi
    
    # Vérifier la version
    local node_version
    node_version=$(node --version | sed 's/v//')
    local node_major
    node_major=$(echo "$node_version" | cut -d. -f1)
    
    if [[ $node_major -lt $NODE_MIN_VERSION ]]; then
        print_error "Version Node.js insuffisante !"
        echo "   Version installée : $node_version"
        echo "   Version requise : $NODE_MIN_VERSION+"
        log "ERREUR: Version Node.js insuffisante"
        return 1
    fi
    
    print_success "Node.js version $node_version détecté"
    
    # Vérifier NPM
    if ! command -v npm &> /dev/null; then
        print_error "NPM non disponible !"
        log "ERREUR: NPM non disponible"
        return 1
    fi
    
    local npm_version
    npm_version=$(npm --version)
    print_success "NPM version $npm_version disponible"
    
    log "Node.js et NPM validés"
    return 0
}

# Installation automatique de Node.js
install_nodejs() {
    log "Installation automatique Node.js"
    print_info "Installation de Node.js..."
    
    case "$DISTRO" in
        "Ubuntu"|"Debian")
            # Utiliser le dépôt NodeSource
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        "CentOS"|"RedHat"|"Fedora")
            # Utiliser le dépôt NodeSource
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
            ;;
        "macOS")
            if command -v brew &> /dev/null; then
                brew install node
            else
                print_error "Homebrew requis pour l'installation automatique sur macOS"
                return 1
            fi
            ;;
        *)
            # Installation via gestionnaire de version Node
            print_info "Installation via Node Version Manager (nvm)..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm install 18
            nvm use 18
            ;;
    esac
    
    # Vérifier l'installation
    if command -v node &> /dev/null; then
        print_success "Node.js installé avec succès"
        return 0
    else
        print_error "Échec de l'installation de Node.js"
        return 1
    fi
}

# Préparation du dossier d'installation
prepare_directory() {
    log "Préparation dossier d'installation"
    print_step 3 "Préparation du dossier d'installation..."
    
    # Créer le dossier d'installation
    if [[ -d "$INSTALL_DIR" ]]; then
        print_warning "Le dossier $INSTALL_DIR existe déjà"
        read -p "   Voulez-vous le remplacer ? (O/n): " overwrite
        if [[ $overwrite =~ ^[Oo]$ ]] || [[ -z $overwrite ]]; then
            print_info "Suppression du dossier existant..."
            rm -rf "$INSTALL_DIR"
            log "Dossier existant supprimé"
        else
            print_error "Installation annulée par l'utilisateur"
            log "Installation annulée"
            return 1
        fi
    fi
    
    mkdir -p "$INSTALL_DIR"
    if [[ ! -d "$INSTALL_DIR" ]]; then
        print_error "Impossible de créer le dossier d'installation !"
        log "ERREUR: Création dossier impossible"
        return 1
    fi
    
    print_success "Dossier d'installation créé"
    log "Dossier d'installation préparé"
    return 0
}

# Installation des fichiers
install_files() {
    log "Installation des fichiers"
    print_step 4 "Installation des fichiers PageForge..."
    
    # Recherche du fichier ZIP
    local zip_files=(pageforge-*.zip pageforge.zip build.zip)
    local zip_found=""
    
    for pattern in "${zip_files[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" ]]; then
                zip_found="$file"
                break 2
            fi
        done
    done
    
    if [[ -z "$zip_found" ]]; then
        print_warning "Aucun fichier ZIP PageForge trouvé"
        echo
        echo -e "${BLUE}📦 Options d'installation :${RESET}"
        echo "   1. Placez le fichier pageforge.zip dans ce dossier"
        echo "   2. Ou téléchargement automatique (si disponible)"
        echo
        
        read -p "Télécharger automatiquement ? (O/n): " download_option
        if [[ $download_option =~ ^[Oo]$ ]] || [[ -z $download_option ]]; then
            if ! download_pageforge; then
                return 1
            fi
        else
            print_error "Fichier PageForge requis !"
            log "ERREUR: Fichier ZIP non trouvé"
            return 1
        fi
    else
        print_success "Fichier trouvé : $zip_found"
        if ! extract_zip "$zip_found"; then
            return 1
        fi
    fi
    
    log "Fichiers installés"
    return 0
}

# Extraction du fichier ZIP
extract_zip() {
    local zip_file="$1"
    log "Extraction du fichier ZIP : $zip_file"
    
    if ! unzip -q "$zip_file" -d "$INSTALL_DIR"; then
        print_error "Erreur lors de l'extraction !"
        log "ERREUR: Extraction ZIP échouée"
        return 1
    fi
    
    print_success "Fichiers extraits avec succès"
    return 0
}

# Téléchargement de PageForge
download_pageforge() {
    log "Téléchargement PageForge"
    print_info "Téléchargement de PageForge..."
    
    # URL de téléchargement (à adapter selon vos besoins)
    local download_url="https://github.com/pageforge/releases/latest/download/pageforge.zip"
    
    if command -v curl &> /dev/null; then
        curl -L "$download_url" -o "pageforge.zip"
    elif command -v wget &> /dev/null; then
        wget "$download_url" -O "pageforge.zip"
    else
        print_error "Impossible de télécharger (curl ou wget requis) !"
        log "ERREUR: Pas d'outil de téléchargement"
        return 1
    fi
    
    if [[ ! -f "pageforge.zip" ]]; then
        print_error "Échec du téléchargement !"
        echo "   Veuillez télécharger manuellement PageForge"
        log "ERREUR: Téléchargement échoué"
        return 1
    fi
    
    print_success "Téléchargement terminé"
    extract_zip "pageforge.zip"
    return $?
}

# Installation des dépendances NPM
install_dependencies() {
    log "Installation dépendances NPM"
    print_step 5 "Installation des dépendances NPM..."
    
    cd "$INSTALL_DIR" || return 1
    
    # Vérification du package.json
    if [[ ! -f "package.json" ]]; then
        print_error "Fichier package.json non trouvé !"
        log "ERREUR: package.json manquant"
        return 1
    fi
    
    print_info "Installation des dépendances..."
    echo "   (Cela peut prendre quelques minutes)"
    
    if ! npm install --silent >> "$LOG_FILE" 2>&1; then
        print_error "Erreur lors de l'installation NPM !"
        echo "   Consultez les logs : $LOG_FILE"
        log "ERREUR: Installation NPM échouée"
        return 1
    fi
    
    print_success "Dépendances installées avec succès"
    log "Dépendances NPM installées"
    cd - > /dev/null
    return 0
}

# Configuration de l'environnement
configure_environment() {
    log "Configuration de l'environnement"
    print_step 6 "Configuration de l'environnement..."
    
    cd "$INSTALL_DIR" || return 1
    
    # Copier le fichier .env.example vers .env
    if [[ -f ".env.example" ]]; then
        cp ".env.example" ".env"
        print_success "Fichier .env créé depuis .env.example"
    else
        # Créer un .env basique
        cat > .env << EOF
# PageForge - Configuration Locale
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/pageforge
EOF
        print_success "Fichier .env créé avec configuration par défaut"
    fi
    
    # Information sur la base de données
    echo
    echo -e "${YELLOW}📋 Configuration Base de Données :${RESET}"
    echo "   Par défaut : PostgreSQL local (postgresql://localhost:5432/pageforge)"
    echo "   Pour modifier : Éditez le fichier $INSTALL_DIR/.env"
    echo
    
    log "Environnement configuré"
    cd - > /dev/null
    return 0
}

# Finalisation de l'installation
finalize_installation() {
    log "Finalisation de l'installation"
    print_step 7 "Tests et finalisation..."
    
    cd "$INSTALL_DIR" || return 1
    
    # Test de l'installation
    print_info "Test de l'installation..."
    if npm run check >> "$LOG_FILE" 2>&1; then
        print_success "Tests réussis"
        log "Tests réussis"
    else
        print_warning "Avertissement : Tests échoués (non bloquant)"
        log "Avertissement: Tests échoués"
    fi
    
    # Créer des scripts utiles
    cat > start-pageforge.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
npm run dev
EOF
    chmod +x start-pageforge.sh
    
    cat > build-pageforge.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
npm run build
EOF
    chmod +x build-pageforge.sh
    
    print_success "Scripts utiles créés"
    
    # Créer documentation
    mkdir -p docs
    cat > docs/README.md << EOF
# PageForge - Installation Locale Linux/macOS

Installation terminée le $(date)
Dossier d'installation : $INSTALL_DIR

## Commandes utiles :
- Démarrer : ./start-pageforge.sh ou npm run dev
- Build : ./build-pageforge.sh ou npm run build  
- Tests : npm run check

## URLs :
- Application : http://localhost:5000
- Documentation : docs/

## Configuration :
- Fichier d'environnement : .env
- Configuration base de données : DATABASE_URL dans .env
EOF
    
    print_success "Documentation créée"
    log "Installation finalisée"
    cd - > /dev/null
    return 0
}

# Fonction principale
main() {
    # Initialisation
    echo "=== PageForge Installation Linux/macOS ===" > "$LOG_FILE"
    echo "Début d'installation : $(date)" >> "$LOG_FILE"
    
    detect_os
    print_header
    
    echo -e "${YELLOW}[INFO]${RESET} Démarrage de l'installation PageForge..."
    echo -e "${YELLOW}[INFO]${RESET} Dossier d'installation : $INSTALL_DIR"
    echo -e "${YELLOW}[INFO]${RESET} Système détecté : $OS ($DISTRO)"
    echo
    
    # Exécution des étapes
    if ! check_prerequisites; then
        exit 1
    fi
    
    if ! check_nodejs; then
        exit 1
    fi
    
    if ! prepare_directory; then
        exit 1
    fi
    
    if ! install_files; then
        exit 1
    fi
    
    if ! install_dependencies; then
        exit 1
    fi
    
    if ! configure_environment; then
        exit 1
    fi
    
    if ! finalize_installation; then
        exit 1
    fi
    
    # Succès
    echo
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${GREEN}║                  ✅ INSTALLATION RÉUSSIE !                   ║${RESET}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${RESET}"
    echo
    echo -e "${GREEN}🎉 PageForge a été installé avec succès !${RESET}"
    echo
    echo -e "${YELLOW}📁 Dossier d'installation :${RESET} $INSTALL_DIR"
    echo -e "${YELLOW}🌐 URL d'accès :${RESET} http://localhost:5000"
    echo
    echo -e "${BLUE}🚀 Pour démarrer PageForge :${RESET}"
    echo "   cd \"$INSTALL_DIR\""
    echo "   npm run dev"
    echo "   # ou"
    echo "   ./start-pageforge.sh"
    echo
    echo -e "${YELLOW}📖 Documentation complète disponible dans :${RESET} $INSTALL_DIR/docs/"
    echo
    
    # Proposition de démarrage automatique
    read -p "Voulez-vous démarrer PageForge maintenant ? (O/n): " start_now
    if [[ $start_now =~ ^[Oo]$ ]] || [[ -z $start_now ]]; then
        echo -e "${BLUE}[INFO]${RESET} Démarrage de PageForge..."
        cd "$INSTALL_DIR"
        echo -e "${GREEN}✅ PageForge démarré !${RESET} Ouvrez http://localhost:5000 dans votre navigateur"
        npm run dev
    fi
    
    log "Installation terminée avec succès"
}

# Gestion des erreurs
trap 'echo -e "\n${RED}❌ Installation interrompue !${RESET}"; log "Installation interrompue"; exit 1' INT TERM

# Lancement du script
main "$@"