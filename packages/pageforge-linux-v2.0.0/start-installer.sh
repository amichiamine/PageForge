#!/bin/bash
echo "PageForge - Démarrage Linux"
echo "============================="

# Vérifier PHP
if ! command -v php &> /dev/null; then
    echo "ERREUR: PHP non trouvé"
    echo "Installez PHP: sudo apt install php (Ubuntu/Debian)"
    exit 1
fi

# Démarrer l'installateur
echo "Démarrage de l'installateur..."
echo "Ouvrez votre navigateur sur: http://localhost:8000/install.php"
php -S localhost:8000
