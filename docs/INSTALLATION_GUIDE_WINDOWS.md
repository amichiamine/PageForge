# 🪟 Guide d'Installation SiteJet - Windows

## Guide Complet pour Débutants - Version Windows

Ce guide vous explique pas à pas comment exporter, télécharger, modifier et installer SiteJet sur Windows.

---

## 📥 ÉTAPE 1 : Exportation depuis Replit vers GitHub

### 1.1 Connexion à votre projet Replit
1. Ouvrez votre navigateur web (Chrome, Firefox, Edge)
2. Allez sur https://replit.com
3. Connectez-vous à votre compte
4. Cliquez sur votre projet SiteJet pour l'ouvrir

### 1.2 Exportation vers GitHub
1. Dans l'interface Replit, regardez dans la barre latérale gauche
2. Cliquez sur l'icône "Version Control" (ressemble à une branche d'arbre)
3. Cliquez sur "Connect to GitHub"
4. Si vous n'avez pas de compte GitHub :
   - Allez sur https://github.com
   - Cliquez "Sign up" et créez votre compte
   - Revenez à Replit
5. Autorisez la connexion entre Replit et GitHub
6. Donnez un nom à votre repository GitHub (ex: "sitejet-editor")
7. Cliquez "Create Repository"
8. Attendez la synchronisation (quelques minutes)

---

## 💾 ÉTAPE 2 : Téléchargement en ZIP depuis GitHub

### 2.1 Accès au repository GitHub
1. Ouvrez votre navigateur
2. Allez sur https://github.com
3. Connectez-vous à votre compte
4. Dans la liste de vos repositories, cliquez sur "sitejet-editor"

### 2.2 Téléchargement du code
1. Sur la page du repository, cherchez le bouton vert "Code"
2. Cliquez sur "Code"
3. Dans le menu qui s'ouvre, cliquez "Download ZIP"
4. Le fichier se télécharge dans votre dossier "Téléchargements"
5. Attendez la fin du téléchargement

### 2.3 Extraction du fichier ZIP
1. Ouvrez l'Explorateur de fichiers Windows :
   - Cliquez sur l'icône dossier dans la barre des tâches
   - OU appuyez sur Windows + E
2. Naviguez vers le dossier "Téléchargements"
3. Trouvez le fichier "sitejet-editor-main.zip"
4. Clic droit sur le fichier ZIP
5. Sélectionnez "Extraire tout..."
6. Choisissez un dossier de destination (ex: C:\Projets\)
7. Cliquez "Extraire"
8. Un nouveau dossier "sitejet-editor-main" est créé

---

## 🔧 ÉTAPE 3 : Installation de VS Code et Node.js

### 3.1 Installation de Node.js
1. Ouvrez votre navigateur
2. Allez sur https://nodejs.org
3. Cliquez sur la version "LTS" (version recommandée)
4. Le fichier d'installation se télécharge
5. Double-cliquez sur le fichier téléchargé (node-vXX.X.X-x64.msi)
6. Suivez l'assistant d'installation :
   - Cliquez "Next" à chaque étape
   - Acceptez les termes de licence
   - Laissez le chemin d'installation par défaut
   - Cliquez "Install"
7. Attendez la fin de l'installation
8. Cliquez "Finish"

### 3.2 Vérification de l'installation Node.js
1. Appuyez sur Windows + R
2. Tapez "cmd" et appuyez sur Entrée
3. Dans la console noire qui s'ouvre, tapez :
   ```
   node --version
   ```
4. Appuyez sur Entrée
5. Vous devriez voir quelque chose comme "v20.x.x"
6. Tapez ensuite :
   ```
   npm --version
   ```
7. Vous devriez voir un numéro de version
8. Fermez la console en tapant "exit" puis Entrée

### 3.3 Installation de Visual Studio Code
1. Allez sur https://code.visualstudio.com
2. Cliquez "Download for Windows"
3. Double-cliquez sur le fichier téléchargé (VSCodeUserSetup-x64-X.XX.X.exe)
4. Suivez l'assistant d'installation :
   - Acceptez la licence
   - Laissez le dossier d'installation par défaut
   - **IMPORTANT** : Cochez "Add to PATH"
   - **IMPORTANT** : Cochez "Register Code as an editor for supported file types"
   - Cliquez "Install"
5. Cliquez "Finish" et VS Code s'ouvre

---

## 📂 ÉTAPE 4 : Ouverture du Projet dans VS Code

### 4.1 Ouverture du dossier projet
1. Dans VS Code, cliquez sur "File" (Fichier) dans le menu
2. Cliquez sur "Open Folder..." (Ouvrir le dossier...)
3. Naviguez vers C:\Projets\sitejet-editor-main
4. Sélectionnez le dossier "sitejet-editor-main"
5. Cliquez "Sélectionner le dossier"

### 4.2 Installation des dépendances
1. Dans VS Code, ouvrez le terminal :
   - Menu "Terminal" → "New Terminal"
   - OU raccourci : Ctrl + `
2. Le terminal s'ouvre en bas de l'écran
3. Tapez la commande suivante et appuyez sur Entrée :
   ```
   npm install
   ```
4. Attendez l'installation (peut prendre 5-10 minutes)
5. Une fois terminé, vous verrez le prompt de commande revenir

### 4.3 Configuration de la base de données
1. Dans le terminal VS Code, tapez :
   ```
   npm run db:push
   ```
2. Attendez que la commande se termine

### 4.4 Lancement du projet en développement
1. Dans le terminal, tapez :
   ```
   npm run dev
   ```
2. Attendez quelques secondes
3. Vous verrez des messages indiquant que le serveur démarre
4. Ouvrez votre navigateur et allez sur http://localhost:5000
5. SiteJet devrait s'afficher !

---

## 🌐 ÉTAPE 5 : Installation sur Hébergement Web (cPanel)

### 5.1 Préparation des fichiers pour production
1. Dans VS Code, ouvrez le terminal
2. Arrêtez le serveur de développement (Ctrl + C si il tourne)
3. Tapez la commande de build :
   ```
   npm run build
   ```
4. Attendez la fin de la compilation
5. Un dossier "dist" est créé avec les fichiers de production

### 5.2 Connexion à cPanel
1. Ouvrez votre navigateur
2. Allez sur l'URL de votre cPanel (fournie par votre hébergeur)
3. Connectez-vous avec vos identifiants
4. Une fois connecté, cherchez l'icône "File Manager" (Gestionnaire de fichiers)
5. Cliquez sur "File Manager"

### 5.3 Préparation du dossier web
1. Dans File Manager, naviguez vers "public_html"
2. Si ce n'est pas vide, créez un sous-dossier :
   - Clic droit → "Create Folder"
   - Nommez-le "sitejet"
   - Double-cliquez pour entrer dedans

### 5.4 Upload des fichiers
1. Dans cPanel File Manager, cliquez "Upload"
2. Dans votre explorateur Windows, naviguez vers le dossier du projet
3. Sélectionnez TOUS les fichiers du dossier "dist"
4. Glissez-déposez les dans la zone d'upload de cPanel
5. Attendez la fin de l'upload
6. Revenez au File Manager

### 5.5 Configuration de la base de données en ligne
1. Dans cPanel, cherchez "MySQL Databases"
2. Créez une nouvelle base de données :
   - Nom : "sitejet_db"
   - Cliquez "Create Database"
3. Créez un utilisateur :
   - Nom d'utilisateur : "sitejet_user"
   - Mot de passe : (choisissez un mot de passe fort)
   - Cliquez "Create User"
4. Associez l'utilisateur à la base :
   - Sélectionnez l'utilisateur et la base
   - Donnez "All Privileges"
   - Cliquez "Make Changes"

### 5.6 Configuration des variables d'environnement
1. Dans File Manager, créez un fichier ".env" :
   - Clic droit → "Create File"
   - Nommez-le ".env"
2. Double-cliquez sur ".env" pour l'éditer
3. Ajoutez les variables (remplacez par vos vraies valeurs) :
   ```
   DATABASE_URL=mysql://sitejet_user:votre_mot_de_passe@localhost:3306/sitejet_db
   NODE_ENV=production
   ```
4. Cliquez "Save Changes"

### 5.7 Test de l'installation
1. Ouvrez votre navigateur
2. Allez sur : https://votre-domaine.com/sitejet
3. SiteJet devrait s'afficher et fonctionner !

---

## 📦 ÉTAPE 6 : Création d'un Package de Distribution

### 6.1 Préparation du package
1. Dans VS Code, créez un nouveau dossier "release" :
   - Clic droit dans l'explorateur → "New Folder"
   - Nommez-le "release"

### 6.2 Génération des fichiers de distribution
1. Dans le terminal VS Code, tapez :
   ```
   npm run build
   ```
2. Copiez le contenu du dossier "dist" vers "release"
3. Copiez aussi ces fichiers à la racine du projet vers "release" :
   - package.json
   - README.md
   - docs/ (dossier entier)

### 6.3 Création du manuel d'installation
1. Dans le dossier "release", créez un fichier "INSTALLATION.txt"
2. Copiez-y le contenu simplifié d'installation
3. Ajoutez vos informations de contact pour le support

### 6.4 Création de l'archive finale
1. Dans l'Explorateur Windows, naviguez vers votre projet
2. Clic droit sur le dossier "release"
3. Sélectionnez "Envoyer vers" → "Dossier compressé (zippé)"
4. Renommez l'archive : "SiteJet-v1.0-Windows.zip"

Votre package de distribution est prêt à être partagé !

---

## 🆘 Résolution des Problèmes Courants

### Problème : "npm n'est pas reconnu"
**Solution :** Node.js n'est pas installé correctement
1. Redémarrez votre ordinateur
2. Réinstallez Node.js en tant qu'administrateur
3. Assurez-vous de cocher "Add to PATH" lors de l'installation

### Problème : Erreur de permissions
**Solution :** Lancez VS Code en tant qu'administrateur
1. Clic droit sur l'icône VS Code
2. Sélectionnez "Exécuter en tant qu'administrateur"

### Problème : Port 5000 déjà utilisé
**Solution :** Changez le port dans le fichier de configuration
1. Modifiez server/index.ts ligne du port
2. Changez 5000 par 3000 ou 8000

### Problème : Base de données ne se connecte pas
**Solution :** Vérifiez la chaîne de connexion DATABASE_URL
1. Assurez-vous que les identifiants sont corrects
2. Vérifiez que la base de données existe
3. Testez la connexion avec un outil comme phpMyAdmin

---

## 📞 Support et Aide

- Documentation complète : Consultez le dossier "docs/"
- Issues GitHub : Reportez les bugs sur le repository GitHub
- Communauté : Rejoignez les forums de développement web

Cette documentation devrait vous permettre d'installer et utiliser SiteJet avec succès !