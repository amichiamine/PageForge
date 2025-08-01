import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/theme-context';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Smartphone, 
  Save, 
  Grid, 
  Monitor, 
  Bell,
  BarChart3,
  Upload,
  FileText as Template,
  Layers,
  Download,
  Palette,
  RefreshCw,
  Eye,
  Wifi,
  Server,
  Zap
} from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme, colors, updateColors, resetColors } = useTheme();
  
  const [settings, setSettings] = React.useState({
    touchOptimized: true,
    autosave: true,
    gridSnap: true,
    responsivePreview: true,
    notifications: true,
    ftpConnection: false,
    autoUpload: false
  });

  const [stats, setStats] = React.useState({
    projectsUploaded: 0,
    templatesUsed: 0,
    elementsCreated: 0,
    exportsGenerated: 0
  });

  const [ftpSettings, setFtpSettings] = React.useState({
    host: '',
    username: '',
    password: '',
    port: '21',
    directory: '/public_html'
  });

  const [showColorCustomization, setShowColorCustomization] = React.useState(false);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (colorKey: string, value: string) => {
    updateColors({ [colorKey]: value });
  };

  const handleFtpSettingChange = (key: string, value: string) => {
    setFtpSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetAllSettings = () => {
    setSettings({
      touchOptimized: true,
      autosave: true,
      gridSnap: true,
      responsivePreview: true,
      notifications: true,
      ftpConnection: false,
      autoUpload: false
    });
    setStats({
      projectsUploaded: 0,
      templatesUsed: 0,
      elementsCreated: 0,
      exportsGenerated: 0
    });
    resetColors();
  };

  const testFtpConnection = () => {
    // Simulation d'un test de connexion FTP
    console.log('Test de connexion FTP...', ftpSettings);
  };

  const colorOptions = [
    { key: 'primary', label: 'Couleur principale', value: colors.primary },
    { key: 'secondary', label: 'Couleur secondaire', value: colors.secondary },
    { key: 'accent', label: 'Couleur d\'accent', value: colors.accent },
    { key: 'background', label: 'Arrière-plan', value: colors.background },
    { key: 'surface', label: 'Surface', value: colors.surface },
    { key: 'text', label: 'Texte principal', value: colors.text },
    { key: 'textSecondary', label: 'Texte secondaire', value: colors.textSecondary },
    { key: 'border', label: 'Bordures', value: colors.border }
  ];

  return (
    <div className="min-h-screen bg-theme-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-theme-primary" />
            Paramètres
          </h1>
          <p className="text-theme-text-secondary mt-2">
            Personnalisez PageForge selon vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Thème et apparence */}
          <Card className="bg-theme-surface border-theme-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-text">
                <Palette className="h-5 w-5 text-theme-primary" />
                Thème et apparence
              </CardTitle>
              <CardDescription className="text-theme-text-secondary">
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span className="text-theme-text">Mode {theme === 'dark' ? 'sombre' : 'clair'}</span>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <Separator />

              <Button
                variant="outline"
                onClick={() => setShowColorCustomization(!showColorCustomization)}
                className="w-full border-theme-border text-theme-text hover:bg-theme-surface"
              >
                <Eye className="h-4 w-4 mr-2" />
                Personnaliser les couleurs
              </Button>

              {showColorCustomization && (
                <div className="space-y-3 bg-theme-background p-4 rounded-lg border border-theme-border">
                  <div className="grid grid-cols-2 gap-3">
                    {colorOptions.map((color) => (
                      <div key={color.key} className="space-y-1">
                        <Label className="text-xs text-theme-text-secondary">
                          {color.label}
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color.value}
                            onChange={(e) => handleColorChange(color.key, e.target.value)}
                            className="w-8 h-8 rounded border border-theme-border cursor-pointer"
                          />
                          <Input
                            value={color.value}
                            onChange={(e) => handleColorChange(color.key, e.target.value)}
                            className="text-xs bg-theme-surface border-theme-border text-theme-text"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetColors}
                    className="w-full border-theme-border text-theme-text hover:bg-theme-surface"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Réinitialiser les couleurs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Paramètres de l'éditeur */}
          <Card className="bg-theme-surface border-theme-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-text">
                <SettingsIcon className="h-5 w-5 text-theme-primary" />
                Éditeur
              </CardTitle>
              <CardDescription className="text-theme-text-secondary">
                Options de l'éditeur visuel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-theme-text">Optimisation tactile</span>
                </div>
                <Switch
                  checked={settings.touchOptimized}
                  onCheckedChange={(checked) => handleSettingChange('touchOptimized', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span className="text-theme-text">Sauvegarde automatique</span>
                </div>
                <Switch
                  checked={settings.autosave}
                  onCheckedChange={(checked) => handleSettingChange('autosave', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  <span className="text-theme-text">Alignement sur grille</span>
                </div>
                <Switch
                  checked={settings.gridSnap}
                  onCheckedChange={(checked) => handleSettingChange('gridSnap', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span className="text-theme-text">Aperçu responsive</span>
                </div>
                <Switch
                  checked={settings.responsivePreview}
                  onCheckedChange={(checked) => handleSettingChange('responsivePreview', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-theme-text">Notifications</span>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Configuration FTP */}
          <Card className="bg-theme-surface border-theme-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-text">
                <Server className="h-5 w-5 text-theme-primary" />
                Connexion FTP
              </CardTitle>
              <CardDescription className="text-theme-text-secondary">
                Configuration pour l'upload direct via FTP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-theme-text">Activer FTP</span>
                </div>
                <Switch
                  checked={settings.ftpConnection}
                  onCheckedChange={(checked) => handleSettingChange('ftpConnection', checked)}
                />
              </div>

              {settings.ftpConnection && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-theme-text">Serveur</Label>
                      <Input
                        value={ftpSettings.host}
                        onChange={(e) => handleFtpSettingChange('host', e.target.value)}
                        placeholder="ftp.monsite.com"
                        className="bg-theme-background border-theme-border text-theme-text"
                      />
                    </div>
                    <div>
                      <Label className="text-theme-text">Port</Label>
                      <Input
                        value={ftpSettings.port}
                        onChange={(e) => handleFtpSettingChange('port', e.target.value)}
                        placeholder="21"
                        className="bg-theme-background border-theme-border text-theme-text"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-theme-text">Nom d'utilisateur</Label>
                    <Input
                      value={ftpSettings.username}
                      onChange={(e) => handleFtpSettingChange('username', e.target.value)}
                      placeholder="username"
                      className="bg-theme-background border-theme-border text-theme-text"
                    />
                  </div>

                  <div>
                    <Label className="text-theme-text">Mot de passe</Label>
                    <Input
                      type="password"
                      value={ftpSettings.password}
                      onChange={(e) => handleFtpSettingChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="bg-theme-background border-theme-border text-theme-text"
                    />
                  </div>

                  <div>
                    <Label className="text-theme-text">Répertoire</Label>
                    <Input
                      value={ftpSettings.directory}
                      onChange={(e) => handleFtpSettingChange('directory', e.target.value)}
                      placeholder="/public_html"
                      className="bg-theme-background border-theme-border text-theme-text"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="text-theme-text">Upload automatique</span>
                    </div>
                    <Switch
                      checked={settings.autoUpload}
                      onCheckedChange={(checked) => handleSettingChange('autoUpload', checked)}
                    />
                  </div>

                  <Button
                    onClick={testFtpConnection}
                    className="w-full bg-theme-primary hover:bg-theme-secondary text-white"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Tester la connexion
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="bg-theme-surface border-theme-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-theme-text">
                <BarChart3 className="h-5 w-5 text-theme-primary" />
                Statistiques
              </CardTitle>
              <CardDescription className="text-theme-text-secondary">
                Vos données d'utilisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-theme-background rounded-lg border border-theme-border">
                  <Upload className="h-5 w-5 mx-auto mb-2 text-theme-primary" />
                  <div className="text-2xl font-bold text-theme-text">{stats.projectsUploaded}</div>
                  <div className="text-xs text-theme-text-secondary">Projets créés</div>
                </div>

                <div className="text-center p-3 bg-theme-background rounded-lg border border-theme-border">
                  <Template className="h-5 w-5 mx-auto mb-2 text-theme-secondary" />
                  <div className="text-2xl font-bold text-theme-text">{stats.templatesUsed}</div>
                  <div className="text-xs text-theme-text-secondary">Templates utilisés</div>
                </div>

                <div className="text-center p-3 bg-theme-background rounded-lg border border-theme-border">
                  <Layers className="h-5 w-5 mx-auto mb-2 text-theme-accent" />
                  <div className="text-2xl font-bold text-theme-text">{stats.elementsCreated}</div>
                  <div className="text-xs text-theme-text-secondary">Éléments créés</div>
                </div>

                <div className="text-center p-3 bg-theme-background rounded-lg border border-theme-border">
                  <Download className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold text-theme-text">{stats.exportsGenerated}</div>
                  <div className="text-xs text-theme-text-secondary">Exports générés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-theme-surface border-theme-border">
          <CardHeader>
            <CardTitle className="text-theme-text">Actions</CardTitle>
            <CardDescription className="text-theme-text-secondary">
              Gestion des paramètres et données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={resetAllSettings}
                variant="outline"
                className="border-theme-border text-theme-text hover:bg-theme-background"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser tout
              </Button>

              <Button className="bg-theme-primary hover:bg-theme-secondary text-white">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres
              </Button>

              <Badge variant="secondary" className="bg-theme-accent text-white">
                <Zap className="h-3 w-3 mr-1" />
                PageForge v2.0
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}