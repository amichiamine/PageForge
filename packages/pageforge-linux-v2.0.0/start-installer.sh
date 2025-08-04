#!/bin/bash

clear
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 PAGEFORGE v2.0.0                      ║"
echo "║               Installation Automatisée Linux                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

# Vérifier PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP non trouvé"
    echo
    echo "Installez PHP :"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install php php-sqlite3 php-curl php-zip"
    echo "  CentOS/RHEL:   sudo yum install php php-pdo php-json php-curl"
    echo "  macOS:         brew install php"
    echo
    exit 1
fi

echo "✅ PHP détecté"
echo

# Démarrer l'installateur web
echo "🌐 Démarrage de l'installateur web..."
echo
echo "Ouvrez votre navigateur sur : http://localhost:8000/install.php"
echo
echo "Pour arrêter l'installateur, utilisez Ctrl+C"
echo

php -S localhost:8000
