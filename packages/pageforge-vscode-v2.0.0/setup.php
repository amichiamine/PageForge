<?php
/**
 * 🚀 PAGEFORGE - CONFIGURATEUR VS CODE
 * 
 * Configuration automatique de l'environnement de développement VS Code
 */

class PageForgeVSCodeSetup {
    private $version = '2.0.0';
    
    public function run() {
        echo "🚀 Configuration PageForge pour VS Code\n";
        echo "=====================================\n\n";
        
        $this->checkRequirements();
        $this->setupVSCodeConfig();
        $this->installDependencies();
        $this->setupDatabase();
        $this->createEnvFile();
        
        echo "✅ Configuration terminée !\n";
        echo "📂 Ouvrez ce dossier dans VS Code\n";
        echo "🚀 Lancez avec: npm run dev\n\n";
    }
    
    private function checkRequirements() {
        echo "🔍 Vérification des prérequis...\n";
        
        // PHP
        if(version_compare(PHP_VERSION, '7.4', '>=')) {
            echo "✅ PHP " . PHP_VERSION . "\n";
        } else {
            echo "❌ PHP 7.4+ requis\n";
            exit(1);
        }
        
        // Node.js
        $nodeVersion = shell_exec('node --version 2>/dev/null');
        if($nodeVersion) {
            echo "✅ Node.js " . trim($nodeVersion) . "\n";
        } else {
            echo "❌ Node.js requis pour le développement\n";
            exit(1);
        }
        
        echo "\n";
    }
    
    private function setupVSCodeConfig() {
        echo "⚙️ Configuration VS Code...\n";
        
        if(is_dir('.vscode-template')) {
            rename('.vscode-template', '.vscode');
            echo "✅ Configuration VS Code activée\n";
        }
        
        echo "\n";
    }
    
    private function installDependencies() {
        echo "📦 Installation des dépendances...\n";
        system('npm install');
        echo "\n";
    }
    
    private function setupDatabase() {
        echo "🗄️ Configuration base de données...\n";
        
        // SQLite pour développement
        $dbPath = getcwd() . '/database.sqlite';
        
        try {
            $pdo = new PDO('sqlite:' . $dbPath);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Tables de base
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            
            echo "✅ Base de données SQLite configurée\n";
            
        } catch(PDOException $e) {
            echo "❌ Erreur base de données: " . $e->getMessage() . "\n";
        }
        
        echo "\n";
    }
    
    private function createEnvFile() {
        echo "📝 Création fichier .env...\n";
        
        $envContent = "# PageForge - Environnement de développement\n";
        $envContent .= "NODE_ENV=development\n";
        $envContent .= "PORT=3000\n\n";
        $envContent .= "# Base de données développement\n";
        $envContent .= "DATABASE_URL=sqlite:./database.sqlite\n\n";
        $envContent .= "# Configuration développement\n";
        $envContent .= "DEV_MODE=true\n";
        $envContent .= "HOT_RELOAD=true\n";
        
        file_put_contents('.env', $envContent);
        echo "✅ Fichier .env créé\n\n";
    }
}

$setup = new PageForgeVSCodeSetup();
$setup->run();
?>