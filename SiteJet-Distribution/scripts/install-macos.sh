#!/bin/bash

echo "================================"
echo "Installation de SiteJet macOS"
echo "================================"

# Vérification de Homebrew
if ! command -v brew &> /dev/null; then
    echo "Homebrew n'est pas installé !"
    echo "Installation de Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "Installation de Node.js..."
    brew install node
else
    echo "Node.js trouvé : $(node --version)"
fi

echo "Installation des dépendances..."
cd app
npm install

echo "Configuration de la base de données..."
cp ../config/.env.example .env
npm run db:push

echo
echo "================================"
echo "Installation terminée !"
echo "================================"
echo
echo "Pour démarrer SiteJet :"
echo "1. cd app/"
echo "2. npm run dev"
echo "3. Ouvrir http://localhost:3000"
echo
