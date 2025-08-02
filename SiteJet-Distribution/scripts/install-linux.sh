#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================"
echo -e "Installation de SiteJet Linux"
echo -e "================================${NC}"
echo

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js n'est pas installé !${NC}"
    echo "Installation de Node.js..."
    
    # Détection de la distribution
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install nodejs -y
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL/Fedora
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install nodejs npm -y
    elif command -v brew &> /dev/null; then
        # macOS avec Homebrew
        brew install node
    else
        echo -e "${RED}Distribution non supportée. Installez Node.js manuellement.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Node.js trouvé :${NC} $(node --version)"
fi

echo -e "${BLUE}Installation des dépendances...${NC}"
cd app
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de l'installation des dépendances !${NC}"
    exit 1
fi

echo -e "${YELLOW}Configuration de la base de données...${NC}"
cp ../config/.env.example .env
npm run db:push

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la configuration de la base de données !${NC}"
    exit 1
fi

echo
echo -e "${GREEN}================================"
echo -e "Installation terminée avec succès !"
echo -e "================================${NC}"
echo
echo -e "${BLUE}Pour démarrer SiteJet :${NC}"
echo "1. cd app/"
echo "2. npm run dev"
echo "3. Ouvrir http://localhost:3000"
echo
