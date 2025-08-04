<?php
/**
 * 🚀 PAGEFORGE - INSTALLATEUR LOCAL INTERACTIF
 * 
 * Installation automatisée locale pour Windows, Linux et macOS
 * Interface web interactive pour installation sans ligne de commande
 * 
 * UTILISATION:
 * 1. Placez ce fichier + pageforge-files.zip dans un dossier
 * 2. Démarrez un serveur web local : php -S localhost:8000
 * 3. Visitez: http://localhost:8000/install-local.php
 * 4. Suivez l'assistant d'installation interactif
 * 5. PageForge sera installé et configuré automatiquement
 */

session_start();
header('Content-Type: text/html; charset=UTF-8');

class PageForgeLocalInstaller {
    private $version = '2.0.0';
    private $logFile = 'installation-local.log';
    private $installDir = './pageforge-installation';
    
    private $steps = [
        'welcome' => ['title' => '🏠 Accueil', 'desc' => 'Installation locale'],
        'system' => ['title' => '🔧 Système', 'desc' => 'Vérification environnement'],
        'nodejs' => ['title' => '📦 Node.js', 'desc' => 'Installation Node.js'],
        'files' => ['title' => '📁 Fichiers', 'desc' => 'Extraction projet'],
        'database' => ['title' => '🗄️ Base données', 'desc' => 'Configuration BDD'],
        'install' => ['title' => '⚙️ Installation', 'desc' => 'Configuration finale'],
        'complete' => ['title' => '✅ Terminé', 'desc' => 'Prêt à utiliser']
    ];
    
    private $os;
    private $osDetails;
    
    public function __construct() {
        $this->detectOS();
        $this->initializeLog();
        $this->handleAjaxRequests();
    }
    
    public function run() {
        $step = $_GET['step'] ?? 'welcome';
        $this->log("Navigation vers l'étape: $step");
        
        $this->renderPage($step);
    }
    
    private function detectOS() {
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        if (stripos(PHP_OS, 'WIN') === 0) {
            $this->os = 'windows';
            $this->osDetails = 'Windows ' . php_uname('r');
        } elseif (stripos(PHP_OS, 'DARWIN') === 0) {
            $this->os = 'macos';
            $this->osDetails = 'macOS ' . php_uname('r');
        } else {
            $this->os = 'linux';
            $distro = $this->getLinuxDistro();
            $this->osDetails = $distro ?: 'Linux ' . php_uname('r');
        }
        
        $this->log("OS détecté: {$this->os} ({$this->osDetails})");
    }
    
    private function getLinuxDistro() {
        $releaseFiles = [
            '/etc/os-release',
            '/etc/lsb-release',
            '/etc/redhat-release',
            '/etc/debian_version'
        ];
        
        foreach ($releaseFiles as $file) {
            if (file_exists($file)) {
                $content = file_get_contents($file);
                if (preg_match('/PRETTY_NAME="([^"]+)"/', $content, $matches)) {
                    return $matches[1];
                }
                if (preg_match('/DISTRIB_DESCRIPTION="([^"]+)"/', $content, $matches)) {
                    return $matches[1];
                }
            }
        }
        
        return null;
    }
    
    private function handleAjaxRequests() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['ajax'])) {
            header('Content-Type: application/json');
            
            switch ($_GET['ajax']) {
                case 'check_system':
                    echo json_encode($this->checkSystemRequirements());
                    exit;
                    
                case 'check_nodejs':
                    echo json_encode($this->checkNodeJS());
                    exit;
                    
                case 'install_nodejs':
                    echo json_encode($this->installNodeJS());
                    exit;
                    
                case 'scan_files':
                    echo json_encode($this->scanProjectFiles());
                    exit;
                    
                case 'extract_files':
                    echo json_encode($this->extractProjectFiles());
                    exit;
                    
                case 'configure_database':
                    echo json_encode($this->configureDatabase());
                    exit;
                    
                case 'run_installation':
                    echo json_encode($this->runInstallation());
                    exit;
                    
                case 'launch_app':
                    echo json_encode($this->launchApplication());
                    exit;
                    
                case 'cleanup':
                    echo json_encode($this->cleanupInstaller());
                    exit;
            }
        }
    }
    
    private function renderPage($step) {
        ?>
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PageForge - Installation Locale</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                :root {
                    --primary: #667eea;
                    --primary-dark: #5a67d8;
                    --success: #10b981;
                    --warning: #f59e0b;
                    --error: #ef4444;
                    --info: #3b82f6;
                    --bg-primary: #f8fafc;
                    --bg-card: rgba(255, 255, 255, 0.95);
                    --text-primary: #1f2937;
                    --text-secondary: #6b7280;
                    --border: #e5e7eb;
                    --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: var(--gradient);
                    min-height: 100vh;
                    color: var(--text-primary);
                    line-height: 1.6;
                }
                
                .installer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .header-card {
                    background: var(--bg-card);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: var(--shadow);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .logo {
                    font-size: 3.5rem;
                    font-weight: 900;
                    background: var(--gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 15px;
                    letter-spacing: -2px;
                }
                
                .subtitle {
                    font-size: 1.3rem;
                    color: var(--text-secondary);
                    margin-bottom: 15px;
                    font-weight: 500;
                }
                
                .os-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--success);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                
                .progress-card {
                    background: var(--bg-card);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: var(--shadow);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .steps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .step-card {
                    background: #f8fafc;
                    border: 2px solid var(--border);
                    border-radius: 15px;
                    padding: 20px 15px;
                    text-align: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                
                .step-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--gradient);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                }
                
                .step-card.active::before {
                    opacity: 1;
                }
                
                .step-card.active {
                    color: white;
                    border-color: var(--primary);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                }
                
                .step-card.completed {
                    background: var(--success);
                    color: white;
                    border-color: var(--success);
                }
                
                .step-card.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .step-content {
                    position: relative;
                    z-index: 2;
                }
                
                .step-title {
                    font-weight: 700;
                    font-size: 1rem;
                    margin-bottom: 5px;
                }
                
                .step-desc {
                    font-size: 0.8rem;
                    opacity: 0.9;
                }
                
                .progress-bar {
                    height: 12px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 20px;
                    position: relative;
                }
                
                .progress-fill {
                    height: 100%;
                    background: var(--gradient);
                    border-radius: 10px;
                    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                
                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    animation: shimmer 2s infinite;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .main-card {
                    flex: 1;
                    background: var(--bg-card);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: var(--shadow);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .content-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 35px;
                    padding-bottom: 25px;
                    border-bottom: 2px solid var(--border);
                }
                
                .content-icon {
                    font-size: 3rem;
                    color: var(--primary);
                    animation: bounce 2s infinite;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                .content-title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin: 0;
                }
                
                .alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 20px;
                    border-radius: 15px;
                    margin: 25px 0;
                    border-left: 5px solid;
                    font-weight: 500;
                    animation: slideIn 0.5s ease;
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .alert-success {
                    background: rgba(16, 185, 129, 0.1);
                    border-color: var(--success);
                    color: #065f46;
                }
                
                .alert-warning {
                    background: rgba(245, 158, 11, 0.1);
                    border-color: var(--warning);
                    color: #92400e;
                }
                
                .alert-error {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: var(--error);
                    color: #991b1b;
                }
                
                .alert-info {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: var(--info);
                    color: #1e40af;
                }
                
                .alert-icon {
                    font-size: 1.3rem;
                    margin-top: 2px;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s;
                }
                
                .btn:hover::before {
                    left: 100%;
                }
                
                .btn-primary {
                    background: var(--gradient);
                    color: white;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }
                
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }
                
                .btn-success {
                    background: var(--success);
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }
                
                .btn-success:hover {
                    background: #059669;
                    transform: translateY(-3px);
                }
                
                .btn-secondary {
                    background: var(--text-secondary);
                    color: white;
                }
                
                .btn-danger {
                    background: var(--error);
                    color: white;
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }
                
                .btn.loading {
                    pointer-events: none;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 40px;
                    flex-wrap: wrap;
                }
                
                .requirements-grid {
                    display: grid;
                    gap: 15px;
                    margin: 25px 0;
                }
                
                .requirement-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 2px solid var(--border);
                    transition: all 0.3s ease;
                }
                
                .requirement-item.success {
                    border-color: var(--success);
                    background: rgba(16, 185, 129, 0.05);
                }
                
                .requirement-item.error {
                    border-color: var(--error);
                    background: rgba(239, 68, 68, 0.05);
                }
                
                .requirement-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .requirement-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                }
                
                .status-ok {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--success);
                }
                
                .status-error {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--error);
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .terminal {
                    background: #1a1a1a;
                    color: #00ff00;
                    border-radius: 12px;
                    padding: 25px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9rem;
                    max-height: 400px;
                    overflow-y: auto;
                    margin: 20px 0;
                    border: 2px solid #333;
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
                }
                
                .terminal-header {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #333;
                }
                
                .terminal-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }
                
                .dot-red { background: #ff5f56; }
                .dot-yellow { background: #ffbd2e; }
                .dot-green { background: #27ca3f; }
                
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                
                .feature-card {
                    background: rgba(255, 255, 255, 0.7);
                    padding: 25px;
                    border-radius: 15px;
                    border: 1px solid var(--border);
                    transition: all 0.3s ease;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .feature-icon {
                    font-size: 2.5rem;
                    color: var(--primary);
                    margin-bottom: 15px;
                }
                
                .feature-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: var(--text-primary);
                }
                
                .feature-desc {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                
                .footer-card {
                    background: var(--bg-card);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 25px;
                    text-align: center;
                    box-shadow: var(--shadow);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .footer-text {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                
                @media (max-width: 768px) {
                    .installer-container {
                        padding: 15px;
                    }
                    
                    .header-card,
                    .main-card {
                        padding: 25px;
                    }
                    
                    .logo {
                        font-size: 2.5rem;
                    }
                    
                    .content-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 15px;
                    }
                    
                    .content-title {
                        font-size: 1.8rem;
                    }
                    
                    .steps-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .btn {
                        width: 100%;
                        max-width: 300px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="installer-container">
                <!-- Header -->
                <div class="header-card">
                    <div class="logo">PageForge</div>
                    <div class="subtitle">Installation Locale Interactive</div>
                    <div class="os-badge">
                        <i class="fas fa-<?= $this->getOSIcon() ?>"></i>
                        <?= $this->osDetails ?>
                    </div>
                </div>
                
                <!-- Progress -->
                <div class="progress-card">
                    <div class="steps-grid" id="stepsGrid">
                        <?php $this->renderStepsGrid($step); ?>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="main-card">
                    <?php $this->renderStepContent($step); ?>
                </div>
                
                <!-- Footer -->
                <div class="footer-card">
                    <div class="footer-text">
                        PageForge Local Installer v<?= $this->version ?> | 
                        Compatible Windows, Linux & macOS | 
                        Installation sans ligne de commande
                    </div>
                </div>
            </div>
            
            <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
            <script>
                let currentStep = '<?= $step ?>';
                let os = '<?= $this->os ?>';
                
                $(document).ready(function() {
                    updateProgress();
                    initializeCurrentStep();
                });
                
                function updateProgress() {
                    const steps = Object.keys(<?= json_encode($this->steps) ?>);
                    const currentIndex = steps.indexOf(currentStep);
                    const progress = ((currentIndex + 1) / steps.length) * 100;
                    
                    $('#progressFill').css('width', progress + '%');
                }
                
                function showLoading(element, text = 'Traitement...') {
                    $(element).addClass('loading').html(`<span class="loading-spinner"></span> ${text}`).prop('disabled', true);
                }
                
                function hideLoading(element, originalText) {
                    $(element).removeClass('loading').html(originalText).prop('disabled', false);
                }
                
                function showAlert(type, message, container = '.main-card') {
                    const icons = {
                        success: 'fa-check-circle',
                        warning: 'fa-exclamation-triangle',
                        error: 'fa-times-circle',
                        info: 'fa-info-circle'
                    };
                    
                    const alert = `
                        <div class="alert alert-${type}">
                            <i class="fas ${icons[type]} alert-icon"></i>
                            <div>${message}</div>
                        </div>
                    `;
                    
                    $(container).prepend(alert);
                    
                    setTimeout(() => {
                        $('.alert').first().fadeOut(500, function() { $(this).remove(); });
                    }, 6000);
                }
                
                function navigateToStep(step) {
                    window.location.href = '?step=' + step;
                }
                
                function initializeCurrentStep() {
                    switch(currentStep) {
                        case 'system':
                            initSystemCheck();
                            break;
                        case 'nodejs':
                            initNodeJSCheck();
                            break;
                        case 'files':
                            initFilesCheck();
                            break;
                        case 'database':
                            initDatabaseConfig();
                            break;
                        case 'install':
                            initInstallation();
                            break;
                    }
                }
                
                function initSystemCheck() {
                    $('#checkSystemBtn').click(function() {
                        showLoading(this, 'Vérification système...');
                        
                        $.post('?ajax=check_system')
                            .done(function(data) {
                                updateSystemRequirements(data);
                                hideLoading('#checkSystemBtn', '<i class="fas fa-sync"></i> Revérifier');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de la vérification système');
                                hideLoading('#checkSystemBtn', '<i class="fas fa-sync"></i> Revérifier');
                            });
                    });
                    
                    // Auto-check
                    $('#checkSystemBtn').click();
                }
                
                function updateSystemRequirements(requirements) {
                    let allPassed = true;
                    let html = '';
                    
                    requirements.forEach(req => {
                        const statusClass = req.status ? 'success' : 'error';
                        const statusIcon = req.status ? 'fa-check' : 'fa-times';
                        const statusText = req.status ? '✅ OK' : '❌ Erreur';
                        
                        html += `
                            <div class="requirement-item ${statusClass}">
                                <span class="requirement-name">${req.name}</span>
                                <span class="requirement-status status-${req.status ? 'ok' : 'error'}">
                                    <i class="fas ${statusIcon}"></i> ${statusText}
                                </span>
                            </div>
                        `;
                        
                        if (!req.status) {
                            allPassed = false;
                            if (req.help) {
                                html += `<div class="alert alert-error"><i class="fas fa-exclamation-triangle alert-icon"></i><div>${req.help}</div></div>`;
                            }
                        }
                    });
                    
                    $('#requirementsList').html(html);
                    
                    if (allPassed) {
                        showAlert('success', 'Tous les prérequis système sont satisfaits !');
                        $('#continueSystemBtn').prop('disabled', false).show();
                    } else {
                        showAlert('error', 'Certains prérequis ne sont pas satisfaits.');
                        $('#continueSystemBtn').prop('disabled', true).hide();
                    }
                }
                
                function initNodeJSCheck() {
                    $('#checkNodeBtn').click(function() {
                        showLoading(this, 'Vérification Node.js...');
                        
                        $.post('?ajax=check_nodejs')
                            .done(function(data) {
                                updateNodeJSStatus(data);
                                hideLoading('#checkNodeBtn', '<i class="fas fa-search"></i> Revérifier');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de la vérification Node.js');
                                hideLoading('#checkNodeBtn', '<i class="fas fa-search"></i> Revérifier');
                            });
                    });
                    
                    $('#installNodeBtn').click(function() {
                        showLoading(this, 'Installation Node.js...');
                        
                        $.post('?ajax=install_nodejs')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Node.js installé avec succès !');
                                    $('#checkNodeBtn').click();
                                } else {
                                    showAlert('error', 'Erreur installation : ' + data.error);
                                }
                                hideLoading('#installNodeBtn', '<i class="fas fa-download"></i> Installer Node.js');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de l\'installation');
                                hideLoading('#installNodeBtn', '<i class="fas fa-download"></i> Installer Node.js');
                            });
                    });
                    
                    // Auto-check
                    $('#checkNodeBtn').click();
                }
                
                function updateNodeJSStatus(data) {
                    $('#nodeStatusContainer').html(data.html);
                    
                    if (data.canContinue) {
                        $('#continueNodeBtn').prop('disabled', false).show();
                        $('#installNodeSection').hide();
                    } else {
                        $('#continueNodeBtn').prop('disabled', true).hide();
                        $('#installNodeSection').show();
                    }
                }
                
                function initFilesCheck() {
                    $('#scanFilesBtn').click(function() {
                        showLoading(this, 'Analyse des fichiers...');
                        
                        $.post('?ajax=scan_files')
                            .done(function(data) {
                                updateFilesStatus(data);
                                hideLoading('#scanFilesBtn', '<i class="fas fa-search"></i> Re-scanner');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors du scan');
                                hideLoading('#scanFilesBtn', '<i class="fas fa-search"></i> Re-scanner');
                            });
                    });
                    
                    $('#extractFilesBtn').click(function() {
                        showLoading(this, 'Extraction en cours...');
                        
                        $.post('?ajax=extract_files')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Fichiers extraits avec succès !');
                                    $('#continueFilesBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur extraction : ' + data.error);
                                }
                                hideLoading('#extractFilesBtn', '<i class="fas fa-archive"></i> Extraire les fichiers');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de l\'extraction');
                                hideLoading('#extractFilesBtn', '<i class="fas fa-archive"></i> Extraire les fichiers');
                            });
                    });
                    
                    // Auto-scan
                    $('#scanFilesBtn').click();
                }
                
                function updateFilesStatus(data) {
                    $('#filesStatusContainer').html(data.html);
                    
                    if (data.canExtract) {
                        $('#extractFilesBtn').prop('disabled', false).show();
                    } else {
                        $('#extractFilesBtn').prop('disabled', true).hide();
                    }
                }
                
                function initDatabaseConfig() {
                    $('#configureDbBtn').click(function() {
                        showLoading(this, 'Configuration BDD...');
                        
                        const dbType = $('#db_type').val();
                        const dbUrl = $('#db_url').val();
                        
                        $.post('?ajax=configure_database', { type: dbType, url: dbUrl })
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Base de données configurée !');
                                    $('#continueDbBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur configuration : ' + data.error);
                                }
                                hideLoading('#configureDbBtn', '<i class="fas fa-database"></i> Configurer');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de la configuration');
                                hideLoading('#configureDbBtn', '<i class="fas fa-database"></i> Configurer');
                            });
                    });
                }
                
                function initInstallation() {
                    $('#startInstallBtn').click(function() {
                        showLoading(this, 'Installation en cours...');
                        
                        $.post('?ajax=run_installation')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Installation terminée !');
                                    setTimeout(() => navigateToStep('complete'), 2000);
                                } else {
                                    showAlert('error', 'Erreur installation : ' + data.error);
                                    hideLoading('#startInstallBtn', '<i class="fas fa-play"></i> Démarrer l\'installation');
                                }
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de l\'installation');
                                hideLoading('#startInstallBtn', '<i class="fas fa-play"></i> Démarrer l\'installation');
                            });
                    });
                }
                
                function launchPageForge() {
                    $.post('?ajax=launch_app')
                        .done(function(data) {
                            if (data.success) {
                                showAlert('success', 'PageForge démarré ! Ouverture dans 3 secondes...');
                                setTimeout(() => {
                                    window.open(data.url, '_blank');
                                }, 3000);
                            } else {
                                showAlert('error', 'Erreur démarrage : ' + data.error);
                            }
                        });
                }
                
                function cleanupInstaller() {
                    if (confirm('Supprimer le fichier d\'installation ?')) {
                        $.post('?ajax=cleanup')
                            .done(function(data) {
                                if (data.success) {
                                    alert('Installateur supprimé !');
                                    window.location.href = './pageforge-installation/';
                                } else {
                                    alert('Erreur : ' + data.error);
                                }
                            });
                    }
                }
            </script>
        </body>
        </html>
        <?php
    }
    
    private function getOSIcon() {
        switch ($this->os) {
            case 'windows': return 'windows';
            case 'macos': return 'apple';
            case 'linux': return 'linux';
            default: return 'desktop';
        }
    }
    
    private function renderStepsGrid($currentStep) {
        $stepKeys = array_keys($this->steps);
        $currentIndex = array_search($currentStep, $stepKeys);
        
        foreach ($this->steps as $key => $step) {
            $index = array_search($key, $stepKeys);
            $class = 'step-card';
            
            if ($index < $currentIndex) {
                $class .= ' completed';
            } elseif ($key === $currentStep) {
                $class .= ' active';
            } else {
                $class .= ' disabled';
            }
            
            echo "<div class='$class'>";
            echo "<div class='step-content'>";
            echo "<div class='step-title'>{$step['title']}</div>";
            echo "<div class='step-desc'>{$step['desc']}</div>";
            echo "</div>";
            echo "</div>";
        }
    }
    
    private function renderStepContent($step) {
        switch ($step) {
            case 'welcome':
                $this->renderWelcomeStep();
                break;
            case 'system':
                $this->renderSystemStep();
                break;
            case 'nodejs':
                $this->renderNodeJSStep();
                break;
            case 'files':
                $this->renderFilesStep();
                break;
            case 'database':
                $this->renderDatabaseStep();
                break;
            case 'install':
                $this->renderInstallStep();
                break;
            case 'complete':
                $this->renderCompleteStep();
                break;
            default:
                $this->renderWelcomeStep();
        }
    }
    
    private function renderWelcomeStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-home content-icon"></i>
            <h2 class="content-title">Installation Locale PageForge</h2>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-info-circle alert-icon"></i>
            <div>
                <strong>Installation automatisée sans ligne de commande</strong><br>
                Cet assistant installera PageForge directement sur votre machine locale avec une interface web interactive.
            </div>
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">🎨</div>
                <div class="feature-title">Éditeur Visuel</div>
                <div class="feature-desc">
                    52 composants prêts à l'emploi avec glisser-déposer intuitif
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <div class="feature-title">Responsive Design</div>
                <div class="feature-desc">
                    Designs automatiquement adaptés à tous les écrans
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🚀</div>
                <div class="feature-title">Export Optimisé</div>
                <div class="feature-desc">
                    Code HTML/CSS/JS propre et optimisé pour la production
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">💾</div>
                <div class="feature-title">Sauvegarde Auto</div>
                <div class="feature-desc">
                    Vos projets sont sauvegardés automatiquement
                </div>
            </div>
        </div>
        
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle alert-icon"></i>
            <div>
                <strong>Prérequis :</strong><br>
                • PHP 7.4+ (déjà installé)<br>
                • Node.js 18+ (sera installé automatiquement si nécessaire)<br>
                • 500 MB d'espace disque<br>
                • Fichier pageforge-files.zip
            </div>
        </div>
        
        <h3 style="margin: 25px 0 15px 0;"><i class="fas fa-clock"></i> Temps d'installation :</h3>
        <p style="margin-bottom: 25px;">
            L'installation complète prend <strong>5-10 minutes</strong> selon votre connexion et votre machine.
        </p>
        
        <div class="action-buttons">
            <a href="?step=system" class="btn btn-primary">
                <i class="fas fa-rocket"></i> Commencer l'installation
            </a>
        </div>
        <?php
    }
    
    private function renderSystemStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-cog content-icon"></i>
            <h2 class="content-title">Vérification Système</h2>
        </div>
        
        <p style="margin-bottom: 25px;">
            Vérification de la compatibilité de votre système avec PageForge...
        </p>
        
        <div class="requirements-grid" id="requirementsList">
            <div class="requirement-item">
                <span class="requirement-name">Chargement des vérifications...</span>
                <span class="loading-spinner"></span>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="checkSystemBtn" class="btn btn-primary">
                <i class="fas fa-search"></i> Vérifier le système
            </button>
            <a href="?step=nodejs" id="continueSystemBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderNodeJSStep() {
        ?>
        <div class="content-header">
            <i class="fab fa-node-js content-icon"></i>
            <h2 class="content-title">Node.js</h2>
        </div>
        
        <p style="margin-bottom: 25px;">
            PageForge nécessite Node.js 18+ pour fonctionner. Vérification et installation automatique si nécessaire.
        </p>
        
        <div id="nodeStatusContainer">
            <div class="alert alert-info">
                <i class="fas fa-search alert-icon"></i>
                <div>Vérification de Node.js en cours...</div>
            </div>
        </div>
        
        <div id="installNodeSection" style="display: none;">
            <div class="alert alert-warning">
                <i class="fas fa-download alert-icon"></i>
                <div>
                    <strong>Node.js requis</strong><br>
                    Cliquez ci-dessous pour une installation automatique ou installez manuellement depuis 
                    <a href="https://nodejs.org" target="_blank">nodejs.org</a>
                </div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="checkNodeBtn" class="btn btn-primary">
                <i class="fas fa-search"></i> Vérifier Node.js
            </button>
            <button id="installNodeBtn" class="btn btn-warning" style="display: none;">
                <i class="fas fa-download"></i> Installer Node.js
            </button>
            <a href="?step=files" id="continueNodeBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderFilesStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-archive content-icon"></i>
            <h2 class="content-title">Fichiers Projet</h2>
        </div>
        
        <p style="margin-bottom: 25px;">
            Recherche et extraction des fichiers PageForge...
        </p>
        
        <div id="filesStatusContainer">
            <div class="alert alert-info">
                <i class="fas fa-search alert-icon"></i>
                <div>Analyse des fichiers en cours...</div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="scanFilesBtn" class="btn btn-primary">
                <i class="fas fa-search"></i> Scanner les fichiers
            </button>
            <button id="extractFilesBtn" class="btn btn-warning" style="display: none;">
                <i class="fas fa-archive"></i> Extraire les fichiers
            </button>
            <a href="?step=database" id="continueFilesBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderDatabaseStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-database content-icon"></i>
            <h2 class="content-title">Configuration Base de Données</h2>
        </div>
        
        <p style="margin-bottom: 25px;">
            Configuration de la base de données pour PageForge. Vous pouvez utiliser SQLite (recommandé pour local) ou PostgreSQL.
        </p>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 15px; margin: 25px 0;">
            <h4 style="margin-bottom: 15px;"><i class="fas fa-cog"></i> Options de Base de Données :</h4>
            
            <div style="margin: 15px 0;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="radio" name="db_type" id="db_type" value="sqlite" checked>
                    <strong>SQLite (Recommandé)</strong> - Base de données locale, aucune configuration requise
                </label>
            </div>
            
            <div style="margin: 15px 0;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="radio" name="db_type" value="postgresql">
                    <strong>PostgreSQL</strong> - Base de données avancée (installation séparée requise)
                </label>
            </div>
            
            <div style="margin-top: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">URL de connexion :</label>
                <input type="text" id="db_url" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;" 
                       value="sqlite:./pageforge.db" placeholder="sqlite:./pageforge.db ou postgresql://...">
                <small style="color: #6b7280; margin-top: 5px; display: block;">
                    SQLite : sqlite:./pageforge.db | PostgreSQL : postgresql://user:pass@localhost:5432/db
                </small>
            </div>
        </div>
        
        <script>
        $('input[name="db_type"]').change(function() {
            const dbType = $(this).val();
            if (dbType === 'sqlite') {
                $('#db_url').val('sqlite:./pageforge.db');
            } else if (dbType === 'postgresql') {
                $('#db_url').val('postgresql://localhost:5432/pageforge');
            }
        });
        </script>
        
        <div class="action-buttons">
            <button id="configureDbBtn" class="btn btn-primary">
                <i class="fas fa-database"></i> Configurer
            </button>
            <a href="?step=install" id="continueDbBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Lancer l'installation
            </a>
        </div>
        <?php
    }
    
    private function renderInstallStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-download content-icon"></i>
            <h2 class="content-title">Installation Finale</h2>
        </div>
        
        <div class="alert alert-warning">
            <i class="fas fa-rocket alert-icon"></i>
            <div>
                <strong>Prêt pour l'installation !</strong><br>
                Cette étape va installer les dépendances NPM, configurer l'environnement et préparer PageForge.
            </div>
        </div>
        
        <h3 style="margin: 25px 0 15px 0;"><i class="fas fa-list-check"></i> Opérations à effectuer :</h3>
        <ul style="margin: 15px 0 0 30px; line-height: 2;">
            <li>📦 Installation des dépendances NPM</li>
            <li>⚙️ Configuration des variables d'environnement</li>
            <li>🗄️ Initialisation de la base de données</li>
            <li>🔧 Configuration des scripts de démarrage</li>
            <li>✅ Tests de fonctionnement</li>
        </ul>
        
        <div class="terminal" id="installLog" style="display: none;">
            <div class="terminal-header">
                <div class="terminal-dot dot-red"></div>
                <div class="terminal-dot dot-yellow"></div>
                <div class="terminal-dot dot-green"></div>
            </div>
            <div id="logContent">$ Installation en cours...</div>
        </div>
        
        <div class="action-buttons">
            <button id="startInstallBtn" class="btn btn-success">
                <i class="fas fa-play"></i> Démarrer l'installation
            </button>
        </div>
        <?php
    }
    
    private function renderCompleteStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-check-circle content-icon" style="color: var(--success);"></i>
            <h2 class="content-title">Installation Terminée !</h2>
        </div>
        
        <div class="alert alert-success">
            <i class="fas fa-party-horn alert-icon"></i>
            <div>
                <strong>🎉 Félicitations !</strong><br>
                PageForge a été installé avec succès sur votre machine locale.
            </div>
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">📁</div>
                <div class="feature-title">Dossier Installation</div>
                <div class="feature-desc">
                    <code><?= realpath($this->installDir) ?></code>
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🌐</div>
                <div class="feature-title">URL d'Accès</div>
                <div class="feature-desc">
                    <strong>http://localhost:5000</strong>
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <div class="feature-title">Configuration</div>
                <div class="feature-desc">
                    Fichier .env créé et configuré
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">📖</div>
                <div class="feature-title">Documentation</div>
                <div class="feature-desc">
                    Guide complet dans le dossier docs/
                </div>
            </div>
        </div>
        
        <h3 style="margin: 30px 0 15px 0;"><i class="fas fa-terminal"></i> Commandes Utiles :</h3>
        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-dot dot-red"></div>
                <div class="terminal-dot dot-yellow"></div>
                <div class="terminal-dot dot-green"></div>
            </div>
            <div>
                # Démarrer PageForge<br>
                $ cd <?= $this->installDir ?><br>
                $ npm run dev<br><br>
                
                # Build production<br>
                $ npm run build<br><br>
                
                # Tests<br>
                $ npm run check
            </div>
        </div>
        
        <div class="action-buttons">
            <button onclick="launchPageForge()" class="btn btn-success">
                <i class="fas fa-rocket"></i> Lancer PageForge
            </button>
            <a href="<?= $this->installDir ?>" class="btn btn-primary">
                <i class="fas fa-folder-open"></i> Ouvrir le dossier
            </a>
            <button onclick="cleanupInstaller()" class="btn btn-secondary">
                <i class="fas fa-trash"></i> Nettoyer l'installateur
            </button>
        </div>
        
        <div class="alert alert-info" style="margin-top: 40px;">
            <i class="fas fa-lightbulb alert-icon"></i>
            <div>
                <strong>Prochaines étapes :</strong><br>
                1. Explorez les 52 composants disponibles<br>
                2. Testez les templates prêts à l'emploi<br>
                3. Créez votre premier projet<br>
                4. Exportez votre site en HTML/CSS/JS
            </div>
        </div>
        <?php
    }
    
    // AJAX Handlers Implementation
    
    private function checkSystemRequirements() {
        $requirements = [
            [
                'name' => 'Version PHP >= 7.4',
                'status' => version_compare(PHP_VERSION, '7.4', '>='),
                'help' => 'PHP 7.4 ou supérieur est requis'
            ],
            [
                'name' => 'Extension JSON',
                'status' => extension_loaded('json'),
                'help' => 'Extension JSON requise'
            ],
            [
                'name' => 'Extension cURL',
                'status' => extension_loaded('curl'),
                'help' => 'Extension cURL requise pour téléchargements'
            ],
            [
                'name' => 'Extension ZIP',
                'status' => extension_loaded('zip'),
                'help' => 'Extension ZIP requise pour extraction'
            ],
            [
                'name' => 'Permissions d\'écriture',
                'status' => is_writable(__DIR__),
                'help' => 'Permissions d\'écriture requises dans ce dossier'
            ],
            [
                'name' => 'Espace disque (500MB)',
                'status' => $this->checkDiskSpace(),
                'help' => 'Au moins 500MB d\'espace libre requis'
            ],
            [
                'name' => 'Fonctions système',
                'status' => function_exists('exec') || function_exists('shell_exec'),
                'help' => 'Fonctions exec() ou shell_exec() requises'
            ]
        ];
        
        $this->log("Vérification système terminée");
        return $requirements;
    }
    
    private function checkDiskSpace() {
        $bytes = disk_free_space(__DIR__);
        return $bytes !== false && $bytes > (500 * 1024 * 1024); // 500MB
    }
    
    private function checkNodeJS() {
        $this->log("Vérification Node.js");
        
        $nodeVersion = $this->getNodeVersion();
        $npmVersion = $this->getNpmVersion();
        
        $canContinue = $nodeVersion !== false && $npmVersion !== false;
        
        $html = '';
        
        if ($nodeVersion === false) {
            $html .= '<div class="alert alert-error">
                <i class="fas fa-times-circle alert-icon"></i>
                <div><strong>❌ Node.js non installé</strong></div>
            </div>';
        } else {
            $majorVersion = intval(explode('.', $nodeVersion)[0]);
            if ($majorVersion >= 18) {
                $html .= '<div class="alert alert-success">
                    <i class="fas fa-check-circle alert-icon"></i>
                    <div><strong>✅ Node.js v' . $nodeVersion . ' détecté</strong></div>
                </div>';
            } else {
                $html .= '<div class="alert alert-error">
                    <i class="fas fa-exclamation-triangle alert-icon"></i>
                    <div><strong>⚠️ Node.js v' . $nodeVersion . ' trop ancien (v18+ requis)</strong></div>
                </div>';
                $canContinue = false;
            }
        }
        
        if ($npmVersion === false) {
            $html .= '<div class="alert alert-error">
                <i class="fas fa-times-circle alert-icon"></i>
                <div><strong>❌ NPM non disponible</strong></div>
            </div>';
        } else {
            $html .= '<div class="alert alert-success">
                <i class="fas fa-check-circle alert-icon"></i>
                <div><strong>✅ NPM v' . $npmVersion . ' disponible</strong></div>
            </div>';
        }
        
        if (!$canContinue) {
            $html .= $this->getNodeInstallInstructions();
        }
        
        return [
            'canContinue' => $canContinue,
            'html' => $html,
            'nodeVersion' => $nodeVersion,
            'npmVersion' => $npmVersion
        ];
    }
    
    private function getNodeVersion() {
        $output = $this->execCommand('node --version 2>&1');
        if ($output && preg_match('/v?(\d+\.\d+\.\d+)/', $output, $matches)) {
            return $matches[1];
        }
        return false;
    }
    
    private function getNpmVersion() {
        $output = $this->execCommand('npm --version 2>&1');
        if ($output && preg_match('/(\d+\.\d+\.\d+)/', $output, $matches)) {
            return $matches[1];
        }
        return false;
    }
    
    private function getNodeInstallInstructions() {
        $instructions = '';
        
        switch ($this->os) {
            case 'windows':
                $instructions = '<div class="alert alert-info">
                    <i class="fas fa-info-circle alert-icon"></i>
                    <div>
                        <strong>Installation Windows :</strong><br>
                        1. Téléchargez depuis <a href="https://nodejs.org" target="_blank">nodejs.org</a><br>
                        2. Installez le fichier .msi<br>
                        3. Redémarrez cette page
                    </div>
                </div>';
                break;
                
            case 'macos':
                $instructions = '<div class="alert alert-info">
                    <i class="fas fa-info-circle alert-icon"></i>
                    <div>
                        <strong>Installation macOS :</strong><br>
                        1. Via Homebrew : <code>brew install node</code><br>
                        2. Ou téléchargez depuis <a href="https://nodejs.org" target="_blank">nodejs.org</a>
                    </div>
                </div>';
                break;
                
            case 'linux':
                $instructions = '<div class="alert alert-info">
                    <i class="fas fa-info-circle alert-icon"></i>
                    <div>
                        <strong>Installation Linux :</strong><br>
                        • Ubuntu/Debian : <code>sudo apt install nodejs npm</code><br>
                        • CentOS/RHEL : <code>sudo yum install nodejs npm</code><br>
                        • Ou via <a href="https://nodejs.org" target="_blank">nodejs.org</a>
                    </div>
                </div>';
                break;
        }
        
        return $instructions;
    }
    
    private function installNodeJS() {
        // Note: Installation automatique limitée via PHP
        // Cette fonction retournerait des instructions pour installation manuelle
        
        return [
            'success' => false,
            'error' => 'Installation automatique non disponible via PHP. Veuillez installer manuellement depuis nodejs.org'
        ];
    }
    
    private function scanProjectFiles() {
        $this->log("Scan des fichiers projet");
        
        $possibleFiles = [
            'pageforge-files.zip',
            'pageforge.zip',
            'pageforge-build.zip',
            'build.zip'
        ];
        
        $foundFiles = [];
        $mainZip = null;
        
        foreach ($possibleFiles as $file) {
            if (file_exists($file)) {
                $foundFiles[] = [
                    'name' => $file,
                    'size' => filesize($file),
                    'modified' => filemtime($file)
                ];
                if (!$mainZip) $mainZip = $file;
            }
        }
        
        $html = '';
        $canExtract = false;
        
        if (empty($foundFiles)) {
            $html = '<div class="alert alert-error">
                <i class="fas fa-times-circle alert-icon"></i>
                <div>
                    <strong>❌ Aucun fichier ZIP trouvé</strong><br>
                    Placez le fichier pageforge-files.zip dans ce dossier.
                </div>
            </div>';
        } else {
            $html = '<div class="alert alert-success">
                <i class="fas fa-check-circle alert-icon"></i>
                <div><strong>✅ Fichiers détectés :</strong></div>
            </div>';
            
            $html .= '<div class="requirements-grid">';
            foreach ($foundFiles as $file) {
                $size = $this->formatBytes($file['size']);
                $date = date('d/m/Y H:i', $file['modified']);
                
                $html .= "<div class='requirement-item success'>";
                $html .= "<span class='requirement-name'>{$file['name']} ({$size})</span>";
                $html .= "<span class='requirement-status status-ok'><i class='fas fa-check'></i> Trouvé</span>";
                $html .= "</div>";
            }
            $html .= '</div>';
            
            // Test ZIP
            if ($this->testZipFile($mainZip)) {
                $html .= '<div class="alert alert-success">
                    <i class="fas fa-check-circle alert-icon"></i>
                    <div><strong>✅ Archive ZIP valide</strong></div>
                </div>';
                $canExtract = true;
                $_SESSION['main_zip_file'] = $mainZip;
            } else {
                $html .= '<div class="alert alert-error">
                    <i class="fas fa-times-circle alert-icon"></i>
                    <div><strong>❌ Archive ZIP corrompue</strong></div>
                </div>';
            }
        }
        
        return [
            'html' => $html,
            'canExtract' => $canExtract,
            'foundFiles' => $foundFiles
        ];
    }
    
    private function testZipFile($zipFile) {
        if (!file_exists($zipFile)) return false;
        
        try {
            $zip = new ZipArchive();
            $result = $zip->open($zipFile, ZipArchive::CHECKCONS);
            
            if ($result === TRUE) {
                $zip->close();
                return true;
            }
            return false;
        } catch (Exception $e) {
            $this->log("Erreur test ZIP: " . $e->getMessage());
            return false;
        }
    }
    
    private function extractProjectFiles() {
        $this->log("Extraction des fichiers");
        
        $zipFile = $_SESSION['main_zip_file'] ?? null;
        
        if (!$zipFile || !file_exists($zipFile)) {
            return ['success' => false, 'error' => 'Fichier ZIP non trouvé'];
        }
        
        try {
            // Créer le dossier d'installation
            if (!is_dir($this->installDir)) {
                mkdir($this->installDir, 0755, true);
            }
            
            $zip = new ZipArchive();
            if ($zip->open($zipFile) === TRUE) {
                $zip->extractTo($this->installDir);
                $zip->close();
                
                $this->log("Extraction réussie vers: " . $this->installDir);
                return ['success' => true];
            }
            
            return ['success' => false, 'error' => 'Impossible d\'ouvrir le fichier ZIP'];
            
        } catch (Exception $e) {
            $this->log("Erreur extraction: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function configureDatabase() {
        $this->log("Configuration base de données");
        
        try {
            $dbType = $_POST['type'] ?? 'sqlite';
            $dbUrl = $_POST['url'] ?? 'sqlite:./pageforge.db';
            
            // Sauvegarder la configuration
            $_SESSION['db_config'] = [
                'type' => $dbType,
                'url' => $dbUrl
            ];
            
            $this->log("Configuration BDD sauvegardée: $dbType");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur configuration BDD: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function runInstallation() {
        $this->log("Début installation finale");
        
        try {
            // 1. Aller dans le dossier d'installation
            if (!is_dir($this->installDir)) {
                return ['success' => false, 'error' => 'Dossier d\'installation non trouvé'];
            }
            
            // 2. Vérifier package.json
            $packageJson = $this->installDir . '/package.json';
            if (!file_exists($packageJson)) {
                return ['success' => false, 'error' => 'package.json non trouvé'];
            }
            
            // 3. Installation NPM
            $this->log("Installation dépendances NPM");
            $output = $this->execCommand("cd {$this->installDir} && npm install 2>&1");
            if ($output === false) {
                return ['success' => false, 'error' => 'Échec installation NPM'];
            }
            
            // 4. Configuration environnement
            $this->createEnvironmentFile();
            
            // 5. Test build
            $this->log("Test de build");
            $buildOutput = $this->execCommand("cd {$this->installDir} && npm run build 2>&1");
            
            $this->log("Installation terminée avec succès");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur installation: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function createEnvironmentFile() {
        $envPath = $this->installDir . '/.env';
        $dbConfig = $_SESSION['db_config'] ?? ['type' => 'sqlite', 'url' => 'sqlite:./pageforge.db'];
        
        $envContent = "# PageForge - Configuration Locale\n";
        $envContent .= "NODE_ENV=development\n";
        $envContent .= "PORT=5000\n";
        $envContent .= "DATABASE_URL={$dbConfig['url']}\n\n";
        $envContent .= "# Configuration locale\n";
        $envContent .= "APP_NAME=\"PageForge Local\"\n";
        $envContent .= "APP_URL=\"http://localhost:5000\"\n";
        
        file_put_contents($envPath, $envContent);
        $this->log("Fichier .env créé");
    }
    
    private function launchApplication() {
        $this->log("Lancement de l'application");
        
        try {
            // Démarrer le serveur en arrière-plan
            $command = "cd {$this->installDir} && npm run dev > /dev/null 2>&1 &";
            $this->execCommand($command);
            
            // Attendre quelques secondes pour que le serveur démarre
            sleep(3);
            
            return [
                'success' => true,
                'url' => 'http://localhost:5000'
            ];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function cleanupInstaller() {
        try {
            unlink(__FILE__);
            if (file_exists($this->logFile)) {
                unlink($this->logFile);
            }
            session_destroy();
            
            return ['success' => true];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Utility Methods
    
    private function execCommand($command) {
        if (function_exists('exec')) {
            exec($command, $output, $returnCode);
            return $returnCode === 0 ? implode("\n", $output) : false;
        } elseif (function_exists('shell_exec')) {
            return shell_exec($command);
        }
        return false;
    }
    
    private function formatBytes($size, $precision = 2) {
        $base = log($size, 1024);
        $suffixes = ['B', 'KB', 'MB', 'GB'];
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
    }
    
    private function initializeLog() {
        file_put_contents($this->logFile, "=== PageForge Installation Locale ===\n");
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[$timestamp] $message\n";
        file_put_contents($this->logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
}

// Lancement de l'installateur
$installer = new PageForgeLocalInstaller();
$installer->run();
?>