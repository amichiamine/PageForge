# Guide de Distribution PageForge v2.0.0
2025-08-04 20:55:12

## Packages Générés

### 📦 pageforge-cpanel-v2.0.0.zip
- **Type** : Hébergement web cPanel
- **Taille** : Variable selon configuration
- **Installation** : Interface web avec support Node.js Selector
- **Usage** : Production sur hébergement partagé

### 📦 pageforge-windows-v2.0.0.zip  
- **Type** : Installation locale Windows
- **Installation** : Scripts batch + interface web
- **Usage** : Développement et utilisation locale Windows

### 📦 pageforge-linux-v2.0.0.tar.gz
- **Type** : Installation locale Linux/macOS
- **Installation** : Scripts shell + interface web  
- **Usage** : Développement et utilisation locale Unix

### 📦 pageforge-vscode-v2.0.0.zip
- **Type** : Environnement de développement VS Code
- **Installation** : Configuration automatique
- **Usage** : Développement professionnel avec VS Code

## Instructions de Distribution

1. **Testez** chaque package avant distribution
2. **Vérifiez** que tous les fichiers sont présents
3. **Documentez** les changements de version
4. **Publiez** sur les plateformes appropriées

## Checksums des Archives

Générez les checksums avec :
```bash
# Windows
certutil -hashfile pageforge-*.zip SHA256

# Linux/macOS  
sha256sum pageforge-*
```

## Support Utilisateur

- README.md dans chaque package
- INSTALLATION-GUIDE.txt pour instructions détaillées
- Documentation intégrée dans l'application
