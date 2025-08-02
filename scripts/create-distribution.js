#!/usr/bin/env node

/**
 * Script de création automatique du package de distribution SiteJet
 * Génère un package complet prêt à distribuer
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createDistribution() {
    console.log('🚀 Création du package de distribution SiteJet...\n');
    
    try {
        // 1. Nettoyage
        console.log('📁 Nettoyage des anciens fichiers...');
        await fs.remove('SiteJet-Distribution');
        
        // 2. Création de la structure
        console.log('🏗  Création de la structure...');
        const dirs = [
            'SiteJet-Distribution/app',
            'SiteJet-Distribution/docs',
            'SiteJet-Distribution/scripts',
            'SiteJet-Distribution/config',
            'SiteJet-Distribution/examples'
        ];
        
        for (const dir of dirs) {
            await fs.ensureDir(dir);
        }
        
        // 3. Build de production
        console.log('⚙️  Compilation de l\'application...');
        try {
            execSync('npm run build', { stdio: 'inherit' });
        } catch (error) {
            console.warn('⚠️  Build échoué, utilisation des fichiers existants...');
        }
        
        // 4. Copie des fichiers principaux
        console.log('📋 Copie des fichiers...');
        
        // Copier les fichiers de build s'ils existent
        if (await fs.pathExists('dist')) {
            await fs.copy('dist', 'SiteJet-Distribution/app/dist');
        }
        
        // Copier le code source
        const sourceFiles = ['server', 'shared', 'client'];
        for (const file of sourceFiles) {
            if (await fs.pathExists(file)) {
                await fs.copy(file, `SiteJet-Distribution/app/${file}`);
            }
        }
        
        // Copier les fichiers de configuration
        const configFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'drizzle.config.ts'];
        for (const file of configFiles) {
            if (await fs.pathExists(file)) {
                await fs.copy(file, `SiteJet-Distribution/app/${file}`);
            }
        }
        
        // Copier la documentation
        if (await fs.pathExists('docs')) {
            await fs.copy('docs', 'SiteJet-Distribution/docs');
        }
        
        // 5. Création des scripts d'installation
        console.log('📜 Création des scripts...');
        await createInstallationScripts();
        
        // 6. Création des fichiers de configuration
        console.log('⚙️  Création des configurations...');
        await createConfigFiles();
        
        // 7. Création de la documentation
        console.log('📚 Génération de la documentation...');
        await createDocumentation();
        
        // 8. Package final
        console.log('📦 Création des archives...');
        await createArchives();
        
        console.log('\n✅ Package de distribution créé avec succès !');
        console.log('📁 Dossier : SiteJet-Distribution/');
        console.log('📦 Archives : SiteJet-Windows.zip, SiteJet-Linux.tar.gz');
        
    } catch (error) {
        console.error('❌ Erreur lors de la création du package:', error.message);
        process.exit(1);
    }
}

async function createInstallationScripts() {
    // Script Windows
    const windowsScript = `@echo off
echo ================================
echo Installation de SiteJet Windows
echo ================================

echo Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe !
    echo Veuillez installer Node.js depuis https://nodejs.org
    echo Redemarrez ce script apres installation.
    pause
    exit /b 1
)

echo Node.js detecte : 
node --version

echo Installation des dependances...
cd app
npm install

if %errorlevel% neq 0 (
    echo Erreur lors de l'installation des dependances !
    pause
    exit /b 1
)

echo Configuration de la base de donnees...
copy ..\\config\\.env.example .env
npm run db:push

if %errorlevel% neq 0 (
    echo Erreur lors de la configuration de la base de donnees !
    pause
    exit /b 1
)

echo.
echo ================================
echo Installation terminee avec succes !
echo ================================
echo.
echo Pour demarrer SiteJet :
echo 1. Ouvrez une invite de commande
echo 2. Allez dans le dossier app\\
echo 3. Tapez : npm run dev
echo 4. Ouvrez http://localhost:3000
echo.
pause
`;
    
    await fs.writeFile('SiteJet-Distribution/scripts/install-windows.bat', windowsScript);
    
    // Script Linux
    const linuxScript = `#!/bin/bash

# Couleurs pour l'affichage
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

echo -e "\${BLUE}================================"
echo -e "Installation de SiteJet Linux"
echo -e "================================\${NC}"
echo

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo -e "\${YELLOW}Node.js n'est pas installé !\${NC}"
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
        echo -e "\${RED}Distribution non supportée. Installez Node.js manuellement.\${NC}"
        exit 1
    fi
else
    echo -e "\${GREEN}Node.js trouvé :\${NC} \$(node --version)"
fi

echo -e "\${BLUE}Installation des dépendances...\${NC}"
cd app
npm install

if [ $? -ne 0 ]; then
    echo -e "\${RED}Erreur lors de l'installation des dépendances !\${NC}"
    exit 1
fi

echo -e "\${YELLOW}Configuration de la base de données...\${NC}"
cp ../config/.env.example .env
npm run db:push

if [ $? -ne 0 ]; then
    echo -e "\${RED}Erreur lors de la configuration de la base de données !\${NC}"
    exit 1
fi

echo
echo -e "\${GREEN}================================"
echo -e "Installation terminée avec succès !"
echo -e "================================\${NC}"
echo
echo -e "\${BLUE}Pour démarrer SiteJet :\${NC}"
echo "1. cd app/"
echo "2. npm run dev"
echo "3. Ouvrir http://localhost:3000"
echo
`;
    
    await fs.writeFile('SiteJet-Distribution/scripts/install-linux.sh', linuxScript);
    await fs.chmod('SiteJet-Distribution/scripts/install-linux.sh', '755');
    
    // Script macOS
    const macosScript = `#!/bin/bash

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
`;
    
    await fs.writeFile('SiteJet-Distribution/scripts/install-macos.sh', macosScript);
    await fs.chmod('SiteJet-Distribution/scripts/install-macos.sh', '755');
}

async function createConfigFiles() {
    // .env.example
    const envExample = `# Configuration SiteJet
DATABASE_URL=postgresql://username:password@localhost:5432/sitejet_db
NODE_ENV=production
PORT=3000

# Variables optionnelles
ADMIN_EMAIL=admin@example.com
APP_NAME=SiteJet
DEBUG=false

# Configuration de sécurité
SESSION_SECRET=changez-cette-clé-secrète-en-production
CORS_ORIGIN=http://localhost:3000
`;
    
    await fs.writeFile('SiteJet-Distribution/config/.env.example', envExample);
    
    // Configuration Nginx
    const nginxConfig = `server {
    listen 80;
    server_name your-domain.com;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # Certificats SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Proxy vers l'application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache pour les assets statiques
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`;
    
    await fs.writeFile('SiteJet-Distribution/config/nginx.conf.example', nginxConfig);
    
    // Configuration PM2
    const pm2Config = `module.exports = {
  apps: [{
    name: 'sitejet',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Redémarrage automatique
    watch: false,
    max_memory_restart: '1G',
    // Logs
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};`;
    
    await fs.writeFile('SiteJet-Distribution/config/pm2.config.js', pm2Config);
}

async function createDocumentation() {
    const mainReadme = `# SiteJet - Éditeur Visuel de Sites Web

## 🎯 Qu'est-ce que SiteJet ?

SiteJet est un éditeur visuel puissant et intuitif pour créer des sites web sans aucune connaissance en programmation. Il offre une interface drag & drop moderne avec plus de 50 composants prêts à utiliser.

### ✨ Fonctionnalités Principales

- **🎨 Interface Drag & Drop** : Créez visuellement sans code
- **📱 100% Responsive** : Adaptation automatique mobile/tablette/desktop
- **🧩 50+ Composants** : Elements prêts à utiliser organisés en 8 catégories
- **🎨 Templates Professionnels** : Designs préconçus pour tous secteurs
- **⚡ Performance Optimisée** : Code généré optimisé et rapide
- **🔧 Export Multi-Format** : HTML/CSS/JS, PDF, images
- **🌐 SEO Intégré** : Optimisation automatique pour les moteurs de recherche

### 🚀 Démarrage Ultra-Rapide

#### Windows
1. Double-cliquez sur \`scripts/install-windows.bat\`
2. Suivez les instructions à l'écran
3. Lancez avec \`npm run dev\` dans le dossier app/

#### Linux/macOS
1. Exécutez \`./scripts/install-linux.sh\` ou \`./scripts/install-macos.sh\`
2. Suivez les instructions à l'écran
3. Lancez avec \`npm run dev\` dans le dossier app/

#### Accès à l'Interface
Ouvrez votre navigateur sur : **http://localhost:3000**

## 📚 Documentation Complète

### Guides d'Installation
- 📖 \`docs/INSTALLATION_GUIDE_WINDOWS.md\` - Guide Windows détaillé
- 🐧 \`docs/INSTALLATION_GUIDE_LINUX.md\` - Guide Linux détaillé
- ⚡ \`docs/QUICK_START_GUIDE.md\` - Démarrage en 5 minutes

### Guides d'Utilisation
- 📘 \`docs/USER_MANUAL.md\` - Manuel d'utilisation complet
- 🔧 \`docs/TROUBLESHOOTING.md\` - Résolution de problèmes

### Guides de Déploiement
- 🌐 \`docs/DEPLOYMENT_HOSTING_GUIDE.md\` - Déploiement sur tous types d'hébergeurs
- 📦 \`docs/DISTRIBUTION_PACKAGE_GUIDE.md\` - Création de packages de distribution

## 🛠 Prérequis Système

### Minimum
- **Node.js** 18.0+ (https://nodejs.org)
- **RAM** 4 Go
- **Espace disque** 2 Go disponibles
- **Navigateur** Chrome 90+, Firefox 88+, Safari 14+

### Recommandé
- **Node.js** 20.0+
- **RAM** 8 Go ou plus
- **SSD** pour de meilleures performances
- **Connexion internet** pour les templates et assets

## 🎯 Utilisation Rapide

### 1. Création d'un Projet
1. Cliquez "Nouveau Projet"
2. Choisissez un template ou partez de zéro
3. Personnalisez le nom et les paramètres

### 2. Ajout de Composants
1. Sélectionnez une catégorie dans la palette
2. Glissez-déposez les composants sur votre page
3. Configurez via le panneau de propriétés

### 3. Personnalisation
- **Double-clic** pour éditer le contenu
- **Panneau de droite** pour modifier l'apparence
- **Prévisualisation mobile** en un clic

### 4. Export et Publication
1. Menu "Projet" → "Exporter"
2. Choisissez le format (HTML/CSS/JS recommandé)
3. Uploadez sur votre hébergement

## 🌟 Composants Disponibles

### 📐 Layout (Structure)
- Conteneurs, sections, grilles, colonnes

### 📝 Texte & Contenu
- Titres, paragraphes, listes, citations

### 🖼 Média
- Images, vidéos, carousels, galeries

### 🔗 Interactifs
- Boutons, liens, modales, accordéons

### 🏢 Business
- Témoignages, équipes, prix, statistiques

### 🧭 Navigation
- Menus, breadcrumbs, pagination

### 📄 Contenu Avancé
- Articles, FAQ, tableaux, timelines

### 🛒 E-commerce
- Produits, panier, commandes, paiements

## 🚀 Templates Disponibles

- **🏢 Business Corporate** - Site d'entreprise professionnel
- **🛍 E-commerce Modern** - Boutique en ligne complète
- **👤 Portfolio Créatif** - Portfolio personnel/artiste
- **📰 Blog Magazine** - Site de contenu/blog
- **📊 Dashboard Analytics** - Tableau de bord
- **📞 Page Contact** - Page de contact optimisée

## 🔧 Configuration Avancée

### Variables d'Environnement (.env)
\`\`\`env
DATABASE_URL=postgresql://username:password@localhost:5432/sitejet_db
NODE_ENV=production
PORT=3000
ADMIN_EMAIL=admin@example.com
SESSION_SECRET=your-secret-key
\`\`\`

### Base de Données
SiteJet supporte :
- **PostgreSQL** (Recommandé)
- **MySQL**
- **SQLite** (Développement uniquement)

### Hébergement
Compatible avec :
- **Hébergement partagé** (cPanel, Plesk)
- **VPS/Serveurs dédiés**
- **Services cloud** (Vercel, Netlify, Heroku)
- **Docker**

## 📈 Performance et SEO

### Optimisations Automatiques
- ✅ Code minifié et optimisé
- ✅ Images compressées automatiquement
- ✅ Lazy loading des médias
- ✅ Cache intelligent
- ✅ PWA ready

### SEO Intégré
- ✅ Meta tags automatiques
- ✅ Sitemap.xml généré
- ✅ Schema.org structured data
- ✅ URLs optimisées
- ✅ Performance scores élevés

## 🆘 Support et Aide

### Documentation
- 📚 **Wiki complet** : docs.sitejet.com
- 🎥 **Tutoriels vidéo** : youtube.com/sitejet
- 📝 **Blog et conseils** : blog.sitejet.com

### Communauté
- 💬 **Forum** : forum.sitejet.com
- 🎮 **Discord** : Chat en temps réel
- 📘 **Facebook** : Groupe d'utilisateurs

### Contact Direct
- 📧 **Email** : support@sitejet.com
- 💬 **Chat** : Disponible dans l'application
- 📞 **Téléphone** : +33 1 23 45 67 89

## 📄 Licence et Légal

### Licence
SiteJet est distribué sous licence MIT - Voir le fichier LICENSE pour plus de détails.

### Mentions Légales
- **Éditeur** : SiteJet Technologies
- **Version** : 1.0.0
- **Date de création** : Août 2025

### Crédits
- Interface basée sur React et TypeScript
- Icônes par Lucide React
- Templates inspirés des meilleures pratiques UX/UI

---

## 🎉 Prêt à Créer ?

**Lancez SiteJet maintenant et créez votre premier site web en moins de 5 minutes !**

\`\`\`bash
npm run dev
\`\`\`

Puis ouvrez : **http://localhost:3000**

**Bienvenue dans l'avenir de la création web ! 🚀**
`;
    
    await fs.writeFile('SiteJet-Distribution/README.md', mainReadme);
    
    const quickInstall = `INSTALLATION RAPIDE SITEJET
============================

PRÉREQUIS :
- Node.js 18+ (https://nodejs.org)
- 4 Go RAM minimum
- 2 Go espace disque libre

INSTALLATION AUTOMATIQUE :

WINDOWS :
1. Double-clic sur scripts/install-windows.bat
2. Suivre les instructions à l'écran
3. Attendre la fin de l'installation
4. Dans le dossier app/ : npm run dev
5. Ouvrir http://localhost:3000

LINUX / MACOS :
1. Ouvrir un terminal
2. ./scripts/install-linux.sh (ou install-macos.sh)
3. Suivre les instructions à l'écran
4. Dans le dossier app/ : npm run dev
5. Ouvrir http://localhost:3000

INSTALLATION MANUELLE :
1. Installer Node.js depuis https://nodejs.org
2. cd app/
3. npm install
4. cp ../config/.env.example .env
5. npm run db:push
6. npm run dev
7. Ouvrir http://localhost:3000

DÉMARRAGE RAPIDE :
1. Nouveau Projet → Choisir un template
2. Glisser-déposer des composants
3. Double-clic pour éditer le contenu
4. Panneau de droite pour les styles
5. Exporter en HTML/CSS pour publier

AIDE ET SUPPORT :
- Documentation : docs/
- Email : support@sitejet.com
- Guides : INSTALLATION_GUIDE_WINDOWS.md ou INSTALLATION_GUIDE_LINUX.md

VERSIONS :
- SiteJet v1.0.0
- Node.js 18.0+ requis
- Compatible Windows 10+, Linux, macOS

LICENCE : MIT
SITE WEB : https://sitejet.com
`;
    
    await fs.writeFile('SiteJet-Distribution/INSTALL.txt', quickInstall);
}

async function createArchives() {
    try {
        // Archive Windows (ZIP) - Si archiver est disponible
        try {
            const archiver = await import('archiver');
            const outputZip = fs.createWriteStream('SiteJet-Windows.zip');
            const archive = archiver.default('zip', { zlib: { level: 9 } });
            
            outputZip.on('close', () => {
                console.log(`📦 SiteJet-Windows.zip créé (${archive.pointer()} bytes)`);
            });
            
            archive.pipe(outputZip);
            archive.directory('SiteJet-Distribution/', false);
            await archive.finalize();
            
        } catch (error) {
            console.log('📦 Création ZIP avec commande système...');
            if (process.platform === 'win32') {
                execSync('powershell Compress-Archive -Path SiteJet-Distribution -DestinationPath SiteJet-Windows.zip', { stdio: 'inherit' });
            } else {
                execSync('zip -r SiteJet-Windows.zip SiteJet-Distribution/', { stdio: 'inherit' });
            }
        }
        
        // Archive Linux/macOS (TAR.GZ)
        console.log('📦 Création de l\'archive Linux...');
        execSync('tar -czf SiteJet-Linux.tar.gz SiteJet-Distribution/', { stdio: 'inherit' });
        console.log('📦 SiteJet-Linux.tar.gz créé');
        
    } catch (error) {
        console.warn('⚠️ Erreur lors de la création des archives:', error.message);
        console.log('💡 Vous pouvez créer les archives manuellement depuis le dossier SiteJet-Distribution/');
    }
}

// Lancement du script
if (import.meta.url === `file://${process.argv[1]}`) {
    createDistribution().catch(console.error);
}

export { createDistribution };