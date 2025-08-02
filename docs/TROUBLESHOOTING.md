# 🔧 Guide de Dépannage SiteJet

## Résolution des Problèmes Courants

Ce guide vous aide à résoudre les problèmes les plus fréquents rencontrés avec SiteJet.

---

## 🚨 Problèmes d'Installation

### ❌ "Node.js n'est pas reconnu"

**Symptômes :**
- Message "node n'est pas reconnu en tant que commande"
- Impossible de lancer `npm install`

**Solutions :**

#### Windows
1. **Redémarrer l'ordinateur** après installation de Node.js
2. **Réinstaller Node.js** en tant qu'administrateur :
   - Téléchargez depuis https://nodejs.org
   - Clic droit sur l'installateur → "Exécuter en tant qu'administrateur"
   - ✅ Cochez "Add to PATH" lors de l'installation
3. **Vérifier les variables d'environnement** :
   - Windows + R → `sysdm.cpl` → Avancé → Variables d'environnement
   - Vérifiez que le PATH contient : `C:\Program Files\nodejs\`

#### Linux
```bash
# Vérifier l'installation
which node
which npm

# Réinstaller si nécessaire
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### ❌ Erreur "Permission denied"

**Symptômes :**
- `npm install` échoue avec des erreurs de permissions
- Impossible de créer des fichiers

**Solutions :**

#### Windows
1. **Lancer en tant qu'administrateur** :
   - Clic droit sur CMD ou PowerShell → "Exécuter en tant qu'administrateur"
2. **Changer le dossier npm global** :
   ```cmd
   npm config set prefix %APPDATA%\npm
   ```

#### Linux/macOS
```bash
# Corriger les permissions npm
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Alternative : utiliser nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### ❌ "npm ERR! network timeout"

**Symptômes :**
- Installation qui traine ou échoue
- Messages de timeout réseau

**Solutions :**
```bash
# Changer le registry npm
npm config set registry https://registry.npmjs.org/

# Augmenter le timeout
npm config set timeout 60000

# Vider le cache
npm cache clean --force

# Réessayer l'installation
npm install
```

---

## 🌐 Problèmes de Serveur

### ❌ "Port 3000 already in use"

**Symptômes :**
- Erreur `EADDRINUSE: address already in use :::3000`
- Impossible de démarrer SiteJet

**Solutions :**

#### Windows
```cmd
# Voir qui utilise le port
netstat -ano | findstr :3000

# Tuer le processus (remplacez PID par le numéro trouvé)
taskkill /PID 1234 /F

# OU changer le port dans .env
echo PORT=8000 >> .env
```

#### Linux/macOS
```bash
# Voir qui utilise le port
lsof -i :3000

# Tuer le processus
sudo kill -9 PID

# OU changer le port
echo "PORT=8000" >> .env
```

### ❌ "Cannot GET /"

**Symptômes :**
- Page blanche ou erreur 404
- Le serveur démarre mais rien ne s'affiche

**Solutions :**
1. **Vérifier l'URL** : http://localhost:3000 (pas https)
2. **Vider le cache du navigateur** : Ctrl+F5
3. **Vérifier les logs** dans la console où tourne `npm run dev`
4. **Redémarrer le serveur** :
   ```bash
   # Arrêter (Ctrl+C) puis relancer
   npm run dev
   ```

### ❌ "Database connection failed"

**Symptômes :**
- Erreurs de base de données dans les logs
- Fonctionnalités limitées

**Solutions :**
1. **Vérifier le fichier .env** :
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database
   ```
2. **Réinitialiser la base de données** :
   ```bash
   npm run db:push
   ```
3. **PostgreSQL non démarré** (Linux) :
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

---

## 🎨 Problèmes d'Interface

### ❌ Composants ne s'affichent pas

**Symptômes :**
- Composants invisibles ou mal positionnés
- Interface cassée

**Solutions :**
1. **Vider le cache du navigateur** :
   - Chrome : Ctrl+Shift+Delete
   - Firefox : Ctrl+Shift+Delete
   - Safari : Développement → Vider les caches
2. **Mode navigation privée** pour tester
3. **Redémarrer le serveur** et rafraîchir la page
4. **Vérifier la console navigateur** (F12) pour les erreurs JavaScript

### ❌ Glisser-déposer ne fonctionne pas

**Symptômes :**
- Impossible de déplacer les composants
- Drag & drop non réactif

**Solutions :**
1. **Navigateur compatible** :
   - ✅ Chrome 90+
   - ✅ Firefox 88+
   - ✅ Safari 14+
   - ❌ Internet Explorer (non supporté)
2. **Désactiver les extensions** du navigateur temporairement
3. **Vérifier JavaScript** : F12 → Console → Rechercher les erreurs

### ❌ "Échec de la sauvegarde"

**Symptômes :**
- Message d'erreur lors de la sauvegarde
- Travail non sauvegardé

**Solutions :**
1. **Vérifier l'espace disque** disponible
2. **Permissions de fichier** :
   ```bash
   # Linux/macOS
   chmod 755 -R .
   
   # Windows : Propriétés → Sécurité → Modifier
   ```
3. **Sauvegarde manuelle** : Ctrl+S
4. **Exporter le projet** en cas d'urgence

---

## 📱 Problèmes Mobile/Responsive

### ❌ Site non responsive

**Symptômes :**
- Affichage incorrect sur mobile
- Éléments qui dépassent

**Solutions :**
1. **Utiliser l'aperçu mobile** dans SiteJet
2. **Vérifier les composants** : certains ont des tailles fixes
3. **Tester sur différents appareils** :
   - F12 → Mode responsive
   - Tester sur vrais appareils

### ❌ Boutons trop petits sur mobile

**Solutions :**
- **Taille minimum** : 44px sur mobile
- **Espacement** suffisant entre les éléments
- **Zone de touch** adaptée au doigt

---

## 🚀 Problèmes de Performance

### ❌ SiteJet lent ou qui lag

**Symptômes :**
- Interface qui rame
- Réponse lente des actions

**Solutions :**
1. **Fermer les autres applications** gourmandes
2. **Redémarrer le navigateur**
3. **Vérifier la RAM** disponible (minimum 4 Go)
4. **Désactiver les extensions** du navigateur
5. **Mode développement** plus lent que production

### ❌ Export qui prend trop de temps

**Solutions :**
1. **Réduire la taille des images** avant import
2. **Limiter le nombre de composants** par page
3. **Exporter par parties** si le projet est très gros

---

## 🌐 Problèmes de Déploiement

### ❌ "502 Bad Gateway" après déploiement

**Symptômes :**
- Site inaccessible après upload
- Erreur serveur 502

**Solutions :**
1. **Vérifier Node.js** sur l'hébergement :
   - Version compatible (18+)
   - Service démarré
2. **Logs du serveur** :
   ```bash
   pm2 logs
   # ou
   tail -f /var/log/nginx/error.log
   ```
3. **Port correct** dans la configuration Nginx
4. **Redémarrer les services** :
   ```bash
   sudo systemctl restart nginx
   pm2 restart all
   ```

### ❌ Base de données inaccessible en production

**Solutions :**
1. **Vérifier DATABASE_URL** en production
2. **Firewall** : autoriser les connexions DB
3. **Utilisateur DB** : permissions correctes
4. **SSL requis** sur certains hébergeurs cloud

### ❌ Assets (CSS/JS) non chargés

**Solutions :**
1. **Chemins absolus** vs relatifs dans l'export
2. **HTTPS/HTTP mixte** : tout en HTTPS
3. **CDN** : vérifier la disponibilité
4. **Cache** : forcer le refresh avec version query

---

## 🔍 Outils de Diagnostic

### Vérification Système
```bash
# Versions installées
node --version
npm --version

# Espace disque
df -h

# Mémoire disponible
free -h

# Processus qui utilisent les ports
netstat -tulpn | grep :3000
```

### Logs Utiles
```bash
# Logs SiteJet
npm run dev 2>&1 | tee sitejet.log

# Logs système (Linux)
journalctl -u nginx -f
journalctl -u postgresql -f

# Logs navigateur
# F12 → Console → Rechercher les erreurs rouges
```

### Test de Connectivité
```bash
# Test de port local
curl http://localhost:3000

# Test base de données
psql $DATABASE_URL -c "SELECT 1;"
```

---

## 📞 Obtenir de l'Aide

### 🚀 Support Automatique
1. **F12** → Console du navigateur → Copier les erreurs
2. **Informations système** :
   - OS et version
   - Navigateur et version
   - Version Node.js
   - Message d'erreur exact

### 📧 Contacter le Support
**Email :** support@sitejet.com

**Format de message efficace :**
```
Objet : [URGENT] Problème d'installation SiteJet

Système :
- OS : Windows 11 / Ubuntu 22.04 / macOS 13
- Node.js : v20.10.0
- Navigateur : Chrome 120.0.0

Problème :
[Description détaillée du problème]

Erreur exacte :
[Copier-coller du message d'erreur]

Étapes pour reproduire :
1. [Action 1]
2. [Action 2] 
3. [Erreur survient]

Captures d'écran : [Si applicable]
```

### 🌐 Ressources Communautaires
- **Documentation** : docs/
- **Forum** : forum.sitejet.com
- **Discord** : discord.gg/sitejet
- **GitHub Issues** : github.com/sitejet/issues

### ⚡ Solutions Rapides
- **Redémarrer** : 80% des problèmes résolus
- **Vider le cache** : 60% des problèmes d'affichage
- **Mode navigation privée** : Test isolé
- **Mettre à jour** : Node.js, navigateur, SiteJet

---

**💡 Conseil :** Gardez ce guide à portée de main et n'hésitez pas à nous contacter pour toute question !