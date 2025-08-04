# 📘 Guide d'Installation PageForge - Débutants

Ce guide vous accompagne **étape par étape** pour installer PageForge sur votre hébergement ou votre ordinateur. Même sans connaissances techniques, vous pourrez suivre facilement.

## 🎯 Quelle Installation Choisir ?

### Pour Démarrer Rapidement
- **Hébergement cPanel** → [Installation cPanel](#installation-cpanel)
- **Mon ordinateur Windows** → [Installation Windows](#installation-windows)
- **Mon Mac ou Linux** → [Installation Linux/macOS](#installation-linuxmacos)

### Pour les Développeurs
- **Personnaliser PageForge** → [Installation Développement](#installation-développement)

---

## 🌐 Installation cPanel

**Idéal pour** : Sites web publics, hébergements OVH/Hostinger/1&1, etc.

### Prérequis
- Un hébergement web avec cPanel
- PHP 7.4 ou plus récent
- Une base de données MySQL ou PostgreSQL
- 200 MB d'espace disque libre

### Étape 1 : Télécharger PageForge

1. **Allez** sur la page [Releases](https://github.com/votre-repo/pageforge/releases)
2. **Téléchargez** `pageforge-cpanel-v2.0.0.zip`
3. **Sauvegardez** le fichier sur votre ordinateur

### Étape 2 : Uploader sur Votre Hébergement

1. **Connectez-vous** à votre cPanel
2. **Ouvrez** "File Manager" (Gestionnaire de fichiers)
3. **Allez** dans le dossier `public_html` (ou votre dossier de site)
4. **Cliquez** sur "Upload" (Uploader)
5. **Sélectionnez** le fichier `pageforge-cpanel-v2.0.0.zip`
6. **Attendez** la fin de l'upload
7. **Cliquez droit** sur le fichier ZIP → "Extract" (Extraire)
8. **Supprimez** le fichier ZIP après extraction

### Étape 3 : Créer une Base de Données

1. **Retournez** au menu principal cPanel
2. **Cliquez** sur "MySQL Databases" (Bases de données MySQL)
3. **Créez** une nouvelle base de données :
   - **Nom** : `pageforge_db` (ou autre nom)
   - **Cliquez** "Create Database"
4. **Créez** un utilisateur :
   - **Nom d'utilisateur** : `pageforge_user`
   - **Mot de passe** : Choisissez un mot de passe fort
   - **Cliquez** "Create User"
5. **Associez** l'utilisateur à la base :
   - **Sélectionnez** votre utilisateur et votre base
   - **Cochez** "ALL PRIVILEGES"
   - **Cliquez** "Make Changes"

**Notez bien ces informations** pour l'étape suivante !

### Étape 4 : Lancer l'Installateur

1. **Ouvrez** votre navigateur
2. **Allez** sur : `https://votre-domaine.com/install-cpanel.php`
3. **Suivez** l'assistant automatique :

#### Écran 1 : Bienvenue
- **Lisez** les informations
- **Cliquez** "Commencer l'installation"

#### Écran 2 : Vérification des Prérequis
- L'assistant **vérifie automatiquement** votre serveur
- Si tout est vert ✅, **cliquez** "Continuer"
- Si du rouge ❌, contactez votre hébergeur

#### Écran 3 : Configuration Node.js (Optionnel)
- Si vous avez **Node.js Selector** dans cPanel :
  1. **Ouvrez** un nouvel onglet → cPanel → Node.js Selector
  2. **Cliquez** "Create Application"
  3. **Sélectionnez** Node.js 16 ou plus
  4. **Définissez** le dossier racine de votre site
  5. **Laissez** "Application startup file" vide pour l'instant
  6. **Revenez** à l'installateur et **cliquez** "Continuer"
- Si pas de Node.js Selector, **cliquez** directement "Continuer"

#### Écran 4 : Configuration Base de Données
- **Entrez** les informations notées à l'étape 3 :
  - **Type** : MySQL
  - **Host** : localhost (généralement)
  - **Port** : 3306 (généralement)
  - **Nom de base** : `pageforge_db`
  - **Utilisateur** : `pageforge_user`
  - **Mot de passe** : Votre mot de passe
- **Cliquez** "Tester la connexion"
- Si ✅ succès, **cliquez** "Continuer"

#### Écran 5 : Installation des Fichiers
- **Cliquez** "Extraire et installer les fichiers"
- **Attendez** la fin (quelques minutes)
- **Cliquez** "Continuer" quand terminé

#### Écran 6 : Configuration Finale
- L'assistant **configure automatiquement** PageForge
- **Cliquez** "Finaliser l'installation"

#### Écran 7 : Installation Terminée
- **Félicitations !** PageForge est installé
- **Cliquez** "Supprimer l'installateur" pour sécuriser
- **Cliquez** "Ouvrir PageForge" pour commencer

### Configuration Node.js Selector (Si Disponible)

1. **Retournez** dans cPanel → Node.js Selector
2. **Trouvez** votre application PageForge
3. **Éditez** l'application
4. **Définissez** "Application startup file" : `server/index.js`
5. **Cliquez** "Save" puis "Restart"
6. **Votre PageForge** est maintenant optimisé !

---

## 💻 Installation Windows

**Idéal pour** : Utilisation personnelle, tests, développement

### Prérequis
- Windows 10 ou 11
- 500 MB d'espace disque libre
- Connexion internet

### Étape 1 : Télécharger et Extraire

1. **Téléchargez** `pageforge-windows-v2.0.0.zip`
2. **Cliquez droit** sur le fichier → "Extraire tout..."
3. **Choisissez** un dossier (ex: `C:\PageForge`)
4. **Cliquez** "Extraire"

### Étape 2 : Installation Automatique

1. **Ouvrez** le dossier extrait
2. **Double-cliquez** sur `start-installer.bat`
3. **Windows** peut afficher un avertissement :
   - **Cliquez** "Plus d'infos"
   - **Cliquez** "Exécuter quand même"
4. **Une fenêtre noire** s'ouvre (c'est normal !)
5. **Votre navigateur** s'ouvre automatiquement

### Étape 3 : Suivre l'Assistant Web

1. **L'assistant** s'ouvre sur `http://localhost:8000/install.php`
2. **Suivez** les écrans :
   - **Bienvenue** → Cliquez "Commencer"
   - **Prérequis** → Vérification automatique
   - **Environnement** → Détection PHP/Node.js
   - **Base de données** → Configuration SQLite automatique
   - **Installation** → Déploiement des fichiers
   - **Terminé** → PageForge est prêt !

### Étape 4 : Utiliser PageForge

- **PageForge** s'ouvre sur `http://localhost:3000`
- **Laissez** la fenêtre noire ouverte (serveur actif)
- **Fermez** la fenêtre noire pour arrêter PageForge

### Installation PHP (Si Nécessaire)

Si l'installateur dit "PHP non trouvé" :

#### Option A : XAMPP (Recommandé)
1. **Téléchargez** XAMPP : https://www.apachefriends.org/
2. **Installez** avec tous les composants
3. **Redémarrez** l'installateur PageForge

#### Option B : PHP Direct
1. **Téléchargez** PHP : https://windows.php.net/
2. **Choisissez** "Thread Safe" version
3. **Extrayez** dans `C:\php`
4. **Ajoutez** `C:\php` au PATH Windows :
   - **Windows + R** → `sysdm.cpl`
   - **Onglet** "Avancé" → "Variables d'environnement"
   - **Double-cliquez** "Path" dans Variables système
   - **Cliquez** "Nouveau" → Tapez `C:\php`
   - **OK** partout et redémarrez

---

## 🐧 Installation Linux/macOS

**Idéal pour** : Serveurs, développement, utilisation avancée

### Prérequis
- Linux (Ubuntu, Debian, CentOS) ou macOS 10.15+
- Terminal/console
- 500 MB d'espace disque libre

### Étape 1 : Installer PHP

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install php php-sqlite3 php-curl php-zip php-json
```

#### CentOS/RHEL
```bash
sudo yum install php php-pdo php-json php-curl php-zip
```

#### macOS
```bash
# Avec Homebrew
brew install php

# Vérifier l'installation
php --version
```

### Étape 2 : Télécharger et Extraire PageForge

```bash
# Créer un dossier pour PageForge
mkdir ~/pageforge
cd ~/pageforge

# Télécharger (remplacez l'URL par la vraie)
wget https://github.com/votre-repo/pageforge/releases/download/v2.0.0/pageforge-linux-v2.0.0.tar.gz

# Extraire
tar -xzf pageforge-linux-v2.0.0.tar.gz
cd pageforge-linux-v2.0.0
```

### Étape 3 : Lancer l'Installation

```bash
# Rendre le script exécutable
chmod +x start-installer.sh

# Lancer l'installateur
./start-installer.sh
```

### Étape 4 : Suivre l'Assistant

1. **Le terminal** affiche les informations de démarrage
2. **Votre navigateur** s'ouvre sur `http://localhost:8000/install.php`
3. **Suivez** l'assistant automatique
4. **PageForge** sera accessible sur `http://localhost:3000`

### Installation Node.js (Recommandé)

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### macOS
```bash
brew install node
```

---

## 🛠️ Installation Développement

**Pour** : Personnaliser PageForge, contribuer au projet

### Prérequis
- Git installé
- VS Code recommandé
- PHP 7.4+
- Node.js 16+

### Étape 1 : Cloner le Projet

```bash
# Cloner depuis GitHub
git clone https://github.com/votre-repo/pageforge.git
cd pageforge
```

### Étape 2 : Configuration Automatique

```bash
# Lancer le configurateur
php build-scripts/setup-dev.php
```

### Étape 3 : Installation VS Code

```bash
# Ouvrir dans VS Code
code .
```

L'environnement se configure automatiquement avec :
- Extensions recommandées
- Configuration de debug
- Snippets PageForge
- Formatage automatique

### Étape 4 : Démarrage Développement

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

PageForge sera accessible sur `http://localhost:3000` avec hot-reload.

---

## 🆘 Résolution de Problèmes

### Problèmes Courants

#### "PHP n'est pas reconnu" (Windows)
**Solution** :
1. Installez XAMPP ou PHP direct (voir [Installation PHP](#installation-php-si-nécessaire))
2. Redémarrez l'installateur

#### "Permission denied" (Linux/macOS)
**Solution** :
```bash
# Donner les permissions
chmod +x *.sh
sudo chown -R $USER:$USER .
```

#### "Port 8000 already in use"
**Solution** :
```bash
# Trouver le processus qui utilise le port
sudo netstat -tulpn | grep :8000

# Tuer le processus (remplacez PID par le numéro trouvé)
kill -9 PID

# Ou utiliser un autre port
php -S localhost:8080 install.php
```

#### "Database connection failed"
**Solution** :
1. Vérifiez vos paramètres de base de données
2. Assurez-vous que la base existe
3. Testez la connexion depuis cPanel
4. Contactez votre hébergeur si nécessaire

#### "Extensions PHP manquantes"
**Solution** :
```bash
# Ubuntu/Debian
sudo apt install php-sqlite3 php-curl php-zip php-gd php-json

# CentOS/RHEL
sudo yum install php-pdo php-curl php-zip php-json
```

### Obtenir de l'Aide

1. **Consultez** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Cherchez** dans les [Issues GitHub](../../issues)
3. **Créez** une nouvelle issue avec :
   - Votre système d'exploitation
   - Version PHP (`php --version`)
   - Messages d'erreur complets
   - Étapes pour reproduire le problème

---

## ✅ Vérification de l'Installation

Une fois PageForge installé, vérifiez que tout fonctionne :

### Tests Basiques
1. **Ouvrez** PageForge dans votre navigateur
2. **Créez** un nouveau projet
3. **Glissez** un composant sur la page
4. **Modifiez** son contenu
5. **Sauvegardez** le projet
6. **Exportez** en HTML

### Tests Avancés
1. **Testez** l'upload d'images
2. **Créez** un projet avec plusieurs pages
3. **Utilisez** différents composants
4. **Testez** le mode responsive
5. **Vérifiez** les exports

Si tout fonctionne, **félicitations !** PageForge est correctement installé.

---

**🎉 Prêt à créer des sites web magnifiques ? Consultez le [Manuel Utilisateur](USER_MANUAL.md) pour commencer !**