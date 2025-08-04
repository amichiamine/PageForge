# 🔧 Guide de Résolution de Problèmes PageForge

Solutions aux problèmes les plus courants rencontrés avec PageForge.

## 📋 Table des Matières

1. [Problèmes d'Installation](#problèmes-dinstallation)
2. [Problèmes de Connexion](#problèmes-de-connexion)
3. [Problèmes d'Interface](#problèmes-dinterface)
4. [Problèmes d'Upload](#problèmes-dupload)
5. [Problèmes d'Export](#problèmes-dexport)
6. [Problèmes de Performance](#problèmes-de-performance)
7. [Erreurs Serveur](#erreurs-serveur)
8. [Obtenir de l'Aide](#obtenir-de-laide)

---

## 🚨 Problèmes d'Installation

### "PHP n'est pas reconnu" (Windows)

**Symptômes :**
- Message d'erreur au lancement de l'installateur
- Fenêtre qui se ferme immédiatement

**Solutions :**

#### Solution A : Installer XAMPP (Recommandé)
1. **Téléchargez** XAMPP : https://www.apachefriends.org/
2. **Installez** avec tous les composants
3. **Redémarrez** l'installateur PageForge
4. **PHP** sera automatiquement disponible

#### Solution B : Installation PHP Direct
1. **Téléchargez** PHP : https://windows.php.net/
2. **Choisissez** "Thread Safe" version
3. **Extrayez** dans `C:\php`
4. **Ajoutez** `C:\php` au PATH Windows :
   - `Windows + R` → tapez `sysdm.cpl`
   - Onglet **"Avancé"** → **"Variables d'environnement"**
   - **Double-cliquez** "Path" dans Variables système
   - **Cliquez** "Nouveau" → Tapez `C:\php`
   - **OK** partout et redémarrez

---

### "Permission denied" (Linux/macOS)

**Symptômes :**
- Script d'installation ne démarre pas
- Erreur de permissions au lancement

**Solutions :**

```bash
# Donner les permissions d'exécution
chmod +x start-installer.sh
chmod +x *.sh

# Si problème de propriétaire
sudo chown -R $USER:$USER .

# Relancer l'installation
./start-installer.sh
```

---

### "Database connection failed"

**Symptômes :**
- Erreur lors de la configuration base de données
- Installation bloquée à l'étape DB

**Solutions :**

#### Vérifications cPanel
1. **Retournez** dans cPanel → "MySQL Databases"
2. **Vérifiez** que la base existe
3. **Vérifiez** l'utilisateur est associé à la base
4. **Testez** avec un script de connexion simple

#### Paramètres courants
- **Host** : `localhost` (99% des cas)
- **Port** : `3306` pour MySQL, `5432` pour PostgreSQL
- **Préfixe** : Certains hébergeurs ajoutent un préfixe au nom

#### Script de test
```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=votre_base", "utilisateur", "mot_de_passe");
    echo "✅ Connexion réussie !";
} catch(PDOException $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
?>
```

---

## 🔌 Problèmes de Connexion

### "Impossible d'accéder à PageForge"

**Symptômes :**
- Page blanche ou erreur 404
- "Site inaccessible"

**Solutions :**

#### Vérifications URL
- **Hébergement cPanel** : `https://votre-domaine.com/`
- **Local Windows** : `http://localhost:3000`
- **Local Linux/Mac** : `http://localhost:3000`

#### Vérifications serveur
```bash
# Vérifier que le port n'est pas occupé
netstat -tulpn | grep :3000

# Redémarrer PageForge
# Windows : relancer start-installer.bat
# Linux/Mac : ./start-installer.sh
```

---

### "ERR_CONNECTION_REFUSED"

**Symptômes :**
- Navigateur refuse la connexion
- Timeout de connexion

**Solutions :**

1. **Vérifiez** que le serveur PageForge tourne
2. **Redémarrez** l'installateur
3. **Testez** un autre port :
   ```bash
   php -S localhost:8080
   ```
4. **Désactivez** temporairement firewall/antivirus

---

## 🖼️ Problèmes d'Interface

### "Interface ne se charge pas"

**Symptômes :**
- Écran blanc après connexion
- Interface partiellement chargée

**Solutions :**

#### Cache navigateur
1. **Ouvrez** les outils développeur (F12)
2. **Clic droit** sur le bouton actualiser
3. **Sélectionnez** "Vider le cache et recharger"

#### JavaScript désactivé
1. **Vérifiez** que JavaScript est activé
2. **Autorisez** les pop-ups pour PageForge
3. **Désactivez** les bloqueurs de pub temporairement

#### Navigateur incompatible
- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

---

### "Composants ne s'affichent pas"

**Symptômes :**
- Palette vide à gauche
- Erreur de chargement composants

**Solutions :**

1. **Actualisez** la page (F5)
2. **Vérifiez** la console développeur (F12)
3. **Testez** un autre navigateur
4. **Vérifiez** les fichiers JavaScript sont bien chargés

---

## 📤 Problèmes d'Upload

### "Impossible d'uploader des images"

**Symptômes :**
- Erreur lors de l'upload
- Images ne s'affichent pas

**Solutions :**

#### Taille de fichier
- **Maximum** : 10MB par défaut
- **Formats** : JPG, PNG, GIF, SVG
- **Réduisez** la taille si nécessaire

#### Configuration PHP (cPanel)
```ini
; Dans .htaccess ou php.ini
upload_max_filesize = 20M
post_max_size = 20M
max_execution_time = 300
memory_limit = 256M
```

#### Permissions dossier
```bash
# Linux/Mac : Permissions dossier uploads
chmod 755 uploads/
chown www-data:www-data uploads/
```

---

### "Images cassées après upload"

**Symptômes :**
- Images uploaded mais ne s'affichent pas
- Icône d'image cassée

**Solutions :**

1. **Vérifiez** le chemin des images dans le code
2. **Testez** l'URL directe de l'image
3. **Rechargez** l'image dans l'éditeur
4. **Vérifiez** les permissions du serveur web

---

## 📥 Problèmes d'Export

### "Export échoue ou fichier corrompu"

**Symptômes :**
- Fichier ZIP ne se télécharge pas
- Archive corrompue
- Export infini

**Solutions :**

#### Mémoire PHP insuffisante
```php
// Dans .htaccess
php_value memory_limit 512M
php_value max_execution_time 300
```

#### Projet trop volumineux
1. **Réduisez** la taille des images
2. **Supprimez** les composants non utilisés
3. **Exportez** page par page si nécessaire

#### Permissions serveur
```bash
# Vérifier les permissions d'écriture
ls -la temp/
chmod 755 temp/
```

---

### "Site exporté ne fonctionne pas"

**Symptômes :**
- HTML généré ne s'affiche pas correctement
- CSS/JS manquants

**Solutions :**

1. **Vérifiez** la structure des fichiers exportés :
   ```
   export/
   ├── index.html
   ├── css/
   ├── js/
   └── images/
   ```

2. **Testez** localement avant upload
3. **Vérifiez** les chemins relatifs
4. **Uploadez** tous les dossiers sur l'hébergeur

---

## ⚡ Problèmes de Performance

### "PageForge très lent"

**Symptômes :**
- Interface qui rame
- Sauvegarde lente
- Aperçu qui se charge mal

**Solutions :**

#### Navigateur
1. **Fermez** les autres onglets
2. **Redémarrez** le navigateur
3. **Videz** le cache et cookies
4. **Testez** en mode incognito

#### Projet
1. **Réduisez** le nombre d'images
2. **Optimisez** les images (compression)
3. **Supprimez** les composants inutiles
4. **Sauvegardez** et rechargez le projet

#### Serveur
1. **Vérifiez** l'espace disque disponible
2. **Augmentez** la mémoire PHP si possible
3. **Contactez** votre hébergeur

---

### "Sauvegarde très lente"

**Symptômes :**
- Auto-sauvegarde qui prend du temps
- Interface gelée pendant sauvegarde

**Solutions :**

1. **Réduisez** la fréquence d'auto-save
2. **Sauvez manuellement** moins souvent
3. **Vérifiez** la connexion internet
4. **Optimisez** la base de données

---

## 🔥 Erreurs Serveur

### "Error 500 - Internal Server Error"

**Symptômes :**
- Page d'erreur 500
- Site inaccessible

**Solutions :**

#### Logs d'erreur
1. **Consultez** les logs dans cPanel → "Error Logs"
2. **Identifiez** l'erreur PHP spécifique
3. **Corrigez** le problème identifié

#### Erreurs communes
- **Mémoire PHP dépassée** → Augmentez memory_limit
- **Fichier manquant** → Vérifiez installation complète
- **Permissions** → chmod 755 sur dossiers

---

### "Error 404 - Page Not Found"

**Symptômes :**
- Pages non trouvées
- URLs cassées

**Solutions :**

1. **Vérifiez** le fichier `.htaccess` :
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.html [L]
   ```

2. **Testez** l'URL directe des fichiers
3. **Vérifiez** la structure des dossiers

---

## 📞 Obtenir de l'Aide

### Informations à Fournir

Quand vous demandez de l'aide, incluez **toujours** :

1. **Système d'exploitation** (Windows 10, Ubuntu 20.04, etc.)
2. **Type d'installation** (cPanel, local, développement)
3. **Navigateur et version** (Chrome 95, Firefox 92, etc.)
4. **Message d'erreur complet** (copier-coller)
5. **Étapes pour reproduire** le problème

### Logs Utiles

#### Logs navigateur (F12)
```
Console → Copier les erreurs JavaScript
Network → Vérifier les requêtes échouées
```

#### Logs serveur (cPanel)
```
cPanel → Error Logs → Dernières entrées
```

#### Logs PageForge
```
# Dans le dossier PageForge
cat logs/error.log
cat logs/access.log
```

### Outils de Diagnostic

#### Test de Connectivité
```bash
# Tester PHP
php --version
php -m | grep -E 'pdo|curl|json'

# Tester base de données
mysql -h localhost -u utilisateur -p

# Tester ports
telnet localhost 3000
```

#### Test des Permissions
```bash
# Linux/Mac
ls -la
find . -type f -name "*.php" -exec ls -la {} \;
```

### Canaux de Support

1. **GitHub Issues** : https://github.com/votre-repo/pageforge/issues
   - Pour bugs et demandes de fonctionnalités
   - Inclure les informations de debug

2. **Discussions** : https://github.com/votre-repo/pageforge/discussions
   - Pour questions générales
   - Aide communautaire

3. **Wiki** : https://github.com/votre-repo/pageforge/wiki
   - Base de connaissances
   - Tutorials communautaires

---

## 🔄 Check-list de Dépannage

Avant de demander de l'aide, vérifiez :

- [ ] **Navigateur à jour** et compatible
- [ ] **Cache vidé** et page rechargée (Ctrl+F5)
- [ ] **JavaScript activé** dans le navigateur
- [ ] **Bloqueurs de pub désactivés** pour PageForge
- [ ] **Firewall/antivirus** ne bloque pas
- [ ] **Permissions fichiers** correctes (755/644)
- [ ] **Espace disque suffisant** (>100MB)
- [ ] **PHP version** 7.4 ou supérieure
- [ ] **Extensions PHP** requises installées
- [ ] **Base de données** accessible
- [ ] **Logs d'erreur** consultés

---

**Problème non résolu ?** Créez une issue GitHub avec tous les détails !

**PageForge - Support Communautaire 🤝**