<?php
/**
 * 🛠️ PAGEFORGE - CONFIGURATEUR DÉVELOPPEMENT
 * 
 * Configuration automatique de l'environnement de développement
 * Compatible VS Code avec extensions et debugging
 */

class PageForgeDevSetup {
    private $version = '2.0.0';
    private $baseDir;
    
    public function __construct() {
        $this->baseDir = dirname(__DIR__);
    }
    
    public function run() {
        $this->printHeader();
        
        echo "🔍 Vérification de l'environnement de développement...\n";
        $this->checkDevRequirements();
        
        echo "📦 Installation des dépendances...\n";
        $this->installDependencies();
        
        echo "🗄️ Configuration base de données développement...\n";
        $this->setupDevDatabase();
        
        echo "⚙️ Génération fichier .env développement...\n";
        $this->createDevEnvFile();
        
        echo "🔧 Configuration VS Code...\n";
        $this->setupVSCode();
        
        echo "📚 Création documentation développeur...\n";
        $this->createDevDocs();
        
        echo "\n✅ Configuration développement terminée !\n";
        echo "🚀 Commandes disponibles :\n";
        echo "   npm run dev     - Démarrer en mode développement\n";
        echo "   npm run build   - Build production\n";
        echo "   npm run test    - Lancer les tests\n";
        echo "   code .          - Ouvrir VS Code\n\n";
    }
    
    private function printHeader() {
        echo "\n";
        echo "╔══════════════════════════════════════════════════════════════╗\n";
        echo "║                🛠️  PAGEFORGE v{$this->version}                    ║\n";
        echo "║            Configuration Développement Automatique          ║\n";
        echo "╚══════════════════════════════════════════════════════════════╝\n";
        echo "\n";
    }
    
    private function checkDevRequirements() {
        $allGood = true;
        
        // PHP Version
        if(!version_compare(PHP_VERSION, '7.4', '>=')) {
            echo "❌ PHP 7.4+ requis. Version actuelle: " . PHP_VERSION . "\n";
            $allGood = false;
        } else {
            echo "✅ PHP " . PHP_VERSION . "\n";
        }
        
        // Extensions PHP requises
        $extensions = ['pdo', 'pdo_sqlite', 'json', 'curl', 'zip'];
        foreach($extensions as $ext) {
            if(!extension_loaded($ext)) {
                echo "❌ Extension PHP manquante: $ext\n";
                $allGood = false;
            } else {
                echo "✅ Extension $ext\n";
            }
        }
        
        // Node.js
        $nodeVersion = shell_exec('node --version 2>/dev/null');
        if(!$nodeVersion) {
            echo "❌ Node.js requis pour le développement\n";
            echo "   Installez depuis: https://nodejs.org\n";
            $allGood = false;
        } else {
            echo "✅ Node.js " . trim($nodeVersion) . "\n";
        }
        
        // NPM
        $npmVersion = shell_exec('npm --version 2>/dev/null');
        if($npmVersion) {
            echo "✅ NPM " . trim($npmVersion) . "\n";
        }
        
        // Git
        $gitVersion = shell_exec('git --version 2>/dev/null');
        if($gitVersion) {
            echo "✅ Git " . trim($gitVersion) . "\n";
        } else {
            echo "⚠️  Git non détecté (recommandé)\n";
        }
        
        if(!$allGood) {
            echo "\n❌ Prérequis manquants. Installez-les avant de continuer.\n";
            exit(1);
        }
        
        echo "\n";
    }
    
    private function installDependencies() {
        // Vérifier package.json
        $packageJsonPath = $this->baseDir . '/package.json';
        if(!file_exists($packageJsonPath)) {
            echo "❌ package.json non trouvé\n";
            return;
        }
        
        // Installer les dépendances Node.js
        chdir($this->baseDir);
        echo "📦 Installation dépendances Node.js...\n";
        system('npm install');
        
        echo "✅ Dépendances installées\n\n";
    }
    
    private function setupDevDatabase() {
        $dbPath = $this->baseDir . '/dev-database.sqlite';
        
        try {
            $pdo = new PDO('sqlite:' . $dbPath);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Tables de développement
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            
            $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                template_id TEXT,
                user_id INTEGER,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )");
            
            $pdo->exec("CREATE TABLE IF NOT EXISTS templates (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT,
                preview_image TEXT,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            
            // Insérer des données de test
            $pdo->exec("INSERT OR IGNORE INTO users (username, email, password_hash) VALUES 
                ('dev_user', 'dev@pageforge.local', 'dev_password_hash')");
            
            $pdo->exec("INSERT OR IGNORE INTO templates (id, name, description, category, data) VALUES 
                ('blank', 'Projet Vide', 'Template vide pour commencer', 'basic', '{}'),
                ('portfolio', 'Portfolio', 'Template portfolio professionnel', 'business', '{}'),
                ('blog', 'Blog', 'Template de blog moderne', 'content', '{}')");
            
            echo "✅ Base de données développement configurée: $dbPath\n";
            
        } catch(PDOException $e) {
            echo "❌ Erreur base de données: " . $e->getMessage() . "\n";
        }
        
        echo "\n";
    }
    
    private function createDevEnvFile() {
        $envPath = $this->baseDir . '/.env';
        
        $envContent = "# PageForge - Environnement de Développement\n";
        $envContent .= "NODE_ENV=development\n";
        $envContent .= "PORT=3000\n";
        $envContent .= "API_PORT=5000\n\n";
        
        $envContent .= "# Base de données développement\n";
        $envContent .= "DATABASE_URL=sqlite:./dev-database.sqlite\n\n";
        
        $envContent .= "# Configuration développement\n";
        $envContent .= "DEV_MODE=true\n";
        $envContent .= "HOT_RELOAD=true\n";
        $envContent .= "DEBUG_MODE=true\n";
        $envContent .= "LOG_LEVEL=debug\n\n";
        
        $envContent .= "# Uploads (développement)\n";
        $envContent .= "UPLOAD_DIR=./uploads\n";
        $envContent .= "MAX_FILE_SIZE=10485760\n\n";
        
        $envContent .= "# Sécurité (développement uniquement)\n";
        $envContent .= "SESSION_SECRET=dev_session_secret_change_in_production\n";
        $envContent .= "JWT_SECRET=dev_jwt_secret_change_in_production\n";
        
        file_put_contents($envPath, $envContent);
        echo "✅ Fichier .env créé\n\n";
    }
    
    private function setupVSCode() {
        $vscodeDir = $this->baseDir . '/.vscode';
        
        if(!is_dir($vscodeDir)) {
            mkdir($vscodeDir, 0755, true);
        }
        
        // settings.json
        $settings = [
            'typescript.preferences.importModuleSpecifier' => 'relative',
            'editor.formatOnSave' => true,
            'editor.defaultFormatter' => 'esbenp.prettier-vscode',
            'editor.codeActionsOnSave' => [
                'source.fixAll.eslint' => true
            ],
            'tailwindCSS.includeLanguages' => [
                'typescript' => 'typescript',
                'typescriptreact' => 'typescriptreact'
            ],
            'emmet.includeLanguages' => [
                'javascript' => 'javascriptreact',
                'typescript' => 'typescriptreact'
            ],
            'files.exclude' => [
                '**/node_modules' => true,
                '**/dist' => true,
                '**/.git' => true,
                '**/dev-database.sqlite*' => true,
                '**/uploads' => true
            ],
            'search.exclude' => [
                '**/node_modules' => true,
                '**/dist' => true,
                '**/packages' => true
            ],
            'typescript.updateImportsOnFileMove.enabled' => 'always',
            'javascript.updateImportsOnFileMove.enabled' => 'always'
        ];
        
        file_put_contents($vscodeDir . '/settings.json', json_encode($settings, JSON_PRETTY_PRINT));
        
        // extensions.json
        $extensions = [
            'recommendations' => [
                'ms-vscode.vscode-typescript-next',
                'bradlc.vscode-tailwindcss',
                'esbenp.prettier-vscode',
                'dbaeumer.vscode-eslint',
                'formulahendry.auto-rename-tag',
                'christian-kohler.path-intellisense',
                'ms-vscode.vscode-json',
                'eamodio.gitlens',
                'ms-vscode.vscode-eslint',
                'yzhang.markdown-all-in-one',
                'ms-vscode.hexeditor'
            ]
        ];
        
        file_put_contents($vscodeDir . '/extensions.json', json_encode($extensions, JSON_PRETTY_PRINT));
        
        // launch.json pour debugging
        $launch = [
            'version' => '0.2.0',
            'configurations' => [
                [
                    'name' => 'Launch PageForge Client',
                    'type' => 'node',
                    'request' => 'launch',
                    'program' => '${workspaceFolder}/node_modules/.bin/vite',
                    'args' => ['--mode', 'development'],
                    'env' => [
                        'NODE_ENV' => 'development'
                    ],
                    'console' => 'integratedTerminal',
                    'internalConsoleOptions' => 'neverOpen'
                ],
                [
                    'name' => 'Launch PageForge Server',
                    'type' => 'node',
                    'request' => 'launch',
                    'program' => '${workspaceFolder}/server/index.ts',
                    'outFiles' => ['${workspaceFolder}/dist/**/*.js'],
                    'env' => [
                        'NODE_ENV' => 'development'
                    ],
                    'console' => 'integratedTerminal',
                    'internalConsoleOptions' => 'neverOpen'
                ]
            ]
        ];
        
        file_put_contents($vscodeDir . '/launch.json', json_encode($launch, JSON_PRETTY_PRINT));
        
        // tasks.json
        $tasks = [
            'version' => '2.0.0',
            'tasks' => [
                [
                    'label' => 'Build PageForge',
                    'type' => 'npm',
                    'script' => 'build',
                    'group' => [
                        'kind' => 'build',
                        'isDefault' => true
                    ],
                    'presentation' => [
                        'echo' => true,
                        'reveal' => 'always',
                        'focus' => false,
                        'panel' => 'shared'
                    ]
                ],
                [
                    'label' => 'Start Dev Server',
                    'type' => 'npm',
                    'script' => 'dev',
                    'group' => 'build',
                    'presentation' => [
                        'echo' => true,
                        'reveal' => 'always',
                        'focus' => false,
                        'panel' => 'shared'
                    ]
                ]
            ]
        ];
        
        file_put_contents($vscodeDir . '/tasks.json', json_encode($tasks, JSON_PRETTY_PRINT));
        
        echo "✅ Configuration VS Code créée\n\n";
    }
    
    private function createDevDocs() {
        $docsDir = $this->baseDir . '/docs';
        
        // DEVELOPMENT.md
        $devDoc = "# 🛠️ Guide de Développement PageForge\n\n";
        $devDoc .= "## Démarrage Rapide\n\n";
        $devDoc .= "```bash\n";
        $devDoc .= "# Installer les dépendances\n";
        $devDoc .= "npm install\n\n";
        $devDoc .= "# Démarrer en mode développement\n";
        $devDoc .= "npm run dev\n\n";
        $devDoc .= "# Build production\n";
        $devDoc .= "npm run build\n";
        $devDoc .= "```\n\n";
        
        $devDoc .= "## Structure du Projet\n\n";
        $devDoc .= "- `client/` - Frontend React + TypeScript\n";
        $devDoc .= "- `server/` - Backend Node.js + Express\n";
        $devDoc .= "- `shared/` - Code partagé (types, schémas)\n";
        $devDoc .= "- `build-scripts/` - Scripts d'installation et build\n";
        $devDoc .= "- `docs/` - Documentation\n\n";
        
        $devDoc .= "## Configuration VS Code\n\n";
        $devDoc .= "Le projet est pré-configuré avec :\n";
        $devDoc .= "- Extensions recommandées\n";
        $devDoc .= "- Configuration de debug\n";
        $devDoc .= "- Formatage automatique\n";
        $devDoc .= "- IntelliSense TypeScript\n\n";
        
        $devDoc .= "## Base de Données de Développement\n\n";
        $devDoc .= "SQLite est utilisé pour le développement :\n";
        $devDoc .= "- Fichier : `dev-database.sqlite`\n";
        $devDoc .= "- Données de test incluses\n";
        $devDoc .= "- Schémas automatiquement créés\n\n";
        
        $devDoc .= "## Commandes Utiles\n\n";
        $devDoc .= "```bash\n";
        $devDoc .= "npm run dev          # Mode développement avec hot reload\n";
        $devDoc .= "npm run build        # Build production\n";
        $devDoc .= "npm run preview      # Preview du build production\n";
        $devDoc .= "npm run lint         # Linter ESLint\n";
        $devDoc .= "npm run type-check   # Vérification TypeScript\n";
        $devDoc .= "```\n\n";
        
        file_put_contents($docsDir . '/DEVELOPMENT.md', $devDoc);
        
        echo "✅ Documentation développeur créée\n\n";
    }
}

// Démarrage automatique
$setup = new PageForgeDevSetup();
$setup->run();
?>