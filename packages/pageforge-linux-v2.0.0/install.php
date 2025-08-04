<?php
/**
 * 🚀 PAGEFORGE - INSTALLATEUR LOCAL UNIVERSEL
 * 
 * Installation automatisée pour environnements locaux
 * Compatible Windows, Linux et macOS
 * 
 * UTILISATION:
 * 1. Extraire les fichiers PageForge dans un dossier
 * 2. Ouvrir un terminal dans ce dossier
 * 3. Lancer: php install-local.php
 * 4. Ou double-clic sur start-installer.bat (Windows) / start-installer.sh (Linux/Mac)
 */

class PageForgeLocalInstaller {
    private $version = '2.0.0';
    private $config = [];
    private $os;
    
    public function __construct() {
        $this->detectOS();
        $this->config = [
            'app_name' => 'PageForge',
            'version' => $this->version,
            'min_php' => '7.4',
            'min_node' => '16.0',
            'required_extensions' => ['pdo', 'json', 'curl', 'zip']
        ];
    }
    
    public function run() {
        if(php_sapi_name() === 'cli') {
            $this->runCLI();
        } else {
            $this->runWeb();
        }
    }
    
    private function runCLI() {
        $this->printHeader();
        
        echo "🔍 Vérification des prérequis...\n";
        if(!$this->checkRequirements()) {
            exit(1);
        }
        
        echo "🔧 Détection de l'environnement...\n";
        $this->detectEnvironment();
        
        echo "📦 Installation des dépendances...\n";
        $this->installDependencies();
        
        echo "🗄️ Configuration de la base de données...\n";
        $this->setupDatabase();
        
        echo "⚙️ Configuration de l'environnement...\n";
        $this->generateEnvFile();
        
        echo "🚀 Démarrage de l'application...\n";
        $this->startApplication();
        
        echo "\n✅ Installation terminée avec succès !\n";
        echo "📂 PageForge est maintenant accessible sur: http://localhost:3000\n\n";
    }
    
    private function runWeb() {
        session_start();
        
        $step = $_GET['step'] ?? 'welcome';
        
        $this->renderHeader();
        
        switch($step) {
            case 'welcome':
                $this->webStepWelcome();
                break;
            case 'requirements':
                $this->webStepRequirements();
                break;
            case 'environment':
                $this->webStepEnvironment();
                break;
            case 'database':
                $this->webStepDatabase();
                break;
            case 'install':
                $this->webStepInstall();
                break;
            case 'complete':
                $this->webStepComplete();
                break;
            default:
                $this->webStepWelcome();
        }
        
        $this->renderFooter();
    }
    
    private function detectOS() {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $this->os = 'windows';
        } elseif (PHP_OS === 'Darwin') {
            $this->os = 'macos';
        } else {
            $this->os = 'linux';
        }
    }
    
    private function printHeader() {
        echo "\n";
        echo "╔══════════════════════════════════════════════════════════════╗\n";
        echo "║                    🚀 PAGEFORGE v{$this->version}                     ║\n";
        echo "║              Installation Locale Automatisée                ║\n";
        echo "╚══════════════════════════════════════════════════════════════╝\n";
        echo "\n";
        echo "Système détecté: " . ucfirst($this->os) . " (" . PHP_OS . ")\n";
        echo "PHP version: " . PHP_VERSION . "\n\n";
    }
    
    private function checkRequirements() {
        $allGood = true;
        
        // PHP Version
        if(!version_compare(PHP_VERSION, $this->config['min_php'], '>=')) {
            echo "❌ PHP {$this->config['min_php']}+ requis. Version actuelle: " . PHP_VERSION . "\n";
            $allGood = false;
        } else {
            echo "✅ PHP " . PHP_VERSION . " OK\n";
        }
        
        // Extensions PHP
        foreach($this->config['required_extensions'] as $ext) {
            if(!extension_loaded($ext)) {
                echo "❌ Extension PHP manquante: $ext\n";
                $allGood = false;
            } else {
                echo "✅ Extension $ext OK\n";
            }
        }
        
        // Permissions d'écriture
        if(!is_writable('.')) {
            echo "❌ Permissions d'écriture manquantes dans le dossier actuel\n";
            $allGood = false;
        } else {
            echo "✅ Permissions d'écriture OK\n";
        }
        
        return $allGood;
    }
    
    private function detectEnvironment() {
        // Détecter Node.js
        $nodeVersion = $this->execCommand('node --version');
        if($nodeVersion) {
            echo "✅ Node.js détecté: " . trim($nodeVersion) . "\n";
            $_SESSION['node_available'] = true;
        } else {
            echo "⚠️ Node.js non détecté - Installation recommandée\n";
            $_SESSION['node_available'] = false;
            $this->showNodeInstallInstructions();
        }
        
        // Détecter NPM
        $npmVersion = $this->execCommand('npm --version');
        if($npmVersion) {
            echo "✅ NPM détecté: " . trim($npmVersion) . "\n";
        }
        
        // Détecter Git
        $gitVersion = $this->execCommand('git --version');
        if($gitVersion) {
            echo "✅ Git détecté: " . trim($gitVersion) . "\n";
        }
    }
    
    private function installDependencies() {
        if($_SESSION['node_available'] ?? false) {
            echo "📦 Installation des dépendances Node.js...\n";
            $this->execCommand('npm install');
            
            echo "🏗️ Build du projet...\n";
            $this->execCommand('npm run build');
        } else {
            echo "⚠️ Saut de l'installation Node.js - mode PHP uniquement\n";
        }
    }
    
    private function setupDatabase() {
        // Configuration base de données simplifiée pour local
        $dbPath = getcwd() . '/database.sqlite';
        $_SESSION['database_url'] = 'sqlite:' . $dbPath;
        
        echo "📄 Utilisation de SQLite: $dbPath\n";
        
        // Créer les tables si nécessaire
        try {
            $pdo = new PDO($_SESSION['database_url']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Tables de base
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            
            $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )");
            
            echo "✅ Base de données SQLite initialisée\n";
            
        } catch(PDOException $e) {
            echo "❌ Erreur base de données: " . $e->getMessage() . "\n";
        }
    }
    
    private function generateEnvFile() {
        $envContent = "# PageForge Configuration - Installation Locale\n";
        $envContent .= "NODE_ENV=development\n";
        $envContent .= "PORT=3000\n\n";
        
        $envContent .= "# Base de données\n";
        $envContent .= "DATABASE_URL=" . ($_SESSION['database_url'] ?? 'sqlite:./database.sqlite') . "\n\n";
        
        $envContent .= "# Configuration locale\n";
        $envContent .= "LOCAL_INSTALL=true\n";
        $envContent .= "OS_TYPE=" . $this->os . "\n";
        
        file_put_contents('.env', $envContent);
        echo "✅ Fichier .env créé\n";
    }
    
    private function startApplication() {
        if($_SESSION['node_available'] ?? false) {
            echo "🚀 Démarrage du serveur Node.js...\n";
            echo "Accédez à: http://localhost:3000\n";
            
            // Démarrage en arrière-plan
            if($this->os === 'windows') {
                pclose(popen('start /B npm start', 'r'));
            } else {
                pclose(popen('npm start > /dev/null 2>&1 &', 'r'));
            }
            
            sleep(3); // Attendre le démarrage
            
        } else {
            echo "🌐 Démarrage du serveur PHP...\n";
            echo "Accédez à: http://localhost:8000\n";
            
            // Serveur PHP intégré
            if($this->os === 'windows') {
                pclose(popen('start /B php -S localhost:8000 -t client/public', 'r'));
            } else {
                pclose(popen('php -S localhost:8000 -t client/public > /dev/null 2>&1 &', 'r'));
            }
        }
    }
    
    private function showNodeInstallInstructions() {
        echo "\n📝 Instructions d'installation Node.js:\n";
        
        switch($this->os) {
            case 'windows':
                echo "Windows: Téléchargez depuis https://nodejs.org\n";
                echo "Ou avec Chocolatey: choco install nodejs\n";
                break;
            case 'macos':
                echo "macOS: Téléchargez depuis https://nodejs.org\n";
                echo "Ou avec Homebrew: brew install node\n";
                break;
            case 'linux':
                echo "Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm\n";
                echo "CentOS/RHEL: sudo yum install nodejs npm\n";
                echo "Arch: sudo pacman -S nodejs npm\n";
                break;
        }
        echo "\n";
    }
    
    private function execCommand($command) {
        $output = shell_exec($command . ' 2>/dev/null');
        return $output;
    }
    
    // Version Web Interface
    private function renderHeader() {
        ?>
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PageForge - Installation Locale</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    min-height: 100vh; color: #333; 
                }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .card { 
                    background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
                    border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    padding: 40px; margin: 20px 0; 
                }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { 
                    font-size: 3rem; font-weight: 800; margin-bottom: 10px;
                    background: linear-gradient(135deg, #1e3c72, #2a5298);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .os-badge {
                    display: inline-block; background: #10b981; color: white;
                    padding: 6px 12px; border-radius: 20px; font-size: 0.85rem;
                }
                .btn { 
                    background: linear-gradient(135deg, #1e3c72, #2a5298); color: white;
                    padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer;
                    text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
                    font-size: 1rem; font-weight: 600; transition: all 0.3s ease;
                }
                .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(30, 60, 114, 0.3); }
                .alert { 
                    padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid;
                    display: flex; align-items: flex-start; gap: 15px;
                }
                .alert-success { background: #ecfdf5; border-color: #10b981; color: #065f46; }
                .alert-warning { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
                .alert-info { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
                .requirement { 
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 15px 0; border-bottom: 1px solid #f1f5f9; 
                }
                .requirement:last-child { border-bottom: none; }
                .status-ok { color: #10b981; font-weight: 600; }
                .status-error { color: #ef4444; font-weight: 600; }
                .text-center { text-align: center; }
                .mt-4 { margin-top: 2rem; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <div class="logo">🚀 PageForge</div>
                        <h2>Installation Locale Automatisée</h2>
                        <span class="os-badge"><?= ucfirst($this->os) ?> (<?= PHP_OS ?>)</span>
                    </div>
        <?php
    }
    
    private function webStepWelcome() {
        ?>
        <h3>🎉 Installation Locale PageForge</h3>
        <p style="margin: 20px 0; line-height: 1.6;">
            Cette installation configurera PageForge sur votre machine locale pour 
            le développement ou l'utilisation personnelle.
        </p>
        
        <div class="alert alert-info">
            <div>ℹ️</div>
            <div>
                <strong>Modes d'installation disponibles :</strong>
                <ul style="margin: 10px 0 0 20px;">
                    <li><strong>Mode complet</strong> : Avec Node.js + SQLite (recommandé)</li>
                    <li><strong>Mode PHP</strong> : PHP uniquement avec SQLite</li>
                </ul>
            </div>
        </div>
        
        <div class="text-center mt-4">
            <a href="?step=requirements" class="btn">Commencer l'installation</a>
        </div>
        <?php
    }
    
    private function webStepRequirements() {
        $requirements = $this->getWebRequirements();
        $allPassed = array_reduce($requirements, function($carry, $req) {
            return $carry && $req['status'];
        }, true);
        
        ?>
        <h3>🔍 Vérification des Prérequis</h3>
        
        <div style="margin: 30px 0;">
            <?php foreach($requirements as $req): ?>
                <div class="requirement">
                    <div>
                        <div><?= $req['name'] ?></div>
                        <?php if(isset($req['current'])): ?>
                            <small style="color: #6b7280;">Actuel: <?= $req['current'] ?></small>
                        <?php endif; ?>
                    </div>
                    <span class="<?= $req['status'] ? 'status-ok' : 'status-error' ?>">
                        <?= $req['status'] ? '✅ OK' : '❌ REQUIS' ?>
                    </span>
                </div>
            <?php endforeach; ?>
        </div>
        
        <?php if($allPassed): ?>
            <div class="alert alert-success">
                <div>✅</div>
                <div><strong>Tous les prérequis sont satisfaits !</strong></div>
            </div>
            <div class="text-center mt-4">
                <a href="?step=environment" class="btn">Continuer</a>
            </div>
        <?php else: ?>
            <div class="alert alert-warning">
                <div>⚠️</div>
                <div>Installez les composants manquants puis actualisez cette page.</div>
            </div>
            <div class="text-center mt-4">
                <a href="?step=requirements" class="btn">Revérifier</a>
            </div>
        <?php endif; ?>
        <?php
    }
    
    private function webStepComplete() {
        ?>
        <h3>🎉 Installation Terminée !</h3>
        
        <div class="alert alert-success">
            <div>✅</div>
            <div><strong>PageForge est maintenant installé et opérationnel !</strong></div>
        </div>
        
        <div style="margin: 30px 0;">
            <h4>🚀 Accès à votre installation :</h4>
            <ul style="margin: 15px 0 0 20px; line-height: 1.8;">
                <li><strong>Interface utilisateur :</strong> <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
                <li><strong>Documentation :</strong> Consultez README.md dans le dossier</li>
                <li><strong>Base de données :</strong> SQLite (database.sqlite)</li>
            </ul>
        </div>
        
        <div class="text-center mt-4">
            <a href="http://localhost:3000" target="_blank" class="btn">Ouvrir PageForge</a>
        </div>
        <?php
    }
    
    private function getWebRequirements() {
        $requirements = [];
        
        // PHP Version
        $requirements[] = [
            'name' => 'PHP >= ' . $this->config['min_php'],
            'current' => PHP_VERSION,
            'status' => version_compare(PHP_VERSION, $this->config['min_php'], '>=')
        ];
        
        // Extensions PHP
        foreach($this->config['required_extensions'] as $ext) {
            $requirements[] = [
                'name' => "Extension PHP: $ext",
                'status' => extension_loaded($ext)
            ];
        }
        
        // Node.js (optionnel)
        $nodeVersion = $this->execCommand('node --version');
        $requirements[] = [
            'name' => 'Node.js (recommandé)',
            'current' => $nodeVersion ? trim($nodeVersion) : 'Non installé',
            'status' => (bool)$nodeVersion
        ];
        
        return $requirements;
    }
    
    private function renderFooter() {
        ?>
                </div>
            </div>
        </body>
        </html>
        <?php
    }
}

// Auto-démarrage
$installer = new PageForgeLocalInstaller();
$installer->run();
?>