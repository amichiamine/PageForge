# 🌐 Guide de Déploiement et Hébergement SiteJet

## Manuel Complet pour Déployer SiteJet sur Différents Hébergeurs

Ce guide détaille toutes les méthodes de déploiement de SiteJet, depuis l'hébergement partagé jusqu'aux serveurs cloud.

---

## 🎯 Options de Déploiement

### 1. **Hébergement Partagé** (cPanel, Plesk)
- ✅ Facilité d'utilisation
- ✅ Coût réduit
- ❌ Limitations de performance
- ❌ Pas de contrôle serveur

### 2. **VPS/Serveur Dédié**
- ✅ Contrôle total
- ✅ Performances élevées
- ❌ Configuration technique requise
- ❌ Coût plus élevé

### 3. **Services Cloud** (Vercel, Netlify, Heroku)
- ✅ Déploiement automatique
- ✅ Scalabilité
- ❌ Coûts variables
- ❌ Dépendance au service

---

## 🔧 MÉTHODE 1 : Hébergement Partagé (cPanel)

### Prérequis
- Compte d'hébergement avec cPanel
- Support Node.js (vérifiez auprès de votre hébergeur)
- Base de données MySQL/PostgreSQL

### Étape 1 : Préparation des Fichiers
1. **Sur votre ordinateur**, dans le dossier SiteJet :
   ```bash
   # Build pour production
   npm run build
   
   # Création d'une archive
   zip -r sitejet-production.zip dist/ package.json server/ shared/
   ```

### Étape 2 : Configuration cPanel
1. **Connexion à cPanel** :
   - Ouvrez https://votre-domaine.com:2083
   - Connectez-vous avec vos identifiants

2. **Création de la base de données** :
   - Cliquez sur "MySQL Databases"
   - Créez une base : `sitejet_db`
   - Créez un utilisateur : `sitejet_user`
   - Associez l'utilisateur à la base avec tous les privilèges

3. **Configuration Node.js** (si supporté) :
   - Cherchez "Node.js" dans cPanel
   - Créez une nouvelle application :
     - Version : 18.x ou plus récente
     - Dossier : `public_html/sitejet`
     - Fichier de démarrage : `server/index.js`

### Étape 3 : Upload des Fichiers
1. **File Manager** :
   - Ouvrez "File Manager" dans cPanel
   - Naviguez vers `public_html/sitejet/`
   - Uploadez `sitejet-production.zip`
   - Extrayez l'archive (clic droit → Extract)

2. **Configuration des variables d'environnement** :
   - Créez un fichier `.env` :
   ```
   DATABASE_URL=mysql://sitejet_user:motdepasse@localhost:3306/sitejet_db
   NODE_ENV=production
   PORT=3000
   ```

### Étape 4 : Installation et Démarrage
1. **Terminal cPanel** (si disponible) :
   ```bash
   cd public_html/sitejet
   npm install
   npm run db:push
   npm start
   ```

2. **Alternative sans Node.js** - Export statique :
   ```bash
   # Sur votre machine locale
   npm run export:static
   ```
   Uploadez seulement les fichiers statiques générés.

---

## 🖥 MÉTHODE 2 : VPS Ubuntu/Debian

### Prérequis
- Serveur Ubuntu 20.04+ ou Debian 11+
- Accès root ou sudo
- Nom de domaine pointant vers le serveur

### Étape 1 : Préparation du Serveur
```bash
# Connexion SSH
ssh root@votre-ip-serveur

# Mise à jour du système
apt update && apt upgrade -y

# Installation des dépendances
apt install curl git nginx postgresql postgresql-contrib -y
```

### Étape 2 : Installation Node.js
```bash
# Installation Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install nodejs -y

# Vérification
node --version
npm --version
```

### Étape 3 : Configuration Base de Données
```bash
# Configuration PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE sitejet_production;"
sudo -u postgres psql -c "CREATE USER sitejet_app WITH PASSWORD 'mot_de_passe_fort';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sitejet_production TO sitejet_app;"
sudo -u postgres psql -c "ALTER USER sitejet_app CREATEDB;"
```

### Étape 4 : Déploiement de l'Application
```bash
# Création du dossier applicatif
mkdir -p /var/www/sitejet
cd /var/www/sitejet

# Clonage du projet (ou upload)
git clone https://github.com/votre-nom/sitejet-editor.git .

# Installation des dépendances
npm install

# Configuration environnement
cat > .env << EOF
DATABASE_URL=postgresql://sitejet_app:mot_de_passe_fort@localhost:5432/sitejet_production
NODE_ENV=production
PORT=3000
EOF

# Build de production
npm run build

# Initialisation base de données
npm run db:push
```

### Étape 5 : Configuration PM2
```bash
# Installation PM2
npm install -g pm2

# Configuration PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sitejet',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Démarrage avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Étape 6 : Configuration Nginx
```bash
# Configuration Nginx
cat > /etc/nginx/sites-available/sitejet << EOF
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Activation du site
ln -s /etc/nginx/sites-available/sitejet /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Étape 7 : SSL avec Let's Encrypt
```bash
# Installation Certbot
apt install certbot python3-certbot-nginx -y

# Obtention du certificat
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Test du renouvellement automatique
certbot renew --dry-run
```

---

## ☁️ MÉTHODE 3 : Déploiement Cloud (Vercel)

### Étape 1 : Préparation du Projet
1. **Configuration pour Vercel** :
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/**/*",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/$1"
       }
     ]
   }
   ```

### Étape 2 : Configuration de la Base de Données
1. **Création d'une base PostgreSQL** (ex: sur Neon.tech) :
   - Créez un compte sur https://neon.tech
   - Créez une base de données
   - Notez l'URL de connexion

### Étape 3 : Déploiement
1. **Via l'interface Vercel** :
   - Connectez votre repository GitHub
   - Configurez les variables d'environnement :
     ```
     DATABASE_URL=postgresql://...
     NODE_ENV=production
     ```
   - Déployez automatiquement

2. **Via CLI Vercel** :
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

---

## 🐳 MÉTHODE 4 : Déploiement Docker

### Étape 1 : Création du Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Exposition du port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production

# Commande de démarrage
CMD ["npm", "start"]
```

### Étape 2 : Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://sitejet:password@db:5432/sitejet
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sitejet
      POSTGRES_USER: sitejet
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Étape 3 : Déploiement
```bash
# Build et démarrage
docker-compose up -d

# Vérification
docker-compose ps
docker-compose logs app
```

---

## 📊 MÉTHODE 5 : Hébergement FTP Traditionnel

### Pour Hébergeurs sans Support Node.js

### Étape 1 : Export Statique
```bash
# Sur votre machine locale
npm run build:static

# Génération des fichiers statiques
npm run export:html
```

### Étape 2 : Structure des Fichiers
```
public_html/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   └── images/
└── pages/
    ├── about.html
    └── contact.html
```

### Étape 3 : Upload via FTP
1. **Client FTP** (FileZilla, WinSCP) :
   - Serveur : ftp.votre-hébergeur.com
   - Utilisateur : votre-username
   - Mot de passe : votre-password

2. **Upload des fichiers** :
   - Glissez-déposez tous les fichiers
   - Respectez l'arborescence

---

## 🔧 Configuration Avancée

### Optimisation des Performances
```nginx
# Configuration Nginx optimisée
server {
    # ... configuration de base ...
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    
    # Cache des assets statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Monitoring et Logs
```bash
# Logs PM2
pm2 logs sitejet

# Monitoring PM2
pm2 monit

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Sauvegarde Automatique
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/sitejet"

# Sauvegarde base de données
pg_dump sitejet_production > "$BACKUP_DIR/db_$DATE.sql"

# Sauvegarde fichiers
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" /var/www/sitejet

# Nettoyage (garder 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

---

## 🆘 Résolution de Problèmes

### Problèmes Courants

#### Erreur de Port
```bash
# Vérifier quel processus utilise le port
lsof -i :3000
netstat -tulpn | grep 3000

# Changer le port dans .env
PORT=8000
```

#### Problème de Base de Données
```bash
# Test de connexion
psql -h localhost -U sitejet_app -d sitejet_production

# Réinitialisation
npm run db:reset
npm run db:push
```

#### Erreurs de Permissions
```bash
# Correction des permissions
chown -R www-data:www-data /var/www/sitejet
chmod -R 755 /var/www/sitejet
```

### Monitoring de Production
```bash
# Status des services
systemctl status nginx
systemctl status postgresql
pm2 status

# Utilisation ressources
htop
df -h
free -h
```

Ce guide couvre toutes les méthodes principales pour déployer SiteJet en production. Choisissez la méthode qui correspond le mieux à vos besoins et compétences techniques.