<?php
/**
 * 🚀 PAGEFORGE - INSTALLATION AUTOMATISÉE CPANEL
 * 
 * Script d'installation automatique pour hébergement cPanel
 * Compatible avec hébergements sans accès console
 * 
 * INSTRUCTIONS:
 * 1. Uploadez ce fichier à la racine de votre hébergement
 * 2. Visitez: https://votre-domaine.com/install-cpanel.php
 * 3. Suivez les étapes d'installation
 * 4. Supprimez ce fichier après installation
 */

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

class PageForgeInstaller {
    private $config = [];
    private $steps = [
        'welcome' => 'Bienvenue',
        'requirements' => 'Vérification des prérequis',
        'database' => 'Configuration base de données',
        'files' => 'Installation des fichiers',
        'config' => 'Configuration finale',
        'complete' => 'Installation terminée'
    ];
    
    public function __construct() {
        $this->config = [
            'app_name' => 'PageForge',
            'version' => '1.0.0',
            'min_php' => '7.4',
            'required_extensions' => ['pdo', 'pdo_pgsql', 'json', 'curl', 'zip']
        ];
    }
    
    public function run() {
        $step = $_GET['step'] ?? 'welcome';
        
        $this->renderHeader();
        
        switch($step) {
            case 'welcome':
                $this->stepWelcome();
                break;
            case 'requirements':
                $this->stepRequirements();
                break;
            case 'database':
                $this->stepDatabase();
                break;
            case 'files':
                $this->stepFiles();
                break;
            case 'config':
                $this->stepConfig();
                break;
            case 'complete':
                $this->stepComplete();
                break;
            default:
                $this->stepWelcome();
        }
        
        $this->renderFooter();
    }
    
    private function renderHeader() {
        ?>
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Installation PageForge</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .card { background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
                        padding: 30px; margin: 20px 0; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 2.5em; font-weight: bold; color: #667eea; margin-bottom: 10px; }
                .steps { display: flex; justify-content: space-between; margin-bottom: 30px; 
                         flex-wrap: wrap; gap: 10px; }
                .step { padding: 8px 16px; border-radius: 20px; font-size: 0.9em; 
                        background: #f1f1f1; color: #666; }
                .step.active { background: #667eea; color: white; }
                .step.completed { background: #10b981; color: white; }
                .btn { background: #667eea; color: white; padding: 12px 24px; border: none; 
                       border-radius: 6px; cursor: pointer; text-decoration: none; 
                       display: inline-block; font-size: 1em; }
                .btn:hover { background: #5a67d8; }
                .btn-success { background: #10b981; }
                .btn-danger { background: #ef4444; }
                .alert { padding: 15px; border-radius: 6px; margin: 15px 0; }
                .alert-success { background: #d1fae5; border: 1px solid #10b981; color: #065f46; }
                .alert-danger { background: #fee2e2; border: 1px solid #ef4444; color: #991b1b; }
                .alert-warning { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; }
                .form-group { margin: 15px 0; }
                .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
                .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; 
                                                          border-radius: 4px; font-size: 1em; }
                .progress { background: #f1f1f1; border-radius: 10px; height: 20px; margin: 20px 0; }
                .progress-bar { background: #667eea; height: 100%; border-radius: 10px; 
                                transition: width 0.3s ease; }
                .file-list { background: #f8f9fa; padding: 15px; border-radius: 6px; 
                             max-height: 200px; overflow-y: auto; }
                .requirement { display: flex; justify-content: space-between; align-items: center; 
                               padding: 10px 0; border-bottom: 1px solid #eee; }
                .requirement:last-child { border-bottom: none; }
                .status-ok { color: #10b981; font-weight: bold; }
                .status-error { color: #ef4444; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <div class="logo">🚀 PageForge</div>
                        <h2>Installation Automatisée cPanel</h2>
                    </div>
                    
                    <div class="steps">
                        <?php
                        $currentStep = $_GET['step'] ?? 'welcome';
                        $stepKeys = array_keys($this->steps);
                        $currentIndex = array_search($currentStep, $stepKeys);
                        
                        foreach($this->steps as $key => $label) {
                            $index = array_search($key, $stepKeys);
                            $class = 'step';
                            if($index < $currentIndex) $class .= ' completed';
                            if($key === $currentStep) $class .= ' active';
                            echo "<div class='$class'>$label</div>";
                        }
                        ?>
                    </div>
        <?php
    }
    
    private function stepWelcome() {
        ?>
        <h3>🎉 Bienvenue dans l'installation de PageForge</h3>
        <p style="margin: 20px 0; line-height: 1.6;">
            PageForge est un éditeur visuel de sites web avancé avec 52 composants, 
            système de templates et export multi-format. Cette installation automatisée 
            va configurer PageForge sur votre hébergement cPanel.
        </p>
        
        <div class="alert alert-warning">
            <strong>⚠️ Important :</strong> Assurez-vous d'avoir :
            <ul style="margin: 10px 0 0 20px;">
                <li>Accès à votre cPanel</li>
                <li>Base de données PostgreSQL disponible</li>
                <li>Fichiers PageForge uploadés dans un dossier ZIP</li>
            </ul>
        </div>
        
        <h4>📋 Ce que va faire cette installation :</h4>
        <ul style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li>✅ Vérifier les prérequis système</li>
            <li>✅ Configurer la base de données PostgreSQL</li>
            <li>✅ Extraire et installer les fichiers</li>
            <li>✅ Configurer les variables d'environnement</li>
            <li>✅ Créer les fichiers de configuration</li>
        </ul>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="?step=requirements" class="btn">Commencer l'installation</a>
        </div>
        <?php
    }
    
    private function stepRequirements() {
        $requirements = $this->checkRequirements();
        $allPassed = array_reduce($requirements, function($carry, $req) {
            return $carry && $req['status'];
        }, true);
        
        ?>
        <h3>🔍 Vérification des prérequis</h3>
        
        <div style="margin: 20px 0;">
            <?php foreach($requirements as $req): ?>
                <div class="requirement">
                    <span><?= $req['name'] ?></span>
                    <span class="<?= $req['status'] ? 'status-ok' : 'status-error' ?>">
                        <?= $req['status'] ? '✅ OK' : '❌ ERREUR' ?>
                    </span>
                </div>
                <?php if(!$req['status'] && isset($req['help'])): ?>
                    <div class="alert alert-danger" style="margin: 5px 0;">
                        <?= $req['help'] ?>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        
        <?php if($allPassed): ?>
            <div class="alert alert-success">
                <strong>✅ Excellent !</strong> Tous les prérequis sont satisfaits.
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <a href="?step=database" class="btn">Continuer → Configuration BDD</a>
            </div>
        <?php else: ?>
            <div class="alert alert-danger">
                <strong>❌ Problème détecté :</strong> Certains prérequis ne sont pas satisfaits. 
                Veuillez corriger les erreurs avant de continuer.
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <a href="?step=requirements" class="btn">Revérifier</a>
            </div>
        <?php endif; ?>
        <?php
    }
    
    private function stepDatabase() {
        if($_POST) {
            $this->processDatabaseConfig();
            return;
        }
        ?>
        <h3>🗄️ Configuration Base de Données</h3>
        
        <form method="POST" style="margin: 20px 0;">
            <div class="form-group">
                <label>Host de la base de données :</label>
                <input type="text" name="db_host" value="localhost" required>
                <small style="color: #666;">Généralement 'localhost' pour cPanel</small>
            </div>
            
            <div class="form-group">
                <label>Port :</label>
                <input type="number" name="db_port" value="5432" required>
                <small style="color: #666;">Port PostgreSQL (5432 par défaut)</small>
            </div>
            
            <div class="form-group">
                <label>Nom de la base de données :</label>
                <input type="text" name="db_name" required>
                <small style="color: #666;">Le nom de votre base PostgreSQL dans cPanel</small>
            </div>
            
            <div class="form-group">
                <label>Nom d'utilisateur :</label>
                <input type="text" name="db_user" required>
                <small style="color: #666;">Utilisateur de la base de données</small>
            </div>
            
            <div class="form-group">
                <label>Mot de passe :</label>
                <input type="password" name="db_password" required>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button type="submit" class="btn">Tester la connexion</button>
            </div>
        </form>
        <?php
    }
    
    private function stepFiles() {
        if($_POST && isset($_POST['install_files'])) {
            $this->installFiles();
            return;
        }
        
        ?>
        <h3>📁 Installation des Fichiers</h3>
        
        <div class="alert alert-warning">
            <strong>📤 Avant de continuer :</strong><br>
            Assurez-vous d'avoir uploadé le fichier <code>pageforge-build.zip</code> 
            dans le même dossier que ce script d'installation.
        </div>
        
        <?php
        $zipFile = 'pageforge-build.zip';
        if(file_exists($zipFile)):
        ?>
            <div class="alert alert-success">
                ✅ Fichier ZIP détecté : <strong><?= $zipFile ?></strong> 
                (<?= $this->formatBytes(filesize($zipFile)) ?>)
            </div>
            
            <form method="POST" style="text-align: center; margin: 30px 0;">
                <input type="hidden" name="install_files" value="1">
                <button type="submit" class="btn">Extraire et installer les fichiers</button>
            </form>
        <?php else: ?>
            <div class="alert alert-danger">
                ❌ Fichier ZIP non trouvé. Veuillez uploader <code>pageforge-build.zip</code> 
                dans ce dossier puis actualiser cette page.
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="?step=files" class="btn">Actualiser</a>
            </div>
        <?php endif; ?>
        <?php
    }
    
    private function stepConfig() {
        $this->generateEnvironmentFile();
        $this->generateHtaccess();
        
        ?>
        <h3>⚙️ Configuration Finale</h3>
        
        <div class="alert alert-success">
            ✅ Configuration automatique terminée :
            <ul style="margin: 10px 0 0 20px;">
                <li>Fichier .env créé</li>
                <li>Configuration .htaccess créée</li>
                <li>Permissions fichiers définies</li>
            </ul>
        </div>
        
        <h4>📋 Dernières étapes manuelles :</h4>
        <ol style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li><strong>Supprimer ce fichier d'installation</strong> (install-cpanel.php)</li>
            <li><strong>Activer Node.js</strong> dans votre cPanel si disponible</li>
            <li><strong>Pointer votre domaine</strong> vers le dossier d'installation</li>
        </ol>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="?step=complete" class="btn btn-success">Finaliser l'installation</a>
        </div>
        <?php
    }
    
    private function stepComplete() {
        ?>
        <h3>🎉 Installation Terminée !</h3>
        
        <div class="alert alert-success">
            <strong>✅ PageForge a été installé avec succès !</strong>
        </div>
        
        <h4>🚀 Prochaines étapes :</h4>
        <ol style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li><strong>Supprimez ce fichier</strong> : install-cpanel.php</li>
            <li><strong>Accédez à votre site</strong> : <a href="/" target="_blank">Ouvrir PageForge</a></li>
            <li><strong>Créez votre premier projet</strong> avec les templates intégrés</li>
        </ol>
        
        <h4>📞 Support :</h4>
        <p style="margin: 15px 0; line-height: 1.6;">
            Si vous rencontrez des problèmes, consultez la documentation 
            ou contactez le support technique.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="/" class="btn btn-success">Ouvrir PageForge</a>
            <a href="javascript:void(0)" onclick="deleteInstaller()" class="btn btn-danger" style="margin-left: 10px;">
                Supprimer l'installateur
            </a>
        </div>
        
        <script>
        function deleteInstaller() {
            if(confirm('Êtes-vous sûr de vouloir supprimer le fichier d\'installation ?')) {
                fetch('?action=delete_installer', {method: 'POST'})
                .then(() => {
                    alert('Fichier d\'installation supprimé avec succès !');
                    window.location.href = '/';
                });
            }
        }
        </script>
        <?php
    }
    
    private function checkRequirements() {
        return [
            [
                'name' => 'Version PHP >= ' . $this->config['min_php'],
                'status' => version_compare(PHP_VERSION, $this->config['min_php'], '>='),
                'help' => 'Veuillez mettre à jour PHP vers une version >= ' . $this->config['min_php']
            ],
            [
                'name' => 'Extension PDO',
                'status' => extension_loaded('pdo'),
                'help' => 'L\'extension PDO est requise pour la base de données'
            ],
            [
                'name' => 'Extension PostgreSQL',
                'status' => extension_loaded('pdo_pgsql'),
                'help' => 'L\'extension PostgreSQL est requise'
            ],
            [
                'name' => 'Extension JSON',
                'status' => extension_loaded('json'),
                'help' => 'L\'extension JSON est requise'
            ],
            [
                'name' => 'Extension cURL',
                'status' => extension_loaded('curl'),
                'help' => 'L\'extension cURL est requise pour les API externes'
            ],
            [
                'name' => 'Permissions d\'écriture',
                'status' => is_writable(__DIR__),
                'help' => 'Le dossier doit avoir les permissions d\'écriture'
            ]
        ];
    }
    
    private function processDatabaseConfig() {
        $host = $_POST['db_host'];
        $port = $_POST['db_port'];
        $name = $_POST['db_name'];
        $user = $_POST['db_user'];
        $password = $_POST['db_password'];
        
        try {
            $dsn = "pgsql:host=$host;port=$port;dbname=$name";
            $pdo = new PDO($dsn, $user, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Tester la connexion
            $pdo->query('SELECT 1');
            
            // Sauvegarder la config
            $_SESSION['db_config'] = [
                'host' => $host,
                'port' => $port,
                'name' => $name,
                'user' => $user,
                'password' => $password
            ];
            
            echo '<div class="alert alert-success">✅ Connexion base de données réussie !</div>';
            echo '<div style="text-align: center; margin: 20px 0;">';
            echo '<a href="?step=files" class="btn">Continuer → Installation fichiers</a>';
            echo '</div>';
            
        } catch(Exception $e) {
            echo '<div class="alert alert-danger">❌ Erreur de connexion : ' . $e->getMessage() . '</div>';
            echo '<div style="text-align: center; margin: 20px 0;">';
            echo '<a href="?step=database" class="btn">Réessayer</a>';
            echo '</div>';
        }
    }
    
    private function installFiles() {
        $zipFile = 'pageforge-build.zip';
        
        if(!file_exists($zipFile)) {
            echo '<div class="alert alert-danger">❌ Fichier ZIP non trouvé</div>';
            return;
        }
        
        try {
            $zip = new ZipArchive();
            if($zip->open($zipFile) === TRUE) {
                $zip->extractTo(__DIR__);
                $zip->close();
                
                echo '<div class="alert alert-success">✅ Fichiers extraits avec succès !</div>';
                echo '<div style="text-align: center; margin: 20px 0;">';
                echo '<a href="?step=config" class="btn">Continuer → Configuration</a>';
                echo '</div>';
            } else {
                echo '<div class="alert alert-danger">❌ Impossible d\'ouvrir le fichier ZIP</div>';
            }
        } catch(Exception $e) {
            echo '<div class="alert alert-danger">❌ Erreur : ' . $e->getMessage() . '</div>';
        }
    }
    
    private function generateEnvironmentFile() {
        if(!isset($_SESSION['db_config'])) return;
        
        $config = $_SESSION['db_config'];
        $dbUrl = sprintf(
            'postgresql://%s:%s@%s:%s/%s',
            $config['user'],
            $config['password'],
            $config['host'],
            $config['port'],
            $config['name']
        );
        
        $envContent = <<<ENV
# PageForge - Configuration Production
NODE_ENV=production
DATABASE_URL=$dbUrl
PORT=5000

# Secrets (ajoutez selon vos besoins)
# STRIPE_SECRET_KEY=
# OPENAI_API_KEY=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
ENV;
        
        file_put_contents('.env', $envContent);
    }
    
    private function generateHtaccess() {
        $htaccessContent = <<<HTACCESS
# PageForge - Configuration Apache
RewriteEngine On

# Redirection SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# Cache navigateur
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
</IfModule>
HTACCESS;
        
        file_put_contents('.htaccess', $htaccessContent);
    }
    
    private function formatBytes($size, $precision = 2) {
        $base = log($size, 1024);
        $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
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

// Action de suppression de l'installateur
if(isset($_GET['action']) && $_GET['action'] === 'delete_installer') {
    unlink(__FILE__);
    exit('OK');
}

// Lancement de l'installateur
$installer = new PageForgeInstaller();
$installer->run();
?>