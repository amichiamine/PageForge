@echo off
:: Lance PowerShell avec contournement de la politique d'execution

echo Lancement PowerShell avec permissions etendues...
echo.

if exist "Quick-Install.ps1" (
    echo Lancement installation rapide PowerShell...
    powershell -ExecutionPolicy Bypass -File "Quick-Install.ps1"
) else if exist "Install-SiteJet.ps1" (
    echo Lancement installation complete PowerShell...
    powershell -ExecutionPolicy Bypass -File "Install-SiteJet.ps1"
) else (
    echo Scripts PowerShell non trouves.
    echo Utilisation du script batch...
    call install-windows.bat
)

pause