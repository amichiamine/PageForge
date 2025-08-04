# PageForge v2.0.0 - Package Linux/macOS

## Installation Automatisée Unix

### 🚀 Installation Ultra-Rapide

```bash
# Extraire l'archive
tar -xzf pageforge-linux-v2.0.0.tar.gz
cd pageforge-linux-v2.0.0

# Lancer l'installateur
./start-installer.sh
```

### 📋 Prérequis

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install php php-sqlite3 php-curl php-zip
```

**CentOS/RHEL:**
```bash
sudo yum install php php-pdo php-json php-curl
```

**macOS:**
```bash
brew install php
```

**Node.js (recommandé):**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node
```

### 🔧 Installation Manuelle

1. **Extraire** les fichiers
2. **Installer** les prérequis (voir ci-dessus)
3. **Lancer** `./start-installer.sh`
4. **Ouvrir** http://localhost:8000/install.php

### 🚀 Fonctionnalités

- Compatible toutes distributions Linux
- Support macOS natif
- Installation Node.js automatique
- Scripts shell optimisés
- Configuration SQLite automatique

### 🆘 Support

Consultez `LINUX-INSTALL.txt` pour des instructions détaillées.
