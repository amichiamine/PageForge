# 🐧 Guide d'Installation SiteForge - Linux

## Guide Complet pour Débutants - Version Linux (Ubuntu/Debian)

Ce guide vous explique pas à pas comment exporter, télécharger, modifier et installer SiteForge sur Linux.

---

## 📥 ÉTAPE 1 : Exportation depuis Replit vers GitHub

### 1.1 Connexion à votre projet Replit
1. Ouvrez votre navigateur web (Firefox, Chrome, Chromium)
2. Allez sur https://replit.com
3. Connectez-vous à votre compte
4. Cliquez sur votre projet SiteForge pour l'ouvrir

### 1.2 Exportation vers GitHub
1. Dans l'interface Replit, regardez dans la barre latérale gauche
2. Cliquez sur l'icône "Version Control" (ressemble à une branche d'arbre)
3. Cliquez sur "Connect to GitHub"
4. Si vous n'avez pas de compte GitHub :
   - Allez sur https://github.com
   - Cliquez "Sign up" et créez votre compte
   - Revenez à Replit
5. Autorisez la connexion entre Replit et GitHub
6. Donnez un nom à votre repository GitHub (ex: "siteforge-editor")
7. Cliquez "Create Repository"
8. Attendez la synchronisation (quelques minutes)

---

## 💾 ÉTAPE 2 : Téléchargement via Git (Méthode Recommandée)

### 2.1 Installation de Git
1. Ouvrez le terminal :
   - Appuyez sur Ctrl + Alt + T
   - OU cherchez "Terminal" dans le menu Applications
2. Mettez à jour votre système :
   ```bash
   sudo apt update
   ```
3. Installez Git :
   ```bash
   sudo apt install git -y
   ```
4. Vérifiez l'installation :
   ```bash
   git --version
   ```

### 2.2 Clonage du repository
1. Naviguez vers votre dossier de projets :
   ```bash
   cd ~/
   mkdir Projets
   cd Projets
   ```
2. Clonez votre repository (remplacez "votre-nom" par votre nom d'utilisateur GitHub) :
   ```bash
   git clone https://github.com/votre-nom/siteforge-editor.git
   ```
3. Entrez dans le dossier :
   ```bash
   cd siteforge-editor
   ```

### 2.3 Alternative : Téléchargement ZIP
Si vous préférez télécharger le ZIP :
1. Sur GitHub, cliquez "Code" → "Download ZIP"
2. Ouvrez le gestionnaire de fichiers
3. Naviguez vers ~/Téléchargements
4. Clic droit sur le ZIP → "Extraire ici"
5. Déplacez le dossier vers ~/Projets/

---

## 🔧 ÉTAPE 3 : Installation de Node.js et VS Code

### 3.1 Installation de Node.js via NodeSource
1. Dans le terminal, installez curl :
   ```bash
   sudo apt install curl -y
   ```
2. Ajoutez le repository NodeSource :
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   ```
3. Installez Node.js :
   ```bash
   sudo apt install nodejs -y
   ```
4. Vérifiez l'installation :
   ```bash
   node --version
   npm --version
   ```

### 3.2 Installation de Visual Studio Code
#### Méthode 1 : Via Snap (Recommandée)
```bash
sudo snap install code --classic
```

#### Méthode 2 : Via Package .deb
1. Téléchargez le package depuis https://code.visualstudio.com
2. Installez avec :
   ```bash
   sudo dpkg -i ~/Téléchargements/code_*.deb
   sudo apt-get install -f
   ```

### 3.3 Vérification des installations
1. Lancez VS Code :
   ```bash
   code
   ```
2. VS Code devrait s'ouvrir correctement

---

## 📂 ÉTAPE 4 : Ouverture du Projet dans VS Code

### 4.1 Ouverture depuis le terminal
1. Naviguez vers votre projet :
   ```bash
   cd ~/Projets/siteforge-editor
   ```
2. Ouvrez VS Code dans ce dossier :
   ```bash
   code .
   ```

### 4.2 Installation des dépendances
1. Dans VS Code, ouvrez le terminal intégré :
   - Menu "Terminal" → "New Terminal"
   - OU raccourci : Ctrl + `
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Attendez la fin de l'installation (5-10 minutes)

### 4.3 Configuration de la base de données
1. Installez PostgreSQL :
   ```bash
   sudo apt install postgresql postgresql-contrib -y
   ```
2. Démarrez PostgreSQL :
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```
3. Créez une base de données :
   ```bash
   sudo -u postgres createdb siteforge_db
   sudo -u postgres createuser siteforge_user
   sudo -u postgres psql -c "ALTER USER siteforge_user WITH PASSWORD 'motdepasse123';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE siteforge_db TO siteforge_user;"
   ```

### 4.4 Configuration des variables d'environnement
1. Créez un fichier .env :
   ```bash
   cp .env.example .env
   ```
2. Éditez le fichier :
   ```bash
   nano .env
   ```
3. Ajoutez :
   ```
   DATABASE_URL=postgresql://siteforge_user:motdepasse123@localhost:5432/siteforge_db
   NODE_ENV=development
   ```
4. Sauvegardez : Ctrl + X, puis Y, puis Entrée

### 4.5 Initialisation de la base de données
```bash
npm run db:push
```

### 4.6 Lancement en développement
```bash
npm run dev
```

Ouvrez http://localhost:5000 dans votre navigateur !

---

## 🌐 ÉTAPE 5 : Installation sur Serveur Linux (VPS/Dédié)

### 5.1 Préparation du serveur
1. Connectez-vous à votre serveur via SSH :
   ```bash
   ssh utilisateur@adresse-ip-serveur
   ```
2. Mettez à jour le système :
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

### 5.2 Installation des dépendances serveur
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Nginx (serveur web)
sudo apt install nginx -y

# PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

### 5.3 Configuration de la base de données
```bash
sudo -u postgres createdb siteforge_production
sudo -u postgres createuser siteforge_app
sudo -u postgres psql -c "ALTER USER siteforge_app WITH PASSWORD 'mot_de_passe_fort';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE siteforge_production TO siteforge_app;"
```

### 5.4 Déploiement de l'application
1. Clonez votre projet :
   ```bash
   cd /var/www/
   sudo git clone https://github.com/votre-nom/siteforge-editor.git
   sudo chown -R www-data:www-data siteforge-editor
   cd siteforge-editor
   ```

2. Installez les dépendances :
   ```bash
   sudo -u www-data npm install
   ```

3. Configurez les variables d'environnement :
   ```bash
   sudo -u www-data nano .env
   ```
   Contenu :
   ```
   DATABASE_URL=postgresql://siteforge_app:mot_de_passe_fort@localhost:5432/siteforge_production
   NODE_ENV=production
   PORT=3000
   ```

4. Buildez l'application :
   ```bash
   sudo -u www-data npm run build
   ```

5. Initialisez la base de données :
   ```bash
   sudo -u www-data npm run db:push
   ```

### 5.5 Configuration de PM2
```bash
# Démarrez l'application avec PM2
sudo -u www-data pm2 start npm --name "siteforge" -- start

# Sauvegardez la configuration PM2
sudo -u www-data pm2 save

# Configurez PM2 pour démarrer au boot
sudo -u www-data pm2 startup
```

### 5.6 Configuration de Nginx
1. Créez un fichier de configuration :
   ```bash
   sudo nano /etc/nginx/sites-available/siteforge
   ```

2. Ajoutez la configuration :
   ```nginx
   server {
       listen 80;
       server_name votre-domaine.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Activez le site :
   ```bash
   sudo ln -s /etc/nginx/sites-available/siteforge /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 5.7 Configuration SSL avec Let's Encrypt
```bash
# Installez Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenez un certificat SSL
sudo certbot --nginx -d votre-domaine.com
```

---

## 📦 ÉTAPE 6 : Création d'un Package de Distribution Linux

### 6.1 Script de build automatique
1. Créez un script de build :
   ```bash
   nano build-release.sh
   ```

2. Contenu du script :
   ```bash
   #!/bin/bash
   echo "Building SiteForge Release Package..."
   
   # Nettoyage
   rm -rf release/
   mkdir -p release/
   
   # Build de production
   npm run build
   
   # Copie des fichiers nécessaires
   cp -r dist/ release/
   cp package.json release/
   cp package-lock.json release/
   cp -r docs/ release/
   cp README.md release/
   
   # Création de l'archive
   tar -czf SiteForge-v1.0-Linux.tar.gz release/
   
   echo "Package créé : SiteForge-v1.0-Linux.tar.gz"
   ```

3. Rendez le script exécutable :
   ```bash
   chmod +x build-release.sh
   ```

4. Exécutez le script :
   ```bash
   ./build-release.sh
   ```

### 6.2 Création d'un installateur automatique
1. Créez un script d'installation :
   ```bash
   nano release/install.sh
   ```

2. Contenu de l'installateur :
   ```bash
   #!/bin/bash
   echo "=== Installation de SiteForge ==="
   
   # Vérification des prérequis
   if ! command -v node &> /dev/null; then
       echo "Node.js n'est pas installé. Installation..."
       curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
       sudo apt install nodejs -y
   fi
   
   # Installation des dépendances
   echo "Installation des dépendances..."
   npm install
   
   # Configuration de la base de données
   echo "Configuration de la base de données..."
   npm run db:push
   
   echo "Installation terminée !"
   echo "Pour démarrer : npm run dev"
   ```

3. Rendez l'installateur exécutable :
   ```bash
   chmod +x release/install.sh
   ```

---

## 🆘 Résolution des Problèmes Courants Linux

### Problème : Permission denied
**Solution :**
```bash
sudo chown -R $USER:$USER ~/Projets/siteforge-editor
```

### Problème : Port 5000 occupé
**Solution :**
```bash
sudo lsof -i :5000
sudo kill -9 PID_du_processus
```

### Problème : PostgreSQL ne démarre pas
**Solution :**
```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
sudo journalctl -u postgresql
```

### Problème : npm ERR! permission denied
**Solution :**
```bash
# Configurer npm pour éviter sudo
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Problème : Nginx ne démarre pas
**Solution :**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx
```

---

## 📞 Support et Ressources Linux

### Commandes utiles
```bash
# Vérifier les logs
sudo journalctl -u nginx -f
pm2 logs siteforge

# Redémarrer les services
sudo systemctl restart nginx
pm2 restart siteforge

# Vérifier l'état du système
df -h  # Espace disque
free -h  # Mémoire
htop  # Processus
```

### Documentation supplémentaire
- Documentation Ubuntu : https://help.ubuntu.com
- Documentation Node.js : https://nodejs.org/docs
- Documentation Nginx : https://nginx.org/docs
- Documentation PM2 : https://pm2.keymetrics.io

Cette documentation vous guide à travers toutes les étapes nécessaires pour installer et déployer SiteForge sur Linux !