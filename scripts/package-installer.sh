#!/bin/bash

# ========================================
# INSTALLATEUR AUTOMATIQUE SITEJET
# Package de Distribution Linux/macOS
# ========================================

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Fonction d'affichage du logo
show_logo() {
    echo -e "${CYAN}"
    echo "    ███████╗██╗████████╗███████╗     ██╗███████╗████████╗"
    echo "    ██╔════╝██║╚══██╔══╝██╔════╝     ██║██╔════╝╚══██╔══╝"
    echo "    ███████╗██║   ██║   █████╗       ██║█████╗     ██║   "
    echo "    ╚════██║██║   ██║   ██╔══╝  ██   ██║██╔══╝     ██║   "
    echo "    ███████║██║   ██║   ███████╗╚█████╔╝███████╗   ██║   "
    echo "    ╚══════╝╚═╝   ╚═╝   ╚══════╝ ╚════╝ ╚══════╝   ╚═╝   "
    echo
    echo -e "${WHITE}    Éditeur Visuel de Sites Web - Installation Automatique${NC}"
    echo -e "${BLUE}    ========================================================${NC}"
    echo
}

# Fonction de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[AVERTISSEMENT]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

log_install() {
    echo -e "${PURPLE}[INSTALL]${NC} $1"
}

# Fonction de détection de l'OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
            PACKAGE_MANAGER="apt"
        elif [ -f /etc/redhat-release ]; then
            OS="rhel"
            PACKAGE_MANAGER="yum"
        elif [ -f /etc/arch-release ]; then
            OS="arch"
            PACKAGE_MANAGER="pacman"
        else
            OS="linux"
            PACKAGE_MANAGER="unknown"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        PACKAGE_MANAGER="brew"
    else
        OS="unknown"
        PACKAGE_MANAGER="unknown"
    fi
    
    log_info "Système détecté : $OS"
}

# Fonction d'installation de Node.js selon l'OS
install_nodejs() {
    log_install "Installation de Node.js..."
    
    case $OS in
        "debian")
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt update
            sudo apt install nodejs -y
            ;;
        "rhel")
            curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
            sudo yum install nodejs npm -y
            ;;
        "arch")
            sudo pacman -S nodejs npm --noconfirm
            ;;
        "macos")
            if command -v brew &> /dev/null; then
                brew install node
            else
                log_error "Homebrew requis sur macOS"
                log_info "Installez Homebrew : /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                return 1
            fi
            ;;
        *)
            log_error "Système non supporté pour l'installation automatique"
            log_info "Installez Node.js manuellement depuis https://nodejs.org"
            return 1
            ;;
    esac
    
    # Vérifier l'installation
    if command -v node &> /dev/null; then
        log_success "Node.js installé : $(node --version)"
        return 0
    else
        log_error "Échec de l'installation de Node.js"
        return 1
    fi
}

# Fonction de vérification de l'espace disque
check_disk_space() {
    log_info "Vérification de l'espace disque..."
    
    AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
    REQUIRED_SPACE=2097152  # 2GB en KB
    
    if [ "$AVAILABLE_SPACE" -lt "$REQUIRED_SPACE" ]; then
        log_warning "Espace disque faible ($(echo "scale=1; $AVAILABLE_SPACE/1024/1024" | bc)GB disponible)"
        log_warning "SiteForge nécessite au moins 2 Go d'espace libre."
        echo -n "Continuer malgré tout ? (o/N) "
        read -r CONTINUE
        if [[ ! "$CONTINUE" =~ ^[oO]$ ]]; then
            log_error "Installation annulée par l'utilisateur"
            exit 1
        fi
    else
        log_success "Espace disque suffisant ($(echo "scale=1; $AVAILABLE_SPACE/1024/1024" | bc)GB disponible)"
    fi
}

# Fonction de vérification de la connexion internet
check_internet() {
    log_info "Vérification de la connexion internet..."
    
    if ping -c 1 google.com &> /dev/null || ping -c 1 8.8.8.8 &> /dev/null; then
        log_success "Connexion internet disponible"
        return 0
    else
        log_warning "Connexion internet indisponible"
        log_warning "L'installation pourrait échouer sans connexion internet"
        return 1
    fi
}

# Fonction principale d'installation
main_install() {
    echo
    echo -e "${BLUE}========================================"
    echo -e "INSTALLATION DE SITEJET"
    echo -e "========================================${NC}"
    echo
    
    # Vérification du dossier app
    if [ ! -d "app" ]; then
        log_error "Dossier 'app' introuvable !"
        log_error "Assurez-vous d'exécuter ce script depuis le bon répertoire."
        exit 1
    fi
    
    log_info "Navigation vers le dossier app..."
    cd app || exit 1
    
    # Vérification de package.json
    if [ ! -f "package.json" ]; then
        log_error "Fichier package.json introuvable !"
        log_error "Le package SiteForge semble incomplet."
        exit 1
    fi
    
    # Installation des dépendances
    log_install "Installation des dépendances Node.js..."
    echo "Cela peut prendre quelques minutes selon votre connexion..."
    echo
    
    if npm install; then
        log_success "Dépendances installées avec succès !"
    else
        log_error "Échec de l'installation des dépendances !"
        echo
        echo "Solutions possibles :"
        echo "1. Vérifiez votre connexion internet"
        echo "2. Essayez : npm install --force"
        echo "3. Supprimez node_modules/ et recommencez"
        echo
        exit 1
    fi
    
    # Configuration de la base de données
    echo
    log_install "Configuration de la base de données..."
    
    if [ -f "../config/.env.example" ]; then
        log_info "Copie du fichier de configuration..."
        cp ../config/.env.example .env
        log_success "Fichier .env créé"
    else
        log_install "Création du fichier de configuration par défaut..."
        cat > .env << EOF
DATABASE_URL=sqlite:./database.db
NODE_ENV=development
PORT=3000
EOF
        log_success "Configuration par défaut créée"
    fi
    
    # Initialisation de la base de données
    log_install "Initialisation de la base de données..."
    if npm run db:push; then
        log_success "Base de données initialisée !"
    else
        log_warning "Erreur lors de l'initialisation de la base de données"
        log_warning "SiteForge fonctionnera mais certaines fonctionnalités peuvent être limitées."
    fi
    
    # Test rapide
    echo
    log_info "Test de l'installation..."
    log_info "Vérification des fichiers critiques..."
    
    CRITICAL_FILES=("package.json" "node_modules" ".env")
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -e "$file" ]; then
            log_success "$file présent"
        else
            log_warning "Fichier manquant : $file"
        fi
    done
}

# Fonction de finalisation
finalize_install() {
    echo
    echo -e "${GREEN}========================================"
    echo -e "INSTALLATION TERMINÉE AVEC SUCCÈS !"
    echo -e "========================================${NC}"
    echo
    echo -e "${WHITE}SiteForge est maintenant installé et prêt à utiliser !${NC}"
    echo
    echo -e "${CYAN}PROCHAINES ÉTAPES :${NC}"
    echo
    echo -e "${YELLOW}1. Pour DÉMARRER SiteForge :${NC}"
    echo -e "   ${WHITE}> npm run dev${NC}"
    echo
    echo -e "${YELLOW}2. Puis ouvrez votre navigateur sur :${NC}"
    echo -e "   ${WHITE}> http://localhost:3000${NC}"
    echo
    echo -e "${YELLOW}3. AIDE et DOCUMENTATION :${NC}"
    echo -e "   ${WHITE}> Consultez le dossier docs/${NC}"
    echo -e "   ${WHITE}> Manuel : docs/USER_MANUAL.md${NC}"
    echo -e "   ${WHITE}> Démarrage rapide : docs/QUICK_START_GUIDE.md${NC}"
    echo
    echo -e "${YELLOW}4. SUPPORT :${NC}"
    echo -e "   ${WHITE}> Email : support@siteforge.com${NC}"
    echo -e "   ${WHITE}> Documentation : https://docs.siteforge.com${NC}"
    echo
    echo -e "${CYAN}INFORMATIONS SYSTÈME :${NC}"
    echo -e "${WHITE}> Node.js : $(node --version)${NC}"
    echo -e "${WHITE}> npm : $(npm --version)${NC}"
    echo -e "${WHITE}> Répertoire : $(pwd)${NC}"
    echo -e "${WHITE}> Date installation : $(date)${NC}"
    echo
    echo -e "${GREEN}========================================"
    echo -e "Félicitations ! Bienvenue dans SiteForge !"
    echo -e "========================================${NC}"
    echo
    
    # Proposer de démarrer immédiatement
    echo -n "Voulez-vous démarrer SiteForge maintenant ? (o/N) "
    read -r START_NOW
    if [[ "$START_NOW" =~ ^[oO]$ ]]; then
        echo
        echo "Démarrage de SiteForge..."
        echo "Appuyez sur Ctrl+C pour arrêter le serveur"
        echo
        sleep 3
        npm run dev
    fi
    
    echo
    echo -e "${CYAN}Merci d'avoir choisi SiteForge !${NC}"
    echo -e "${CYAN}N'hésitez pas à nous contacter pour toute question.${NC}"
    echo
}

# ========================================
# SCRIPT PRINCIPAL
# ========================================

# Affichage du logo
show_logo

# Détection du système
detect_os

# Vérifications préliminaires
check_disk_space
check_internet

# Vérification de Node.js
log_info "Vérification de Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js trouvé : $NODE_VERSION"
    
    # Vérifier la version (au moins v16)
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
        log_warning "Version Node.js ancienne ($NODE_VERSION). Version 18+ recommandée."
        echo -n "Continuer avec cette version ? (o/N) "
        read -r CONTINUE_OLD_NODE
        if [[ ! "$CONTINUE_OLD_NODE" =~ ^[oO]$ ]]; then
            log_install "Mise à jour de Node.js..."
            install_nodejs || exit 1
        fi
    fi
else
    log_warning "Node.js non trouvé"
    install_nodejs || exit 1
fi

# Vérification de npm
log_info "Vérification de npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm trouvé : $NPM_VERSION"
else
    log_error "npm non trouvé ! Réinstallez Node.js."
    exit 1
fi

# Installation principale
main_install

# Finalisation
finalize_install

exit 0