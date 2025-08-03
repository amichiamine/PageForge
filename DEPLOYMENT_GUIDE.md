# 🚀 GUIDE DE DÉPLOIEMENT PAGEFORGE

## Déploiement VS Code

### Prérequis
- Node.js 18+ installé
- PostgreSQL ou base de données compatible

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd pageforge

# Installer les dépendances
npm install

# Configuration base de données
cp .env.example .env
# Éditer .env avec vos paramètres DB

# Migration base de données
npm run db:push

# Lancement développement
npm run dev
```

## Déploiement cPanel/Hébergement Web

### Structure Production
```
public_html/
├── pageforge/
│   ├── dist/           # Frontend build
│   ├── server/         # Backend compilé
│   ├── package.json
│   └── .env
```

### Étapes de Déploiement

1. **Build Production**
   ```bash
   npm run build
   ```

2. **Upload via cPanel**
   - Uploader le dossier `dist/` vers `public_html/pageforge/`
   - Uploader `server/` compilé
   - Configurer variables d'environnement

3. **Configuration Base de Données**
   - Créer base PostgreSQL via cPanel
   - Configurer CONNECTION_STRING dans .env
   - Exécuter migrations

4. **Configuration Apache (.htaccess)**
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

### Variables d'Environnement
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
PORT=5000
```

## Optimisations Appliquées
- Suppression fichiers de développement
- Nettoyage console.log
- Optimisation build production
- Configuration hébergement externe