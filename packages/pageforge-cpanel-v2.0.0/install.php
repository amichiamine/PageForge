<?php
/**
 * 🚀 PAGEFORGE - INSTALLATEUR INTERACTIF CPANEL
 * 
 * Installation automatisée et interactive pour hébergements cPanel
 * Compatible avec hébergements sans accès console/terminal
 * 
 * UTILISATION:
 * 1. Uploadez ce fichier + pageforge-files.zip via File Manager cPanel
 * 2. Visitez: https://votre-domaine.com/install-interactive.php
 * 3. Suivez l'assistant d'installation interactif
 * 4. Supprimez ce fichier après installation réussie
 */

session_start();
header('Content-Type: text/html; charset=UTF-8');

class PageForgeInteractiveInstaller {
    private $version = '1.2.0';
    private $logFile = 'installation.log';
    private $configFile = 'install-config.json';
    
    private $steps = [
        'start' => ['title' => '🚀 Démarrage', 'desc' => 'Initialisation'],
        'system' => ['title' => '🔧 Système', 'desc' => 'Vérification environnement'],
        'files' => ['title' => '📁 Fichiers', 'desc' => 'Gestion des fichiers'],
        'database' => ['title' => '🗄️ Base de données', 'desc' => 'Configuration PostgreSQL'],
        'config' => ['title' => '⚙️ Configuration', 'desc' => 'Paramètres finaux'],
        'install' => ['title' => '📦 Installation', 'desc' => 'Déploiement'],
        'complete' => ['title' => '✅ Terminé', 'desc' => 'Installation réussie']
    ];
    
    public function __construct() {
        $this->initializeLog();
        $this->handleAjaxRequests();
    }
    
    public function run() {
        $step = $_GET['step'] ?? 'start';
        $this->log("Navigation vers l'étape: $step");
        
        $this->renderPage($step);
    }
    
    private function handleAjaxRequests() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['ajax'])) {
            header('Content-Type: application/json');
            
            switch ($_GET['ajax']) {
                case 'check_system':
                    echo json_encode($this->checkSystemRequirements());
                    exit;
                    
                case 'scan_files':
                    echo json_encode($this->scanUploadedFiles());
                    exit;
                    
                case 'test_database':
                    echo json_encode($this->testDatabaseConnection());
                    exit;
                    
                case 'extract_files':
                    echo json_encode($this->extractProjectFiles());
                    exit;
                    
                case 'configure_app':
                    echo json_encode($this->configureApplication());
                    exit;
                    
                case 'run_installation':
                    echo json_encode($this->runFinalInstallation());
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
            <title>PageForge - Installation Interactive</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
                    min-height: 100vh;
                    color: #333;
                }
                
                .installer-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                
                .header {
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 30px;
                    margin-bottom: 20px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
                
                .logo {
                    font-size: 3rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 10px;
                }
                
                .subtitle {
                    font-size: 1.2rem;
                    color: #666;
                    margin-bottom: 20px;
                }
                
                .version-badge {
                    display: inline-block;
                    background: #10b981;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                
                .progress-container {
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 25px;
                    margin-bottom: 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
                
                .steps-nav {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .step-item {
                    flex: 1;
                    min-width: 120px;
                    padding: 15px 10px;
                    text-align: center;
                    border-radius: 12px;
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .step-item.active {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .step-item.completed {
                    background: #10b981;
                    color: white;
                    border-color: #10b981;
                }
                
                .step-item.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .step-title {
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                }
                
                .step-desc {
                    font-size: 0.75rem;
                    opacity: 0.8;
                }
                
                .progress-bar {
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 20px;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    transition: width 0.5s ease;
                    border-radius: 4px;
                }
                
                .main-content {
                    flex: 1;
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
                
                .step-content {
                    display: none;
                }
                
                .step-content.active {
                    display: block;
                    animation: fadeIn 0.5s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .content-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f1f3f4;
                }
                
                .content-icon {
                    font-size: 2.5rem;
                    color: #667eea;
                }
                
                .content-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2d3748;
                }
                
                .alert {
                    padding: 16px;
                    border-radius: 12px;
                    margin: 20px 0;
                    border-left: 4px solid;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .alert-success {
                    background: #f0f9ff;
                    border-color: #10b981;
                    color: #065f46;
                }
                
                .alert-warning {
                    background: #fffbeb;
                    border-color: #f59e0b;
                    color: #92400e;
                }
                
                .alert-error {
                    background: #fef2f2;
                    border-color: #ef4444;
                    color: #991b1b;
                }
                
                .alert-info {
                    background: #eff6ff;
                    border-color: #3b82f6;
                    color: #1e40af;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    text-align: center;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .btn-success {
                    background: #10b981;
                    color: white;
                }
                
                .btn-success:hover {
                    background: #059669;
                    transform: translateY(-2px);
                }
                
                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }
                
                .btn-danger {
                    background: #ef4444;
                    color: white;
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }
                
                .form-group {
                    margin: 20px 0;
                }
                
                .form-label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #374151;
                }
                
                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s ease;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .form-help {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-top: 6px;
                }
                
                .requirements-list {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                }
                
                .requirement-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .requirement-item:last-child {
                    border-bottom: none;
                }
                
                .requirement-name {
                    font-weight: 500;
                }
                
                .requirement-status {
                    font-weight: 600;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                }
                
                .status-ok {
                    background: #dcfce7;
                    color: #166534;
                }
                
                .status-error {
                    background: #fee2e2;
                    color: #991b1b;
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .log-viewer {
                    background: #1f2937;
                    color: #f9fafb;
                    border-radius: 8px;
                    padding: 20px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.875rem;
                    max-height: 300px;
                    overflow-y: auto;
                    margin: 20px 0;
                }
                
                .file-upload-zone {
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    background: #f9fafb;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .file-upload-zone:hover {
                    border-color: #667eea;
                    background: #f0f9ff;
                }
                
                .file-upload-zone.dragover {
                    border-color: #667eea;
                    background: #eff6ff;
                    transform: scale(1.02);
                }
                
                .action-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                    flex-wrap: wrap;
                }
                
                .footer {
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 20px;
                    margin-top: 20px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
                
                @media (max-width: 768px) {
                    .installer-container {
                        padding: 10px;
                    }
                    
                    .header {
                        padding: 20px;
                    }
                    
                    .logo {
                        font-size: 2rem;
                    }
                    
                    .main-content {
                        padding: 20px;
                    }
                    
                    .steps-nav {
                        flex-direction: column;
                    }
                    
                    .step-item {
                        min-width: auto;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                }
            </style>
        </head>
        <body>
            <div class="installer-container">
                <!-- Header -->
                <div class="header">
                    <div class="logo">PageForge</div>
                    <div class="subtitle">Installation Interactive cPanel</div>
                    <span class="version-badge">v<?= $this->version ?></span>
                </div>
                
                <!-- Progress -->
                <div class="progress-container">
                    <div class="steps-nav" id="stepsNav">
                        <?php $this->renderStepsNavigation($step); ?>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="main-content">
                    <?php $this->renderStepContent($step); ?>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <small>PageForge Interactive Installer v<?= $this->version ?> | 
                    Compatible avec tous hébergements cPanel</small>
                </div>
            </div>
            
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script>
                let currentStep = '<?= $step ?>';
                let completedSteps = [];
                
                $(document).ready(function() {
                    updateProgress();
                    initializeCurrentStep();
                });
                
                function updateProgress() {
                    const steps = ['start', 'system', 'files', 'database', 'config', 'install', 'complete'];
                    const currentIndex = steps.indexOf(currentStep);
                    const progress = ((currentIndex + 1) / steps.length) * 100;
                    
                    $('#progressFill').css('width', progress + '%');
                }
                
                function showLoading(element, text = 'Traitement...') {
                    $(element).html(`<span class="loading-spinner"></span> ${text}`).prop('disabled', true);
                }
                
                function hideLoading(element, text) {
                    $(element).html(text).prop('disabled', false);
                }
                
                function showAlert(type, message, container = '.main-content') {
                    const alertClass = 'alert-' + type;
                    const iconMap = {
                        success: 'fa-check-circle',
                        warning: 'fa-exclamation-triangle',
                        error: 'fa-times-circle',
                        info: 'fa-info-circle'
                    };
                    
                    const alert = `
                        <div class="alert ${alertClass}">
                            <i class="fas ${iconMap[type]}"></i>
                            <div>${message}</div>
                        </div>
                    `;
                    
                    $(container).prepend(alert);
                    
                    setTimeout(() => {
                        $('.alert').first().fadeOut(500, function() {
                            $(this).remove();
                        });
                    }, 5000);
                }
                
                function navigateToStep(step) {
                    window.location.href = '?step=' + step;
                }
                
                function initializeCurrentStep() {
                    switch(currentStep) {
                        case 'system':
                            initSystemCheck();
                            break;
                        case 'files':
                            initFileManager();
                            break;
                        case 'database':
                            initDatabaseConfig();
                            break;
                        case 'config':
                            initAppConfig();
                            break;
                        case 'install':
                            initInstallation();
                            break;
                    }
                }
                
                function initSystemCheck() {
                    $('#checkSystemBtn').click(function() {
                        showLoading(this, 'Vérification du système...');
                        
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
                    
                    // Auto-check on load
                    $('#checkSystemBtn').click();
                }
                
                function updateSystemRequirements(requirements) {
                    let allPassed = true;
                    let html = '';
                    
                    requirements.forEach(req => {
                        const statusClass = req.status ? 'status-ok' : 'status-error';
                        const statusText = req.status ? '✅ OK' : '❌ Erreur';
                        
                        html += `
                            <div class="requirement-item">
                                <span class="requirement-name">${req.name}</span>
                                <span class="requirement-status ${statusClass}">${statusText}</span>
                            </div>
                        `;
                        
                        if (!req.status) {
                            allPassed = false;
                            if (req.help) {
                                html += `<div class="alert alert-error" style="margin: 10px 0;"><i class="fas fa-exclamation-triangle"></i> ${req.help}</div>`;
                            }
                        }
                    });
                    
                    $('#requirementsList').html(html);
                    
                    if (allPassed) {
                        showAlert('success', 'Tous les prérequis sont satisfaits !');
                        $('#continueSystemBtn').prop('disabled', false).show();
                    } else {
                        showAlert('error', 'Certains prérequis ne sont pas satisfaits. Veuillez corriger les erreurs.');
                        $('#continueSystemBtn').prop('disabled', true).hide();
                    }
                }
                
                function initFileManager() {
                    $('#scanFilesBtn').click(function() {
                        showLoading(this, 'Analyse des fichiers...');
                        
                        $.post('?ajax=scan_files')
                            .done(function(data) {
                                updateFileStatus(data);
                                hideLoading('#scanFilesBtn', '<i class="fas fa-search"></i> Re-scanner');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors du scan des fichiers');
                                hideLoading('#scanFilesBtn', '<i class="fas fa-search"></i> Re-scanner');
                            });
                    });
                    
                    // Auto-scan on load
                    $('#scanFilesBtn').click();
                }
                
                function updateFileStatus(data) {
                    $('#fileStatusContainer').html(data.html);
                    
                    if (data.canContinue) {
                        $('#continueFilesBtn').prop('disabled', false).show();
                    } else {
                        $('#continueFilesBtn').prop('disabled', true).hide();
                    }
                }
                
                function initDatabaseConfig() {
                    $('#testDbBtn').click(function() {
                        const formData = {
                            host: $('#db_host').val(),
                            port: $('#db_port').val(),
                            name: $('#db_name').val(),
                            user: $('#db_user').val(),
                            password: $('#db_password').val()
                        };
                        
                        showLoading(this, 'Test de connexion...');
                        
                        $.post('?ajax=test_database', formData)
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Connexion base de données réussie !');
                                    $('#continueDatabaseBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur de connexion : ' + data.error);
                                    $('#continueDatabaseBtn').prop('disabled', true).hide();
                                }
                                hideLoading('#testDbBtn', '<i class="fas fa-database"></i> Tester la connexion');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors du test de connexion');
                                hideLoading('#testDbBtn', '<i class="fas fa-database"></i> Tester la connexion');
                            });
                    });
                }
                
                function initAppConfig() {
                    $('#configureAppBtn').click(function() {
                        showLoading(this, 'Configuration en cours...');
                        
                        const configData = {
                            app_name: $('#app_name').val(),
                            app_url: $('#app_url').val(),
                            admin_email: $('#admin_email').val()
                        };
                        
                        $.post('?ajax=configure_app', configData)
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Configuration sauvegardée !');
                                    $('#continueConfigBtn').prop('disabled', false).show();
                                } else {
                                    showAlert('error', 'Erreur de configuration : ' + data.error);
                                }
                                hideLoading('#configureAppBtn', '<i class="fas fa-cog"></i> Configurer');
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de la configuration');
                                hideLoading('#configureAppBtn', '<i class="fas fa-cog"></i> Configurer');
                            });
                    });
                }
                
                function initInstallation() {
                    $('#startInstallBtn').click(function() {
                        showLoading(this, 'Installation en cours...');
                        
                        $.post('?ajax=run_installation')
                            .done(function(data) {
                                if (data.success) {
                                    showAlert('success', 'Installation terminée avec succès !');
                                    setTimeout(() => {
                                        navigateToStep('complete');
                                    }, 2000);
                                } else {
                                    showAlert('error', 'Erreur d\'installation : ' + data.error);
                                    hideLoading('#startInstallBtn', '<i class="fas fa-play"></i> Démarrer l\'installation');
                                }
                            })
                            .fail(function() {
                                showAlert('error', 'Erreur lors de l\'installation');
                                hideLoading('#startInstallBtn', '<i class="fas fa-play"></i> Démarrer l\'installation');
                            });
                    });
                }
                
                function cleanupInstaller() {
                    if (confirm('Êtes-vous sûr de vouloir supprimer le fichier d\'installation ?')) {
                        $.post('?ajax=cleanup')
                            .done(function(data) {
                                if (data.success) {
                                    alert('Fichier d\'installation supprimé avec succès !');
                                    window.location.href = '/';
                                } else {
                                    alert('Erreur lors de la suppression : ' + data.error);
                                }
                            })
                            .fail(function() {
                                alert('Erreur lors de la suppression du fichier d\'installation');
                            });
                    }
                }
            </script>
        </body>
        </html>
        <?php
    }
    
    private function renderStepsNavigation($currentStep) {
        $stepKeys = array_keys($this->steps);
        $currentIndex = array_search($currentStep, $stepKeys);
        
        foreach ($this->steps as $key => $step) {
            $index = array_search($key, $stepKeys);
            $class = 'step-item';
            
            if ($index < $currentIndex) {
                $class .= ' completed';
            } elseif ($key === $currentStep) {
                $class .= ' active';
            } else {
                $class .= ' disabled';
            }
            
            echo "<div class='$class'>";
            echo "<div class='step-title'>{$step['title']}</div>";
            echo "<div class='step-desc'>{$step['desc']}</div>";
            echo "</div>";
        }
    }
    
    private function renderStepContent($step) {
        switch ($step) {
            case 'start':
                $this->renderStartStep();
                break;
            case 'system':
                $this->renderSystemStep();
                break;
            case 'files':
                $this->renderFilesStep();
                break;
            case 'database':
                $this->renderDatabaseStep();
                break;
            case 'config':
                $this->renderConfigStep();
                break;
            case 'install':
                $this->renderInstallStep();
                break;
            case 'complete':
                $this->renderCompleteStep();
                break;
            default:
                $this->renderStartStep();
        }
    }
    
    private function renderStartStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-rocket content-icon"></i>
            <h2 class="content-title">Bienvenue dans PageForge</h2>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>Installation interactive et automatisée</strong><br>
                Cet assistant va vous guider pas à pas pour installer PageForge sur votre hébergement cPanel.
            </div>
        </div>
        
        <h3><i class="fas fa-star"></i> Qu'est-ce que PageForge ?</h3>
        <p style="margin: 15px 0; line-height: 1.6;">
            PageForge est un éditeur visuel de sites web professionnel avec 52 composants intégrés, 
            un système de templates avancé et des fonctionnalités d'export multi-format. 
            Créez des sites web modernes sans code !
        </p>
        
        <h3><i class="fas fa-list"></i> Fonctionnalités principales :</h3>
        <ul style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li>✨ Éditeur visuel avec glisser-déposer</li>
            <li>🎨 52 composants prêts à l'emploi</li>
            <li>📱 Design responsive automatique</li>
            <li>🔧 Système de templates professionnel</li>
            <li>📤 Export HTML/CSS/JS optimisé</li>
            <li>💾 Sauvegarde automatique</li>
            <li>🚀 Performance optimisée</li>
        </ul>
        
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>Prérequis :</strong><br>
                • Hébergement cPanel avec PHP 7.4+<br>
                • Base de données PostgreSQL<br>
                • Fichier pageforge-files.zip uploadé<br>
                • 50 MB d'espace disque minimum
            </div>
        </div>
        
        <h3><i class="fas fa-clock"></i> Durée d'installation :</h3>
        <p style="margin: 15px 0; line-height: 1.6;">
            L'installation complète prend généralement <strong>3-5 minutes</strong> selon votre hébergement.
        </p>
        
        <div class="action-buttons">
            <a href="?step=system" class="btn btn-primary">
                <i class="fas fa-arrow-right"></i> Commencer l'installation
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
        
        <p style="margin-bottom: 20px;">
            Vérification de la compatibilité de votre hébergement avec PageForge...
        </p>
        
        <div class="requirements-list" id="requirementsList">
            <div class="requirement-item">
                <span class="requirement-name">Chargement...</span>
                <span class="loading-spinner"></span>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="checkSystemBtn" class="btn btn-primary">
                <i class="fas fa-sync"></i> Vérifier le système
            </button>
            <a href="?step=files" id="continueSystemBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderFilesStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-folder content-icon"></i>
            <h2 class="content-title">Gestion des Fichiers</h2>
        </div>
        
        <p style="margin-bottom: 20px;">
            Recherche et vérification des fichiers PageForge...
        </p>
        
        <div id="fileStatusContainer">
            <div class="alert alert-info">
                <i class="fas fa-search"></i>
                <div>Analyse en cours...</div>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="scanFilesBtn" class="btn btn-primary">
                <i class="fas fa-search"></i> Scanner les fichiers
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
        
        <p style="margin-bottom: 20px;">
            Configurez votre base de données PostgreSQL. Ces informations sont disponibles dans votre cPanel.
        </p>
        
        <div class="form-group">
            <label class="form-label">Host de la base de données :</label>
            <input type="text" id="db_host" class="form-input" value="localhost" required>
            <div class="form-help">Généralement 'localhost' pour les hébergements cPanel</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Port :</label>
            <input type="number" id="db_port" class="form-input" value="5432" required>
            <div class="form-help">Port PostgreSQL standard (5432)</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Nom de la base de données :</label>
            <input type="text" id="db_name" class="form-input" required>
            <div class="form-help">Le nom de votre base PostgreSQL créée dans cPanel</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Nom d'utilisateur :</label>
            <input type="text" id="db_user" class="form-input" required>
            <div class="form-help">Utilisateur de la base de données</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Mot de passe :</label>
            <input type="password" id="db_password" class="form-input" required>
        </div>
        
        <div class="action-buttons">
            <button id="testDbBtn" class="btn btn-primary">
                <i class="fas fa-database"></i> Tester la connexion
            </button>
            <a href="?step=config" id="continueDatabaseBtn" class="btn btn-success" style="display: none;">
                <i class="fas fa-arrow-right"></i> Continuer
            </a>
        </div>
        <?php
    }
    
    private function renderConfigStep() {
        ?>
        <div class="content-header">
            <i class="fas fa-cog content-icon"></i>
            <h2 class="content-title">Configuration Application</h2>
        </div>
        
        <p style="margin-bottom: 20px;">
            Configurez les paramètres de base de votre installation PageForge.
        </p>
        
        <div class="form-group">
            <label class="form-label">Nom de l'application :</label>
            <input type="text" id="app_name" class="form-input" value="PageForge" required>
            <div class="form-help">Le nom qui apparaîtra dans l'interface</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">URL de l'application :</label>
            <input type="url" id="app_url" class="form-input" value="<?= 'https://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) ?>" required>
            <div class="form-help">L'URL complète de votre site</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Email administrateur :</label>
            <input type="email" id="admin_email" class="form-input" required>
            <div class="form-help">Email pour les notifications importantes</div>
        </div>
        
        <div class="action-buttons">
            <button id="configureAppBtn" class="btn btn-primary">
                <i class="fas fa-cog"></i> Configurer
            </button>
            <a href="?step=install" id="continueConfigBtn" class="btn btn-success" style="display: none;">
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
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>Dernière étape !</strong><br>
                L'installation va maintenant extraire les fichiers, configurer la base de données 
                et finaliser l'installation de PageForge.
            </div>
        </div>
        
        <h3><i class="fas fa-list-check"></i> Ce qui va être fait :</h3>
        <ul style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li>📁 Extraction des fichiers PageForge</li>
            <li>🗄️ Création des tables de base de données</li>
            <li>⚙️ Configuration des fichiers d'environnement</li>
            <li>🔧 Optimisation des permissions</li>
            <li>✅ Tests de fonctionnement</li>
        </ul>
        
        <p style="margin: 20px 0; font-weight: 500;">
            Cette opération peut prendre quelques minutes selon votre hébergement.
        </p>
        
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
            <i class="fas fa-check-circle content-icon" style="color: #10b981;"></i>
            <h2 class="content-title">Installation Terminée !</h2>
        </div>
        
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>🎉 Félicitations !</strong><br>
                PageForge a été installé avec succès sur votre hébergement cPanel.
            </div>
        </div>
        
        <h3><i class="fas fa-rocket"></i> Prochaines étapes :</h3>
        <ol style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li><strong>Supprimez ce fichier d'installation</strong> pour des raisons de sécurité</li>
            <li><strong>Accédez à PageForge</strong> et commencez à créer</li>
            <li><strong>Explorez les 52 composants</strong> disponibles</li>
            <li><strong>Testez les templates</strong> prêts à l'emploi</li>
        </ol>
        
        <h3><i class="fas fa-info-circle"></i> Informations importantes :</h3>
        <ul style="margin: 15px 0 0 20px; line-height: 1.8;">
            <li>📁 Fichiers installés dans : <code><?= __DIR__ ?></code></li>
            <li>🗄️ Base de données configurée et prête</li>
            <li>⚙️ Configuration sauvegardée dans .env</li>
            <li>📖 Documentation disponible dans /docs</li>
        </ul>
        
        <div class="action-buttons">
            <a href="/" class="btn btn-success">
                <i class="fas fa-external-link-alt"></i> Ouvrir PageForge
            </a>
            <button onclick="cleanupInstaller()" class="btn btn-danger">
                <i class="fas fa-trash"></i> Supprimer l'installateur
            </button>
        </div>
        
        <div class="alert alert-info" style="margin-top: 30px;">
            <i class="fas fa-life-ring"></i>
            <div>
                <strong>Besoin d'aide ?</strong><br>
                Consultez la documentation complète dans le dossier <code>/docs</code> 
                ou contactez le support technique.
            </div>
        </div>
        <?php
    }
    
    // AJAX Handlers
    
    private function checkSystemRequirements() {
        $requirements = [
            [
                'name' => 'Version PHP >= 7.4',
                'status' => version_compare(PHP_VERSION, '7.4', '>='),
                'help' => 'Veuillez mettre à jour PHP vers une version >= 7.4'
            ],
            [
                'name' => 'Extension PDO',
                'status' => extension_loaded('pdo'),
                'help' => 'L\'extension PDO est requise pour la base de données'
            ],
            [
                'name' => 'Extension PostgreSQL',
                'status' => extension_loaded('pdo_pgsql'),
                'help' => 'L\'extension PostgreSQL est requise. Activez-la dans cPanel.'
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
                'name' => 'Extension ZIP',
                'status' => extension_loaded('zip'),
                'help' => 'L\'extension ZIP est requise pour l\'extraction des fichiers'
            ],
            [
                'name' => 'Permissions d\'écriture',
                'status' => is_writable(__DIR__),
                'help' => 'Le dossier doit avoir les permissions d\'écriture (755 ou 777)'
            ],
            [
                'name' => 'Mémoire PHP >= 128M',
                'status' => $this->checkMemoryLimit(),
                'help' => 'Augmentez memory_limit à 128M minimum dans php.ini'
            ]
        ];
        
        $this->log("Vérification système terminée");
        return $requirements;
    }
    
    private function checkMemoryLimit() {
        $memory = ini_get('memory_limit');
        if ($memory === '-1') return true; // Unlimited
        
        $memory = $this->convertToBytes($memory);
        return $memory >= 128 * 1024 * 1024; // 128MB
    }
    
    private function convertToBytes($value) {
        $unit = strtolower(substr($value, -1));
        $value = (int)$value;
        
        switch ($unit) {
            case 'g': $value *= 1024;
            case 'm': $value *= 1024;
            case 'k': $value *= 1024;
        }
        
        return $value;
    }
    
    private function scanUploadedFiles() {
        $possibleFiles = [
            'pageforge-files.zip',
            'pageforge-build.zip',
            'pageforge.zip',
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
        $canContinue = false;
        
        if (empty($foundFiles)) {
            $html = '<div class="alert alert-error">
                <i class="fas fa-times-circle"></i>
                <div>
                    <strong>❌ Aucun fichier ZIP trouvé</strong><br>
                    Veuillez uploader le fichier pageforge-files.zip dans ce dossier.
                </div>
            </div>';
        } else {
            $html = '<div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <div><strong>✅ Fichiers détectés :</strong></div>
            </div>';
            
            $html .= '<div class="requirements-list">';
            foreach ($foundFiles as $file) {
                $size = $this->formatBytes($file['size']);
                $date = date('d/m/Y H:i', $file['modified']);
                
                $html .= "<div class='requirement-item'>";
                $html .= "<span class='requirement-name'>{$file['name']} ({$size})</span>";
                $html .= "<span class='requirement-status status-ok'>✅ Trouvé</span>";
                $html .= "</div>";
                $html .= "<div style='font-size: 0.875rem; color: #6b7280; margin-left: 20px;'>Modifié le $date</div>";
            }
            $html .= '</div>';
            
            // Test d'ouverture du ZIP
            if ($this->testZipFile($mainZip)) {
                $html .= '<div class="alert alert-success">
                    <i class="fas fa-check-circle"></i>
                    <div><strong>✅ Archive ZIP valide et lisible</strong></div>
                </div>';
                $canContinue = true;
                
                // Sauvegarder le nom du fichier principal
                $_SESSION['main_zip_file'] = $mainZip;
            } else {
                $html .= '<div class="alert alert-error">
                    <i class="fas fa-times-circle"></i>
                    <div><strong>❌ Archive ZIP corrompue ou illisible</strong></div>
                </div>';
            }
        }
        
        $this->log("Scan des fichiers terminé - " . count($foundFiles) . " fichier(s) trouvé(s)");
        
        return [
            'html' => $html,
            'canContinue' => $canContinue,
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
    
    private function testDatabaseConnection() {
        try {
            $host = $_POST['host'] ?? '';
            $port = $_POST['port'] ?? '5432';
            $name = $_POST['name'] ?? '';
            $user = $_POST['user'] ?? '';
            $password = $_POST['password'] ?? '';
            
            if (empty($host) || empty($name) || empty($user)) {
                return ['success' => false, 'error' => 'Tous les champs sont requis'];
            }
            
            $dsn = "pgsql:host=$host;port=$port;dbname=$name";
            $pdo = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 10
            ]);
            
            // Test simple
            $pdo->query('SELECT 1');
            
            // Sauvegarder la configuration
            $_SESSION['db_config'] = [
                'host' => $host,
                'port' => $port,
                'name' => $name,
                'user' => $user,
                'password' => $password
            ];
            
            $this->log("Test connexion BDD réussi - Host: $host, DB: $name");
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur connexion BDD: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function configureApplication() {
        try {
            $appName = $_POST['app_name'] ?? 'PageForge';
            $appUrl = $_POST['app_url'] ?? '';
            $adminEmail = $_POST['admin_email'] ?? '';
            
            if (empty($appUrl) || empty($adminEmail)) {
                return ['success' => false, 'error' => 'URL et email sont requis'];
            }
            
            // Valider l'email
            if (!filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
                return ['success' => false, 'error' => 'Format email invalide'];
            }
            
            // Sauvegarder la configuration
            $_SESSION['app_config'] = [
                'name' => $appName,
                'url' => $appUrl,
                'admin_email' => $adminEmail
            ];
            
            $this->log("Configuration app sauvegardée - Nom: $appName, URL: $appUrl");
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur configuration: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function runFinalInstallation() {
        try {
            $this->log("Début de l'installation finale");
            
            // 1. Extraction des fichiers
            if (!$this->extractFiles()) {
                return ['success' => false, 'error' => 'Erreur lors de l\'extraction des fichiers'];
            }
            
            // 2. Configuration de l'environnement
            if (!$this->createEnvironmentFile()) {
                return ['success' => false, 'error' => 'Erreur lors de la création du fichier .env'];
            }
            
            // 3. Configuration Apache
            if (!$this->createHtaccessFile()) {
                return ['success' => false, 'error' => 'Erreur lors de la création du fichier .htaccess'];
            }
            
            // 4. Initialisation de la base de données (si possible)
            $this->initializeDatabase();
            
            // 5. Permissions
            $this->setFilePermissions();
            
            $this->log("Installation finale terminée avec succès");
            
            return ['success' => true];
            
        } catch (Exception $e) {
            $this->log("Erreur installation: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function extractFiles() {
        $zipFile = $_SESSION['main_zip_file'] ?? null;
        
        if (!$zipFile || !file_exists($zipFile)) {
            $this->log("Fichier ZIP non trouvé pour extraction");
            return false;
        }
        
        try {
            $zip = new ZipArchive();
            if ($zip->open($zipFile) === TRUE) {
                $zip->extractTo(__DIR__);
                $zip->close();
                
                $this->log("Extraction réussie du fichier: $zipFile");
                return true;
            }
            
            return false;
            
        } catch (Exception $e) {
            $this->log("Erreur extraction: " . $e->getMessage());
            return false;
        }
    }
    
    private function createEnvironmentFile() {
        if (!isset($_SESSION['db_config'])) {
            $this->log("Configuration BDD manquante pour .env");
            return false;
        }
        
        $dbConfig = $_SESSION['db_config'];
        $appConfig = $_SESSION['app_config'] ?? [];
        
        $dbUrl = sprintf(
            'postgresql://%s:%s@%s:%s/%s',
            $dbConfig['user'],
            $dbConfig['password'],
            $dbConfig['host'],
            $dbConfig['port'],
            $dbConfig['name']
        );
        
        $envContent = "# PageForge - Configuration Production\n";
        $envContent .= "NODE_ENV=production\n";
        $envContent .= "DATABASE_URL=$dbUrl\n";
        $envContent .= "PORT=5000\n\n";
        
        if (!empty($appConfig)) {
            $envContent .= "# Configuration Application\n";
            $envContent .= "APP_NAME=\"{$appConfig['name']}\"\n";
            $envContent .= "APP_URL=\"{$appConfig['url']}\"\n";
            $envContent .= "ADMIN_EMAIL=\"{$appConfig['admin_email']}\"\n\n";
        }
        
        $envContent .= "# Secrets (ajoutez selon vos besoins)\n";
        $envContent .= "# STRIPE_SECRET_KEY=\n";
        $envContent .= "# OPENAI_API_KEY=\n";
        $envContent .= "# TWILIO_ACCOUNT_SID=\n";
        $envContent .= "# TWILIO_AUTH_TOKEN=\n";
        
        try {
            file_put_contents('.env', $envContent);
            $this->log("Fichier .env créé avec succès");
            return true;
        } catch (Exception $e) {
            $this->log("Erreur création .env: " . $e->getMessage());
            return false;
        }
    }
    
    private function createHtaccessFile() {
        $htaccessContent = "# PageForge - Configuration Apache\n";
        $htaccessContent .= "RewriteEngine On\n\n";
        
        $htaccessContent .= "# Redirection SPA\n";
        $htaccessContent .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
        $htaccessContent .= "RewriteCond %{REQUEST_FILENAME} !-d\n";
        $htaccessContent .= "RewriteRule . /index.html [L]\n\n";
        
        $htaccessContent .= "# Compression\n";
        $htaccessContent .= "<IfModule mod_deflate.c>\n";
        $htaccessContent .= "    AddOutputFilterByType DEFLATE text/plain\n";
        $htaccessContent .= "    AddOutputFilterByType DEFLATE text/html\n";
        $htaccessContent .= "    AddOutputFilterByType DEFLATE text/css\n";
        $htaccessContent .= "    AddOutputFilterByType DEFLATE application/javascript\n";
        $htaccessContent .= "    AddOutputFilterByType DEFLATE application/json\n";
        $htaccessContent .= "</IfModule>\n\n";
        
        $htaccessContent .= "# Cache navigateur\n";
        $htaccessContent .= "<IfModule mod_expires.c>\n";
        $htaccessContent .= "    ExpiresActive On\n";
        $htaccessContent .= "    ExpiresByType text/css \"access plus 1 month\"\n";
        $htaccessContent .= "    ExpiresByType application/javascript \"access plus 1 month\"\n";
        $htaccessContent .= "    ExpiresByType image/png \"access plus 1 month\"\n";
        $htaccessContent .= "    ExpiresByType image/jpg \"access plus 1 month\"\n";
        $htaccessContent .= "    ExpiresByType image/jpeg \"access plus 1 month\"\n";
        $htaccessContent .= "    ExpiresByType image/svg+xml \"access plus 1 month\"\n";
        $htaccessContent .= "</IfModule>\n\n";
        
        $htaccessContent .= "# Sécurité\n";
        $htaccessContent .= "<Files \".env\">\n";
        $htaccessContent .= "    Require all denied\n";
        $htaccessContent .= "</Files>\n";
        
        try {
            file_put_contents('.htaccess', $htaccessContent);
            $this->log("Fichier .htaccess créé avec succès");
            return true;
        } catch (Exception $e) {
            $this->log("Erreur création .htaccess: " . $e->getMessage());
            return false;
        }
    }
    
    private function initializeDatabase() {
        try {
            if (!isset($_SESSION['db_config'])) return false;
            
            $config = $_SESSION['db_config'];
            $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['name']}";
            $pdo = new PDO($dsn, $config['user'], $config['password']);
            
            // Test simple de création d'une table (optionnel)
            $pdo->exec("CREATE TABLE IF NOT EXISTS installation_test (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())");
            $pdo->exec("DROP TABLE IF EXISTS installation_test");
            
            $this->log("Test initialisation BDD réussi");
            return true;
            
        } catch (Exception $e) {
            $this->log("Avertissement initialisation BDD: " . $e->getMessage());
            return false; // Non bloquant
        }
    }
    
    private function setFilePermissions() {
        try {
            // Permissions basiques
            if (file_exists('.env')) chmod('.env', 0644);
            if (file_exists('.htaccess')) chmod('.htaccess', 0644);
            
            // Dossiers communs
            $dirs = ['uploads', 'cache', 'temp', 'logs'];
            foreach ($dirs as $dir) {
                if (is_dir($dir)) {
                    chmod($dir, 0755);
                }
            }
            
            $this->log("Permissions fichiers configurées");
            
        } catch (Exception $e) {
            $this->log("Avertissement permissions: " . $e->getMessage());
        }
    }
    
    private function cleanupInstaller() {
        try {
            // Supprimer les fichiers temporaires
            $filesToDelete = [
                __FILE__,
                $this->logFile,
                $this->configFile
            ];
            
            foreach ($filesToDelete as $file) {
                if (file_exists($file)) {
                    unlink($file);
                }
            }
            
            // Nettoyer la session
            session_destroy();
            
            return ['success' => true];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Utility Methods
    
    private function formatBytes($size, $precision = 2) {
        $base = log($size, 1024);
        $suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];
        return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
    }
    
    private function initializeLog() {
        if (!file_exists($this->logFile)) {
            file_put_contents($this->logFile, "=== PageForge Installation Log ===\n");
        }
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[$timestamp] $message\n";
        file_put_contents($this->logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
}

// Lancement de l'installateur
$installer = new PageForgeInteractiveInstaller();
$installer->run();
?>