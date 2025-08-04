<?php
/**
 * 🚀 PAGEFORGE - INSTALLATEUR VS CODE
 * 
 * Préparation automatisée pour développement VS Code
 * Configure l'environnement de développement complet
 * 
 * UTILISATION:
 * 1. Placez ce fichier dans votre dossier de développement
 * 2. Démarrez: php -S localhost:8080
 * 3. Visitez: http://localhost:8080/install-vscode.php
 * 4. Suivez l'assistant de configuration
 * 5. Ouvrez le projet dans VS Code
 */

session_start();
header('Content-Type: text/html; charset=UTF-8');

class PageForgeVSCodeInstaller {
    private $version = '3.0.0';
    private $logFile = 'vscode-setup.log';
    private $projectDir = './pageforge-dev';
    
    private $steps = [
        'welcome' => ['title' => '💻 VS Code', 'desc' => 'Configuration développement'],
        'environment' => ['title' => '🔧 Environnement', 'desc' => 'Outils développement'],
        'project' => ['title' => '📁 Projet', 'desc' => 'Structure projet'],
        'vscode' => ['title' => '⚙️ VS Code', 'desc' => 'Configuration IDE'],
        'database' => ['title' => '🗄️ Base données', 'desc' => 'Configuration BDD'],
        'extensions' => ['title' => '🧩 Extensions', 'desc' => 'Extensions recommandées'],
        'complete' => ['title' => '✅ Prêt', 'desc' => 'Prêt pour développement']
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
        $this->log("Configuration VS Code - Étape: $step");
        
        $this->renderPage($step);
    }
    
    private function detectOS() {
        if (stripos(PHP_OS, 'WIN') === 0) {
            $this->os = 'windows';
            $this->osDetails = 'Windows ' . php_uname('r');
        } elseif (stripos(PHP_OS, 'DARWIN') === 0) {
            $this->os = 'macos';
            $this->osDetails = 'macOS ' . php_uname('r');
        } else {
            $this->os = 'linux';
            $this->osDetails = 'Linux ' . php_uname('r');
        }
    }
    
    private function handleAjaxRequests() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['ajax'])) {
            header('Content-Type: application/json');
            
            switch ($_GET['ajax']) {
                case 'check_environment':
                    echo json_encode($this->checkDevelopmentEnvironment());
                    exit;
                    
                case 'setup_project':
                    echo json_encode($this->setupProjectStructure());
                    exit;
                    
                case 'configure_vscode':
                    echo json_encode($this->configureVSCode());
                    exit;
                    
                case 'setup_database':
                    echo json_encode($this->setupDatabase());
                    exit;
                    
                case 'install_extensions':
                    echo json_encode($this->generateExtensionsFile());
                    exit;
                    
                case 'finalize_setup':
                    echo json_encode($this->finalizeSetup());
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
            <title>PageForge - Configuration VS Code</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                :root {
                    --vscode-blue: #007acc;
                    --vscode-dark: #1e1e1e;
                    --vscode-sidebar: #252526;
                    --vscode-editor: #1e1e1e;
                    --primary: var(--vscode-blue);
                    --success: #4ec9b0;
                    --warning: #ffcc02;
                    --error: #f48771;
                    --text-primary: #cccccc;
                    --text-secondary: #969696;
                    --bg-dark: #0d1117;
                    --bg-darker: #010409;
                    --gradient: linear-gradient(135deg, #0d1117 0%, #1e1e1e 50%, #007acc 100%);
                }
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: var(--gradient);
                    min-height: 100vh;
                    color: var(--text-primary);
                    line-height: 1.6;
                }
                
                .installer-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .header-card {
                    background: rgba(30, 30, 30, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0, 122, 204, 0.2);
                    border: 1px solid rgba(0, 122, 204, 0.3);
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    font-size: 3rem;
                    font-weight: 900;
                    margin-bottom: 15px;
                }
                
                .logo-pageforge {
                    background: linear-gradient(135deg, #4ec9b0, #007acc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .logo-plus {
                    color: var(--text-secondary);
                }
                
                .logo-vscode {
                    color: var(--vscode-blue);
                }
                
                .subtitle {
                    font-size: 1.4rem;
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                    font-weight: 500;
                }
                
                .dev-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--vscode-blue);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                }
                
                .progress-card {
                    background: rgba(30, 30, 30, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 8px 32px rgba(0, 122, 204, 0.2);
                    border: 1px solid rgba(0, 122, 204, 0.3);
                }
                
                .steps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .step-card {
                    background: var(--vscode-sidebar);
                    border: 2px solid #3c3c3c;
                    border-radius: 12px;
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
                    background: linear-gradient(135deg, var(--vscode-blue), #4ec9b0);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                }
                
                .step-card.active::before {
                    opacity: 1;
                }
                
                .step-card.active {
                    color: white;
                    border-color: var(--vscode-blue);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0, 122, 204, 0.4);
                }
                
                .step-card.completed {
                    background: var(--success);
                    color: white;
                    border-color: var(--success);
                }
                
                .step-card.disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                
                .step-content {
                    position: relative;
                    z-index: 2;
                }
                
                .step-title {
                    font-weight: 700;
                    font-size: 1rem;
                    margin-bottom: 8px;
                }
                
                .step-desc {
                    font-size: 0.85rem;
                    opacity: 0.9;
                }
                
                .progress-bar {
                    height: 8px;
                    background: rgba(60, 60, 60, 0.8);
                    border-radius: 6px;
                    overflow: hidden;
                    margin-top: 20px;
                    position: relative;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--vscode-blue), #4ec9b0);
                    border-radius: 6px;
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
                    background: rgba(30, 30, 30, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 8px 32px rgba(0, 122, 204, 0.2);
                    border: 1px solid rgba(0, 122, 204, 0.3);
                }
                
                .content-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 35px;
                    padding-bottom: 25px;
                    border-bottom: 2px solid #3c3c3c;
                }
                
                .content-icon {
                    font-size: 3rem;
                    color: var(--vscode-blue);
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
                    border-radius: 12px;
                    margin: 25px 0;
                    border-left: 4px solid;
                    font-weight: 500;
                    animation: slideIn 0.5s ease;
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .alert-success {
                    background: rgba(78, 201, 176, 0.15);
                    border-color: var(--success);
                    color: #7dd3fc;
                }
                
                .alert-warning {
                    background: rgba(255, 204, 2, 0.15);
                    border-color: var(--warning);
                    color: #fbbf24;
                }
                
                .alert-error {
                    background: rgba(244, 135, 113, 0.15);
                    border-color: var(--error);
                    color: #fca5a5;
                }
                
                .alert-info {
                    background: rgba(0, 122, 204, 0.15);
                    border-color: var(--vscode-blue);
                    color: #93c5fd;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 32px;
                    border: none;
                    border-radius: 10px;
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
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }
                
                .btn:hover::before {
                    left: 100%;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, var(--vscode-blue), #4ec9b0);
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 122, 204, 0.3);
                }
                
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 122, 204, 0.4);
                }
                
                .btn-success {
                    background: var(--success);
                    color: white;
                    box-shadow: 0 4px 15px rgba(78, 201, 176, 0.3);
                }
                
                .btn-warning {
                    background: var(--warning);
                    color: #000;
                    box-shadow: 0 4px 15px rgba(255, 204, 2, 0.3);
                }
                
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 40px;
                    flex-wrap: wrap;
                }
                
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                
                .feature-card {
                    background: rgba(37, 37, 38, 0.8);
                    padding: 25px;
                    border-radius: 12px;
                    border: 1px solid #3c3c3c;
                    transition: all 0.3s ease;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 122, 204, 0.2);
                    border-color: var(--vscode-blue);
                }
                
                .feature-icon {
                    font-size: 2.5rem;
                    color: var(--vscode-blue);
                    margin-bottom: 15px;
                }
                
                .feature-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: var(--text-primary);
                }
                
                .feature-desc {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                
                .code-block {
                    background: var(--vscode-editor);
                    border: 1px solid #3c3c3c;
                    border-radius: 8px;
                    padding: 20px;
                    font-family: 'Fira Code', 'Consolas', monospace;
                    font-size: 0.9rem;
                    margin: 20px 0;
                    overflow-x: auto;
                    position: relative;
                }
                
                .code-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #3c3c3c;
                }
                
                .code-title {
                    color: var(--success);
                    font-weight: 600;
                }
                
                .copy-btn {
                    background: var(--vscode-blue);
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
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
                    background: rgba(37, 37, 38, 0.6);
                    border-radius: 10px;
                    border: 1px solid #3c3c3c;
                    transition: all 0.3s ease;
                }
                
                .requirement-item.success {
                    border-color: var(--success);
                    background: rgba(78, 201, 176, 0.1);
                }
                
                .requirement-item.error {
                    border-color: var(--error);
                    background: rgba(244, 135, 113, 0.1);
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
                    background: rgba(78, 201, 176, 0.2);
                    color: var(--success);
                }
                
                .status-error {
                    background: rgba(244, 135, 113, 0.2);
                    color: var(--error);
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid var(--vscode-blue);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .extensions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 25px 0;
                }
                
                .extension-card {
                    background: rgba(37, 37, 38, 0.8);
                    border: 1px solid #3c3c3c;
                    border-radius: 10px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }
                
                .extension-card:hover {
                    border-color: var(--vscode-blue);
                    transform: translateY(-3px);
                }
                
                .extension-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                
                .extension-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    background: var(--vscode-blue);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                }
                
                .extension-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .extension-desc {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                
                .footer-card {
                    background: rgba(30, 30, 30, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    padding: 25px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0, 122, 204, 0.2);
                    border: 1px solid rgba(0, 122, 204, 0.3);
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
                        font-size: 2rem;
                        flex-direction: column;
                        gap: 10px;
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
                    <div class="logo">
                        <span class="logo-pageforge">PageForge</span>
                        <span class="logo-plus">+</span>
                        <span class="logo-vscode"><i class="fab fa-microsoft"></i> VS Code</span>
                    </div>
                    <div class="subtitle">Configuration Environnement de Développement</div>
                    <div class="dev-badge">
                        <i class="fas fa-code"></i>
                        Développement sur <?= $this->osDetails ?>
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
                        PageForge VS Code Setup v<?= $this->version ?> | 
                        Configuration optimisée pour le développement | 
                        Prêt en quelques minutes
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
                
                function showLoading(element, text = 'Configuration...') {
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
                            <i class="fas ${icons[type]}"></i>
                            <div>${message}</div>
                        </div>
                    `;
                    
                    $(container).prepend(alert);
                    
                    setTimeout(() => {
                        $('.alert').first().fadeOut(500, function() { $(this).remove(); });
                    }, 8000);
                }
                
                function navigateToStep(step) {
                    window.location.href = '?step=' + step;
                }
                
                function initializeCurrentStep() {
                    switch(currentStep) {
                        case 'environment':
                            initEnvironmentCheck();
                            break;
                        case 'project':
                            initProjectSetup();
                            break;
                        case 'vscode':
                            initVSCodeConfig();
                            break;
                        case 'database':
                            initDatabaseSetup();
                            break;
                        case 'extensions':
                            initExtensionsSetup();
                            break;
                    }
                }
                
                function initEnvironmentCheck() {
                    $('#checkEnvBtn').click(function() {
                        showLoading(this, 'Vérification environnement...');
                        
                        $.post('?ajax=check_environment')
                            .done(function(data) {
                                updateEnvironmentStatus(data);
                                hideLoading('#checkEnvBtn', '<i class="fas fa-search"></i> Revérifier');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de la vérification');
                                hideLoading('#checkEnvBtn', '<i class="fas fa-search"></i> Revérifier');
                            });
                    });
                    
                    // Auto-check
                    $('#checkEnvBtn').click();
                }
                
                function updateEnvironmentStatus(requirements) {
                    let allPassed = true;
                    let html = '';
                    
                    requirements.forEach(req => {
                        const statusClass = req.status ? 'success' : 'error';
                        const statusIcon = req.status ? 'fa-check' : 'fa-times';
                        const statusText = req.status ? '✅ OK' : '❌ Manquant';
                        
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
                                html += `<div class="alert alert-warning"><i class="fas fa-lightbulb"></i><div>${req.help}</div></div>`;
                            }
                        }
                    });
                    
                    $('#requirementsList').html(html);
                    
                    if (allPassed) {
                        showAlert('success', 'Environnement de développement prêt !');
                        $('#continueEnvBtn').prop('disabled', false).show();
                    } else {
                        showAlert('info', 'Certains outils sont recommandés mais non bloquants.');
                        $('#continueEnvBtn').prop('disabled', false).show();
                    }
                }
                
                function initProjectSetup() {
                    $('#setupProjectBtn').click(function() {
                        showLoading(this, 'Configuration projet...');
                        
                        $.post('?ajax=setup_project')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Structure projet créée !');
                                    $('#continueProjectBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur : ' + data.error);
                                }
                                hideLoading('#setupProjectBtn', '<i class="fas fa-folder"></i> Configurer le projet');
                            });
                    });
                }
                
                function initVSCodeConfig() {
                    $('#configVSCodeBtn').click(function() {
                        showLoading(this, 'Configuration VS Code...');
                        
                        $.post('?ajax=configure_vscode')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Configuration VS Code créée !');
                                    $('#continueVSCodeBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur : ' + data.error);
                                }
                                hideLoading('#configVSCodeBtn', '<i class="fas fa-cog"></i> Configurer VS Code');
                            });
                    });
                }
                
                function initDatabaseSetup() {
                    $('#setupDbBtn').click(function() {
                        showLoading(this, 'Configuration base de données...');
                        
                        $.post('?ajax=setup_database')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Base de données configurée !');
                                    $('#continueDbBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur : ' + data.error);
                                }
                                hideLoading('#setupDbBtn', '<i class="fas fa-database"></i> Configurer BDD');
                            });
                    });
                }
                
                function initExtensionsSetup() {
                    $('#generateExtBtn').click(function() {
                        showLoading(this, 'Génération liste extensions...');
                        
                        $.post('?ajax=install_extensions')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Liste d\'extensions générée !');
                                    $('#finalizeBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur : ' + data.error);
                                }
                                hideLoading('#generateExtBtn', '<i class="fas fa-puzzle-piece"></i> Générer la liste');
                            });
                    });
                    
                    $('#finalizeBtn').click(function() {
                        showLoading(this, 'Finalisation...');
                        
                        $.post('?ajax=finalize_setup')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Configuration terminée !');
                                    setTimeout(() => navigateToStep('complete'), 2000);
                                } else {
                                    showAlert('error', 'Erreur : ' + data.error);
                                    hideLoading('#finalizeBtn', '<i class="fas fa-check"></i> Finaliser');
                                }
                            });
                    });
                }
                
                function copyToClipboard(text) {
                    navigator.clipboard.writeText(text).then(function() {
                        showAlert('success', 'Copié dans le presse-papiers !');
                    });
                }
            </script>
        </body>
        </html>
        <?php
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
            case 'environment':
                $this->renderEnvironmentStep();
                break;
            case 'project':
                $this->renderProjectStep();
                break;
            case 'vscode':
                $this->renderVSCodeStep();
                break;
            case 'database':
                $this->renderDatabaseStep();
                break;
            case 'extensions':
                $this->renderExtensionsStep();
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
            <i class="fas fa-code content-icon"></i>
            <h2 class="content-title">Configuration VS Code</h2>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>Environnement de développement optimisé</strong><br>
                Cet assistant va configurer un environnement de développement complet pour PageForge avec VS Code.
            </div>
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">⚙️</div>
                <div class="feature-title">Configuration VS Code</div>
                <div class="feature-desc">
                    Settings, tasks, launch configurations et snippets personnalisés
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🧩</div>
                <div class="feature-title">Extensions Recommandées</div>
                <div class="feature-desc">
                    Liste complète des extensions pour React, TypeScript, Tailwind
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🏗️</div>
                <div class="feature-title">Structure Projet</div>
                <div class="feature-desc">
                    Organisation optimisée avec dossiers et fichiers de configuration
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <div class="feature-title">Outils Développement</div>
                <div class="feature-desc">
                    ESLint, Prettier, Debugger et scripts de développement
                </div>
            </div>
        </div>
        
        <div class="alert alert-warning">
            <i class="fas fa-lightbulb"></i>
            <div>
                <strong>Ce qui sera configuré :</strong><br>
                • Structure de projet avec .vscode/<br>
                • Configurations de debug et tasks<br>
                • Extensions recommandées<br>
                • Scripts de développement<br>
                • Configuration base de données
            </div>
        </div>
        
        <h3 style="margin: 25px 0 15px 0; color: var(--text-primary);"><i class="fas fa-clock"></i> Temps de configuration :</h3>
        <p style="margin-bottom: 25px; color: var(--text-secondary);">
            La configuration complète prend environ <strong>3-5 minutes</strong> selon les outils déjà installés.
        </p>
        
        <div class="action-buttons">
            <a href="?step=environment" class="btn btn-primary">
                <i class="fas fa-rocket"></i> Commencer la configuration
            </a>
        </div>
        <?php
    }
    
    private function renderEnvironmentStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-tools content-icon"></i>
            <h2 class="content-title">Environnement de Développement</h2>
        </div>
        
        <p style="margin-bottom: 25px; color: var(--text-secondary);">
            Vérification des outils de développement nécessaires...
        </p>
        
        <div class="requirements-grid" id="requirementsList">
            <div class="requirement-item">
                <span class="requirement-name">Chargement des vérifications...</span>
                <span class="loading-spinner"></span>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="checkEnvBtn" class="btn btn-primary">
                <i class="fas fa-search"></i> Vérifier l'environnement
            </button>
            <a href="?step=project" id="continueEnvBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderProjectStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-folder-open content-icon"></i>
            <h2 class="content-title">Structure Projet</h2>
        </div>
        
        <p style="margin-bottom: 25px; color: var(--text-secondary);">
            Configuration de la structure de projet optimisée pour le développement PageForge...
        </p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">📁</div>
                <div class="feature-title">Dossiers Sources</div>
                <div class="feature-desc">
                    client/, server/, shared/, docs/ avec organisation modulaire
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">⚙️</div>
                <div class="feature-title">Configuration</div>
                <div class="feature-desc">
                    package.json, tsconfig.json, vite.config.ts, .env
                </div>
            </div>
        </div>
        
        <div class="code-block">
            <div class="code-header">
                <span class="code-title">Structure générée :</span>
                <button class="copy-btn" onclick="copyToClipboard(`<?= addslashes($this->getProjectStructure()) ?>`)">
                    <i class="fas fa-copy"></i> Copier
                </button>
            </div>
            <pre><?= $this->getProjectStructure() ?></pre>
        </div>
        
        <div class="action-buttons">
            <button id="setupProjectBtn" class="btn btn-primary">
                <i class="fas fa-folder"></i> Configurer le projet
            </button>
            <a href="?step=vscode" id="continueProjectBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderVSCodeStep() {
        ?>
        <div class="content-header">
            <i class="fab fa-microsoft content-icon"></i>
            <h2 class="content-title">Configuration VS Code</h2>
        </div>
        
        <p style="margin-bottom: 25px; color: var(--text-secondary);">
            Génération des configurations VS Code optimisées pour PageForge...
        </p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">⚙️</div>
                <div class="feature-title">Settings.json</div>
                <div class="feature-desc">
                    Configuration optimisée pour React, TypeScript et Tailwind CSS
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🐛</div>
                <div class="feature-title">Launch.json</div>
                <div class="feature-desc">
                    Configuration de debug pour client et serveur
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <div class="feature-title">Tasks.json</div>
                <div class="feature-desc">
                    Tâches automatisées pour build, dev, test
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">📝</div>
                <div class="feature-title">Snippets</div>
                <div class="feature-desc">
                    Snippets personnalisés pour composants PageForge
                </div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="configVSCodeBtn" class="btn btn-primary">
                <i class="fas fa-cog"></i> Configurer VS Code
            </button>
            <a href="?step=database" id="continueVSCodeBtn" class="btn btn-success" style="display: none;">
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
        
        <p style="margin-bottom: 25px; color: var(--text-secondary);">
            Configuration de l'environnement de base de données pour le développement...
        </p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">🐘</div>
                <div class="feature-title">PostgreSQL Local</div>
                <div class="feature-desc">
                    Configuration pour base de données PostgreSQL locale
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🗄️</div>
                <div class="feature-title">Drizzle ORM</div>
                <div class="feature-desc">
                    Configuration Drizzle avec migrations et schémas
                </div>
            </div>
        </div>
        
        <div class="code-block">
            <div class="code-header">
                <span class="code-title">Variables d'environnement :</span>
                <button class="copy-btn" onclick="copyToClipboard('NODE_ENV=development\nDATABASE_URL=postgresql://localhost:5432/pageforge_dev\nPORT=5000')">
                    <i class="fas fa-copy"></i> Copier
                </button>
            </div>
            <pre>NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/pageforge_dev
PORT=5000</pre>
        </div>
        
        <div class="action-buttons">
            <button id="setupDbBtn" class="btn btn-primary">
                <i class="fas fa-database"></i> Configurer BDD
            </button>
            <a href="?step=extensions" id="continueDbBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderExtensionsStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-puzzle-piece content-icon"></i>
            <h2 class="content-title">Extensions VS Code</h2>
        </div>
        
        <p style="margin-bottom: 25px; color: var(--text-secondary);">
            Génération de la liste des extensions recommandées pour PageForge...
        </p>
        
        <div class="extensions-grid">
            <?php $this->renderExtensionCards(); ?>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-lightbulb"></i>
            <div>
                <strong>Installation automatique :</strong><br>
                Un fichier .vscode/extensions.json sera généré pour installer automatiquement 
                toutes les extensions recommandées lors de l'ouverture du projet.
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="generateExtBtn" class="btn btn-primary">
                <i class="fas fa-puzzle-piece"></i> Générer la liste
            </button>
            <button id="finalizeBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-check"></i> Finaliser
            </button>
        </div>
        <?php
    }
    
    private function renderCompleteStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-check-circle content-icon" style="color: var(--success);"></i>
            <h2 class="content-title">Configuration Terminée !</h2>
        </div>
        
        <div class="alert alert-success">
            <i class="fas fa-rocket"></i>
            <div>
                <strong>🎉 Excellent !</strong><br>
                Votre environnement de développement PageForge est prêt pour VS Code.
            </div>
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">📁</div>
                <div class="feature-title">Projet Configuré</div>
                <div class="feature-desc">
                    <code><?= realpath($this->projectDir) ?></code>
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">⚙️</div>
                <div class="feature-title">VS Code Ready</div>
                <div class="feature-desc">
                    Toutes les configurations sont en place
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🗄️</div>
                <div class="feature-title">Base de Données</div>
                <div class="feature-desc">
                    PostgreSQL configuré et prêt
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🧩</div>
                <div class="feature-title">Extensions</div>
                <div class="feature-desc">
                    Liste générée pour installation auto
                </div>
            </div>
        </div>
        
        <h3 style="margin: 30px 0 15px 0; color: var(--text-primary);"><i class="fas fa-rocket"></i> Prochaines étapes :</h3>
        
        <div class="code-block">
            <div class="code-header">
                <span class="code-title">Commandes pour démarrer :</span>
                <button class="copy-btn" onclick="copyToClipboard(`cd <?= $this->projectDir ?>\ncode .\nnpm install\nnpm run dev`)">
                    <i class="fas fa-copy"></i> Copier
                </button>
            </div>
            <pre># Ouvrir dans VS Code
cd <?= $this->projectDir ?>

code .

# Installer les dépendances  
npm install

# Démarrer le développement
npm run dev</pre>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>Première ouverture dans VS Code :</strong><br>
                1. VS Code proposera d'installer les extensions recommandées<br>
                2. Acceptez l'installation pour un environnement optimal<br>
                3. Les configurations de debug seront automatiquement actives
            </div>
        </div>
        
        <div class="action-buttons">
            <button onclick="openInVSCode()" class="btn btn-primary">
                <i class="fab fa-microsoft"></i> Ouvrir dans VS Code
            </button>
            <a href="<?= $this->projectDir ?>" class="btn btn-success">
                <i class="fas fa-folder-open"></i> Ouvrir le dossier
            </a>
        </div>
        
        <script>
        function openInVSCode() {
            // Tenter d'ouvrir VS Code (nécessite que code soit dans le PATH)
            if (confirm('Ouvrir le projet dans VS Code ?\n(Nécessite que VS Code soit installé et "code" dans le PATH)')) {
                showAlert('info', 'Tentative d\'ouverture de VS Code...');
                // Note: L'ouverture automatique depuis le navigateur est limitée
                // L'utilisateur devra utiliser la commande manuelle
            }
        }
        </script>
        <?php
    }
    
    // Extension cards rendering
    private function renderExtensionCards() {
        $extensions = $this->getRecommendedExtensions();
        
        foreach ($extensions as $ext) {
            echo "<div class='extension-card'>";
            echo "<div class='extension-header'>";
            echo "<div class='extension-icon'><i class='{$ext['icon']}'></i></div>";
            echo "<div class='extension-name'>{$ext['name']}</div>";
            echo "</div>";
            echo "<div class='extension-desc'>{$ext['description']}</div>";
            echo "</div>";
        }
    }
    
    private function getRecommendedExtensions() {
        return [
            [
                'id' => 'ms-vscode.vscode-typescript-next',
                'name' => 'TypeScript Importer',
                'icon' => 'fab fa-js-square',
                'description' => 'Support avancé TypeScript avec auto-imports et intellisense'
            ],
            [
                'id' => 'bradlc.vscode-tailwindcss',
                'name' => 'Tailwind CSS IntelliSense',
                'icon' => 'fas fa-palette',
                'description' => 'Autocomplétion et preview pour Tailwind CSS'
            ],
            [
                'id' => 'esbenp.prettier-vscode',
                'name' => 'Prettier',
                'icon' => 'fas fa-magic',
                'description' => 'Formatage automatique du code'
            ],
            [
                'id' => 'ms-vscode.vscode-eslint',
                'name' => 'ESLint',
                'icon' => 'fas fa-bug',
                'description' => 'Détection d\'erreurs et linting JavaScript/TypeScript'
            ],
            [
                'id' => 'formulahendry.auto-rename-tag',
                'name' => 'Auto Rename Tag',
                'icon' => 'fas fa-tag',
                'description' => 'Renommage automatique des balises HTML/JSX'
            ],
            [
                'id' => 'ms-vscode.vscode-json',
                'name' => 'JSON Tools',
                'icon' => 'fas fa-file-code',
                'description' => 'Support avancé pour fichiers JSON'
            ]
        ];
    }
    
    // AJAX Implementation Methods
    
    private function checkDevelopmentEnvironment() {
        $requirements = [
            [
                'name' => 'Node.js (18+)',
                'status' => $this->checkNodeJS(),
                'help' => 'Installez Node.js depuis nodejs.org'
            ],
            [
                'name' => 'NPM Package Manager',
                'status' => $this->checkNPM(),
                'help' => 'NPM est inclus avec Node.js'
            ],
            [
                'name' => 'Git Version Control',
                'status' => $this->checkGit(),
                'help' => 'Installez Git depuis git-scm.com'
            ],
            [
                'name' => 'VS Code Editor',
                'status' => $this->checkVSCode(),
                'help' => 'Téléchargez VS Code depuis code.visualstudio.com'
            ],
            [
                'name' => 'PostgreSQL Database',
                'status' => $this->checkPostgreSQL(),
                'help' => 'Installez PostgreSQL ou utilisez Docker'
            ]
        ];
        
        $this->log("Vérification environnement développement terminée");
        return $requirements;
    }
    
    private function checkNodeJS() {
        $output = $this->execCommand('node --version 2>&1');
        if ($output && preg_match('/v?(\d+)\./', $output, $matches)) {
            return intval($matches[1]) >= 18;
        }
        return false;
    }
    
    private function checkNPM() {
        $output = $this->execCommand('npm --version 2>&1');
        return $output !== false && !empty(trim($output));
    }
    
    private function checkGit() {
        $output = $this->execCommand('git --version 2>&1');
        return $output !== false && strpos($output, 'git version') !== false;
    }
    
    private function checkVSCode() {
        $output = $this->execCommand('code --version 2>&1');
        return $output !== false && !empty(trim($output));
    }
    
    private function checkPostgreSQL() {
        $output = $this->execCommand('psql --version 2>&1');
        return $output !== false && strpos($output, 'psql') !== false;
    }
    
    private function setupProjectStructure() {
        try {
            $this->log("Configuration structure projet");
            
            // Créer la structure de dossiers
            $this->createProjectDirectories();
            
            // Copier les fichiers sources si disponibles
            $this->copySourceFiles();
            
            // Créer les fichiers de configuration
            $this->createConfigurationFiles();
            
            $this->log("Structure projet créée avec succès");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur structure projet: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function createProjectDirectories() {
        $directories = [
            $this->projectDir,
            $this->projectDir . '/.vscode',
            $this->projectDir . '/client',
            $this->projectDir . '/client/src',
            $this->projectDir . '/client/src/components',
            $this->projectDir . '/client/src/pages',
            $this->projectDir . '/client/src/lib',
            $this->projectDir . '/server',
            $this->projectDir . '/server/routes',
            $this->projectDir . '/shared',
            $this->projectDir . '/docs',
            $this->projectDir . '/config'
        ];
        
        foreach ($directories as $dir) {
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
        }
    }
    
    private function copySourceFiles() {
        // Rechercher et copier les fichiers sources PageForge si disponibles
        $sourceFiles = [
            'package.json',
            'tsconfig.json',
            'vite.config.ts',
            'tailwind.config.ts',
            '.env.example'
        ];
        
        foreach ($sourceFiles as $file) {
            if (file_exists($file)) {
                copy($file, $this->projectDir . '/' . $file);
            }
        }
        
        // Copier les dossiers sources
        $sourceDirs = ['client', 'server', 'shared'];
        foreach ($sourceDirs as $dir) {
            if (is_dir($dir)) {
                $this->copyDirectory($dir, $this->projectDir . '/' . $dir);
            }
        }
    }
    
    private function copyDirectory($src, $dst) {
        if (!is_dir($dst)) {
            mkdir($dst, 0755, true);
        }
        
        $files = scandir($src);
        foreach ($files as $file) {
            if ($file != '.' && $file != '..') {
                if (is_dir($src . '/' . $file)) {
                    $this->copyDirectory($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
    }
    
    private function createConfigurationFiles() {
        // Créer package.json si inexistant
        if (!file_exists($this->projectDir . '/package.json')) {
            $packageJson = $this->generatePackageJson();
            file_put_contents($this->projectDir . '/package.json', $packageJson);
        }
        
        // Créer .env.development
        $envContent = $this->generateEnvFile();
        file_put_contents($this->projectDir . '/.env.development', $envContent);
        
        // Créer README.md
        $readmeContent = $this->generateReadme();
        file_put_contents($this->projectDir . '/README.md', $readmeContent);
    }
    
    private function configureVSCode() {
        try {
            $this->log("Configuration VS Code");
            
            // Créer settings.json
            $settings = $this->generateVSCodeSettings();
            file_put_contents($this->projectDir . '/.vscode/settings.json', $settings);
            
            // Créer launch.json
            $launch = $this->generateVSCodeLaunch();
            file_put_contents($this->projectDir . '/.vscode/launch.json', $launch);
            
            // Créer tasks.json
            $tasks = $this->generateVSCodeTasks();
            file_put_contents($this->projectDir . '/.vscode/tasks.json', $tasks);
            
            // Créer snippets
            $snippets = $this->generateVSCodeSnippets();
            if (!is_dir($this->projectDir . '/.vscode/snippets')) {
                mkdir($this->projectDir . '/.vscode/snippets', 0755, true);
            }
            file_put_contents($this->projectDir . '/.vscode/snippets/pageforge.code-snippets', $snippets);
            
            $this->log("Configuration VS Code créée");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur configuration VS Code: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function setupDatabase() {
        try {
            $this->log("Configuration base de données");
            
            // Créer drizzle.config.ts
            $drizzleConfig = $this->generateDrizzleConfig();
            file_put_contents($this->projectDir . '/drizzle.config.ts', $drizzleConfig);
            
            // Créer schema exemple
            $schema = $this->generateDatabaseSchema();
            file_put_contents($this->projectDir . '/shared/schema.ts', $schema);
            
            // Scripts de migration
            $migrationScript = $this->generateMigrationScript();
            file_put_contents($this->projectDir . '/scripts/migrate.ts', $migrationScript);
            
            $this->log("Configuration BDD créée");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur configuration BDD: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function generateExtensionsFile() {
        try {
            $this->log("Génération fichier extensions");
            
            $extensions = $this->getRecommendedExtensions();
            $extensionsConfig = [
                'recommendations' => array_column($extensions, 'id')
            ];
            
            $extensionsJson = json_encode($extensionsConfig, JSON_PRETTY_PRINT);
            file_put_contents($this->projectDir . '/.vscode/extensions.json', $extensionsJson);
            
            $this->log("Fichier extensions créé");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur extensions: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function finalizeSetup() {
        try {
            $this->log("Finalisation configuration");
            
            // Créer script de démarrage
            $startScript = $this->generateStartScript();
            file_put_contents($this->projectDir . '/start-dev.sh', $startScript);
            chmod($this->projectDir . '/start-dev.sh', 0755);
            
            // Créer .gitignore
            $gitignore = $this->generateGitignore();
            file_put_contents($this->projectDir . '/.gitignore', $gitignore);
            
            // Documentation développement
            $devDocs = $this->generateDevelopmentDocs();
            file_put_contents($this->projectDir . '/docs/DEVELOPMENT.md', $devDocs);
            
            $this->log("Configuration finalisée");
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur finalisation: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Configuration file generators
    
    private function generatePackageJson() {
        return json_encode([
            'name' => 'pageforge-dev',
            'version' => '1.0.0',
            'description' => 'PageForge - Éditeur visuel de sites web',
            'scripts' => [
                'dev' => 'concurrently "npm run dev:server" "npm run dev:client"',
                'dev:client' => 'cd client && vite',
                'dev:server' => 'cd server && tsx watch index.ts',
                'build' => 'npm run build:client && npm run build:server',
                'build:client' => 'cd client && vite build',
                'build:server' => 'cd server && tsc',
                'db:push' => 'drizzle-kit push:pg',
                'db:generate' => 'drizzle-kit generate:pg',
                'db:migrate' => 'tsx scripts/migrate.ts',
                'lint' => 'eslint . --ext .ts,.tsx',
                'format' => 'prettier --write .'
            ],
            'dependencies' => [
                'react' => '^18.2.0',
                'react-dom' => '^18.2.0',
                'typescript' => '^5.0.0',
                'vite' => '^4.0.0',
                'express' => '^4.18.0',
                'drizzle-orm' => '^0.28.0',
                '@neondatabase/serverless' => '^0.6.0'
            ],
            'devDependencies' => [
                '@types/react' => '^18.2.0',
                '@types/express' => '^4.17.0',
                'eslint' => '^8.0.0',
                'prettier' => '^3.0.0',
                'concurrently' => '^8.0.0',
                'tsx' => '^3.12.0'
            ]
        ], JSON_PRETTY_PRINT);
    }
    
    private function generateEnvFile() {
        return "# PageForge - Environnement de Développement
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/pageforge_dev

# Configuration développement
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=\"PageForge Dev\"

# Secrets (à configurer)
# STRIPE_SECRET_KEY=
# OPENAI_API_KEY=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
";
    }
    
    private function generateReadme() {
        return "# PageForge - Environnement de Développement

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Base de données

```bash
npm run db:push
```

## URLs

- Client: http://localhost:3000
- Serveur: http://localhost:5000
- Database: PostgreSQL local

## VS Code

Ce projet est configuré pour VS Code avec :
- Extensions recommandées
- Configurations de debug
- Tasks automatisées
- Snippets personnalisés

Ouvrez simplement le projet dans VS Code pour bénéficier de toutes les optimisations.
";
    }
    
    private function generateVSCodeSettings() {
        return json_encode([
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
            'files.associations' => [
                '*.css' => 'tailwindcss'
            ],
            'emmet.includeLanguages' => [
                'typescriptreact' => 'html'
            ]
        ], JSON_PRETTY_PRINT);
    }
    
    private function generateVSCodeLaunch() {
        return json_encode([
            'version' => '0.2.0',
            'configurations' => [
                [
                    'name' => 'Debug Server',
                    'type' => 'node',
                    'request' => 'launch',
                    'program' => '${workspaceFolder}/server/index.ts',
                    'outFiles' => ['${workspaceFolder}/server/dist/**/*.js'],
                    'runtimeArgs' => ['-r', 'tsx/cjs'],
                    'envFile' => '${workspaceFolder}/.env.development'
                ],
                [
                    'name' => 'Debug Client',
                    'type' => 'chrome',
                    'request' => 'launch',
                    'url' => 'http://localhost:3000',
                    'webRoot' => '${workspaceFolder}/client/src'
                ]
            ]
        ], JSON_PRETTY_PRINT);
    }
    
    private function generateVSCodeTasks() {
        return json_encode([
            'version' => '2.0.0',
            'tasks' => [
                [
                    'label' => 'Start Development',
                    'type' => 'shell',
                    'command' => 'npm run dev',
                    'group' => 'build',
                    'presentation' => [
                        'echo' => true,
                        'reveal' => 'always',
                        'focus' => false,
                        'panel' => 'shared'
                    ]
                ],
                [
                    'label' => 'Build Project',
                    'type' => 'shell',
                    'command' => 'npm run build',
                    'group' => [
                        'kind' => 'build',
                        'isDefault' => true
                    ]
                ],
                [
                    'label' => 'Database Push',
                    'type' => 'shell',
                    'command' => 'npm run db:push',
                    'group' => 'build'
                ]
            ]
        ], JSON_PRETTY_PRINT);
    }
    
    private function generateVSCodeSnippets() {
        return json_encode([
            'PageForge Component' => [
                'prefix' => 'pfcomponent',
                'body' => [
                    'import React from \'react\';',
                    '',
                    'interface ${1:ComponentName}Props {',
                    '  ${2:prop}: ${3:string};',
                    '}',
                    '',
                    'export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ ${2:prop} }) => {',
                    '  return (',
                    '    <div className="${4:className}">',
                    '      ${5:content}',
                    '    </div>',
                    '  );',
                    '};'
                ],
                'description' => 'Crée un composant PageForge'
            ],
            'PageForge Hook' => [
                'prefix' => 'pfhook',
                'body' => [
                    'import { useState, useEffect } from \'react\';',
                    '',
                    'export const use${1:HookName} = () => {',
                    '  const [${2:state}, set${2/(.*)/${1:/capitalize}/}] = useState(${3:initialValue});',
                    '',
                    '  useEffect(() => {',
                    '    ${4:// effect logic}',
                    '  }, []);',
                    '',
                    '  return {',
                    '    ${2:state},',
                    '    set${2/(.*)/${1:/capitalize}/}',
                    '  };',
                    '};'
                ],
                'description' => 'Crée un hook personnalisé PageForge'
            ]
        ], JSON_PRETTY_PRINT);
    }
    
    private function generateDrizzleConfig() {
        return "import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
";
    }
    
    private function generateDatabaseSchema() {
        return "import { pgTable, text, timestamp, uuid, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  userId: uuid('user_id').references(() => users.id).notNull(),
  data: json('data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Schemas Zod
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

// Types
export type User = typeof users.\$inferSelect;
export type NewUser = typeof users.\$inferInsert;
export type Project = typeof projects.\$inferSelect;
export type NewProject = typeof projects.\$inferInsert;
";
    }
    
    private function generateMigrationScript() {
        return "import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './migrations' });
  console.log('Migrations completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
";
    }
    
    private function generateStartScript() {
        return "#!/bin/bash
# Script de démarrage développement PageForge

echo \"🚀 Démarrage PageForge Development\"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo \"❌ Node.js non trouvé\"
    exit 1
fi

# Vérifier les dépendances
if [ ! -d \"node_modules\" ]; then
    echo \"📦 Installation des dépendances...\"
    npm install
fi

# Démarrer le développement
echo \"🔥 Lancement du serveur de développement...\"
npm run dev
";
    }
    
    private function generateGitignore() {
        return "# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
/build
/dist
*.tgz

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Temporary files
.tmp/
tmp/
";
    }
    
    private function generateDevelopmentDocs() {
        return "# Guide de Développement PageForge

## Architecture

PageForge utilise une architecture full-stack moderne :

- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend** : Node.js + Express + TypeScript
- **Database** : PostgreSQL + Drizzle ORM
- **Tools** : ESLint + Prettier + VS Code

## Structure du Projet

```
pageforge-dev/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   └── lib/           # Utilitaires et hooks
├── server/                # Backend Express
│   ├── routes/           # Routes API
│   └── middleware/       # Middlewares
├── shared/               # Code partagé
│   └── schema.ts         # Schémas de base de données
└── .vscode/              # Configuration VS Code
    ├── settings.json
    ├── launch.json
    ├── tasks.json
    └── extensions.json
```

## Commandes de Développement

### Démarrage
```bash
npm run dev          # Démarrer client + serveur
npm run dev:client   # Client seulement
npm run dev:server   # Serveur seulement
```

### Base de Données
```bash
npm run db:push      # Appliquer le schéma
npm run db:generate  # Générer migrations
npm run db:migrate   # Exécuter migrations
```

### Build et Deploy
```bash
npm run build        # Build production
npm run lint         # Vérifier le code
npm run format       # Formater le code
```

## Configuration VS Code

### Extensions Recommandées
- TypeScript Importer
- Tailwind CSS IntelliSense  
- Prettier
- ESLint
- Auto Rename Tag

### Debugging
- **F5** : Démarrer le debug serveur
- **Ctrl+F5** : Démarrer sans debug
- Breakpoints supportés côté serveur et client

### Tasks
- **Ctrl+Shift+P** → \"Tasks: Run Task\"
- Start Development
- Build Project
- Database Push

## Workflow de Développement

1. **Démarrage** : `npm run dev`
2. **Développement** : Modifier le code (hot reload automatique)
3. **Database** : `npm run db:push` pour les changements de schéma
4. **Tests** : Utiliser le debugger VS Code
5. **Build** : `npm run build` avant commit

## Bonnes Pratiques

### Code Style
- Utiliser TypeScript strict
- Nommer les composants en PascalCase
- Utiliser des hooks personnalisés pour la logique
- Préfixer les interfaces avec 'I' si nécessaire

### Base de Données
- Toujours utiliser les types générés par Drizzle
- Valider avec Zod avant insertion
- Utiliser les transactions pour les opérations critiques

### Performance
- Lazy loading pour les composants lourds
- Mémoisation avec React.memo si nécessaire
- Optimiser les requêtes SQL

## Debugging

### VS Code Debugger
1. Placer des breakpoints dans le code
2. Appuyer sur F5 pour démarrer le debug
3. Utiliser la console de debug pour inspecter

### Logs
- Utiliser `console.log` pour le développement
- Implémenter un système de logs pour la production

## Déploiement

Le projet est configuré pour un déploiement simple :
1. `npm run build` 
2. Uploader les fichiers sur le serveur
3. Configurer les variables d'environnement
4. Démarrer avec `npm start`
";
    }
    
    private function getProjectStructure() {
        return "pageforge-dev/
├── .vscode/                    # Configuration VS Code
│   ├── settings.json           # Paramètres de l'éditeur
│   ├── launch.json             # Configuration debug
│   ├── tasks.json              # Tâches automatisées
│   ├── extensions.json         # Extensions recommandées
│   └── snippets/               # Snippets personnalisés
├── client/                     # Frontend React
│   ├── src/
│   │   ├── components/         # Composants UI
│   │   ├── pages/              # Pages application
│   │   ├── lib/                # Utilitaires
│   │   └── styles/             # Styles globaux
│   ├── public/                 # Assets statiques
│   └── vite.config.ts          # Configuration Vite
├── server/                     # Backend Express
│   ├── routes/                 # Routes API
│   ├── middleware/             # Middlewares
│   └── index.ts                # Point d'entrée
├── shared/                     # Code partagé
│   └── schema.ts               # Schémas DB
├── docs/                       # Documentation
│   └── DEVELOPMENT.md          # Guide développement
├── config/                     # Configurations
├── scripts/                    # Scripts utilitaires
├── package.json                # Dépendances
├── tsconfig.json               # Configuration TypeScript
├── .env.development            # Variables environnement
└── README.md                   # Documentation projet";
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
    
    private function initializeLog() {
        file_put_contents($this->logFile, "=== PageForge VS Code Setup ===\n");
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[$timestamp] $message\n";
        file_put_contents($this->logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
}

// Lancement de l'installateur
$installer = new PageForgeVSCodeInstaller();
$installer->run();
?>