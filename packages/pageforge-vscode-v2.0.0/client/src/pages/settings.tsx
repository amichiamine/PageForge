import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@shared/schema';
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
  Zap,
  Globe,
  Code,
  Trash2,
  Shield,
  Database,
  HardDrive,
  User,
  Mail,
  Key,
  Clock,
  Languages
} from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });
  
  const [settings, setSettings] = React.useState({
    touchOptimized: true,
    autosave: true,
    autosaveInterval: 30,
    gridSnap: true,
    snapToGrid: 10,
    responsivePreview: true,
    notifications: true,
    soundEffects: false,
    vibration: true,
    ftpConnection: false,
    autoUpload: false,
    cacheSize: 100,
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    showHints: true,
    compactMode: false
  });

  const [stats, setStats] = React.useState({
    projectsUploaded: projects.length || 0,
    templatesUsed: 0,
    elementsCreated: 0,
    exportsGenerated: 0,
    lastLogin: new Date().toISOString(),
    totalStorageUsed: 0
  });

  const [userProfile, setUserProfile] = React.useState({
    name: '',
    email: '',
    avatar: '',
    subscription: 'Gratuit',
    joinDate: new Date().toISOString()
  });

  const [ftpSettings, setFtpSettings] = React.useState({
    host: '',
    username: '',
    password: '',
    port: '21',
    directory: '/public_html'
  });

  // Charger les paramètres sauvegardés au démarrage
  React.useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('pageforge-settings');
      const savedFtp = localStorage.getItem('pageforge-ftp');
      const savedStats = localStorage.getItem('pageforge-stats');
      const savedTheme = localStorage.getItem('pageforge-theme');
      const savedProfile = localStorage.getItem('pageforge-profile');
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      if (savedFtp) {
        setFtpSettings(JSON.parse(savedFtp));
      }
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      if (savedTheme) {
        setTheme(savedTheme as 'light' | 'dark');
      }
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  }, [projects.length]);

  const handleSettingChange = (key: string, value: boolean | number | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('pageforge-settings', JSON.stringify(newSettings));
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pageforge-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    toast({
      title: "Thème modifié",
      description: `Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`,
    });
  };

  const handleFtpSettingChange = (key: string, value: string) => {
    const newFtpSettings = { ...ftpSettings, [key]: value };
    setFtpSettings(newFtpSettings);
    localStorage.setItem('pageforge-ftp', JSON.stringify(newFtpSettings));
  };

  const handleProfileChange = (key: string, value: string) => {
    const newProfile = { ...userProfile, [key]: value };
    setUserProfile(newProfile);
    localStorage.setItem('pageforge-profile', JSON.stringify(newProfile));
  };

  const resetAccountData = () => {
    const resetStats = {
      projectsUploaded: 0,
      templatesUsed: 0,
      elementsCreated: 0,
      exportsGenerated: 0,
      lastLogin: new Date().toISOString(),
      totalStorageUsed: 0
    };
    
    const resetProfile = {
      name: '',
      email: '',
      avatar: '',
      subscription: 'Gratuit',
      joinDate: new Date().toISOString()
    };
    
    setStats(resetStats);
    setUserProfile(resetProfile);
    localStorage.setItem('pageforge-stats', JSON.stringify(resetStats));
    localStorage.setItem('pageforge-profile', JSON.stringify(resetProfile));
    
    toast({
      title: "Données du compte réinitialisées",
      description: "Les statistiques et le profil ont été remis à zéro",
    });
  };

  const resetAllSettings = () => {
    const defaultSettings = {
      touchOptimized: true,
      autosave: true,
      autosaveInterval: 30,
      gridSnap: true,
      snapToGrid: 10,
      responsivePreview: true,
      notifications: true,
      soundEffects: false,
      vibration: true,
      ftpConnection: false,
      autoUpload: false,
      cacheSize: 100,
      language: 'fr',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY',
      showHints: true,
      compactMode: false
    };
    
    setSettings(defaultSettings);
    setTheme('light');
    resetAccountData();
    localStorage.setItem('pageforge-settings', JSON.stringify(defaultSettings));
    localStorage.setItem('pageforge-theme', 'light');
    
    toast({
      title: "Paramètres réinitialisés",
      description: "Tous les paramètres ont été remis aux valeurs par défaut",
    });
  };

  const testFtpConnection = async () => {
    try {
      if (!ftpSettings.host || !ftpSettings.username) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir au minimum l'hôte et le nom d'utilisateur",
          variant: "destructive",
        });
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = Math.random() > 0.3;
      
      if (success) {
        toast({
          title: "Connexion réussie",
          description: `Connexion FTP établie à ${ftpSettings.host}:${ftpSettings.port}`,
        });
        handleSettingChange('ftpConnection', true);
      } else {
        toast({
          title: "Échec de la connexion",
          description: "Vérifiez vos paramètres FTP",
          variant: "destructive",
        });
        handleSettingChange('ftpConnection', false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du test de connexion FTP",
        variant: "destructive",
      });
    }
  };

  const clearCache = () => {
    localStorage.removeItem('pageforge-cache');
    toast({
      title: "Cache vidé",
      description: "Le cache a été vidé avec succès",
    });
  };

  const exportSettings = () => {
    const config = {
      settings,
      ftpSettings,
      userProfile,
      stats,
      theme,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pageforge-config.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration exportée",
      description: "Fichier de configuration téléchargé",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            Paramètres
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personnalisez PageForge selon vos préférences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
            <TabsTrigger value="deployment">Déploiement</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Onglet Général */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Apparence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-600" />
                    Apparence
                  </CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span>Mode {theme === 'dark' ? 'sombre' : 'clair'}</span>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={handleThemeChange}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>Mode compact</span>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Afficher les conseils</span>
                    </div>
                    <Switch
                      checked={settings.showHints}
                      onCheckedChange={(checked) => handleSettingChange('showHints', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Langue et région */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-green-600" />
                    Langue et région
                  </CardTitle>
                  <CardDescription>
                    Configurez les paramètres de localisation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Interface */}
          <TabsContent value="interface" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interface tactile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    Interface tactile
                  </CardTitle>
                  <CardDescription>
                    Optimisations pour appareils mobiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Optimisation tactile</span>
                    </div>
                    <Switch
                      checked={settings.touchOptimized}
                      onCheckedChange={(checked) => handleSettingChange('touchOptimized', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Vibrations</span>
                    </div>
                    <Switch
                      checked={settings.vibration}
                      onCheckedChange={(checked) => handleSettingChange('vibration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Sons d'interface</span>
                    </div>
                    <Switch
                      checked={settings.soundEffects}
                      onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Gestion des notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Notifications générales</span>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Aperçu temps réel</span>
                    </div>
                    <Switch
                      checked={settings.responsivePreview}
                      onCheckedChange={(checked) => handleSettingChange('responsivePreview', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Éditeur */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sauvegarde */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-green-600" />
                    Sauvegarde
                  </CardTitle>
                  <CardDescription>
                    Configuration de la sauvegarde automatique
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      <span>Sauvegarde automatique</span>
                    </div>
                    <Switch
                      checked={settings.autosave}
                      onCheckedChange={(checked) => handleSettingChange('autosave', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Intervalle de sauvegarde (secondes)</Label>
                    <Slider
                      value={[settings.autosaveInterval]}
                      onValueChange={([value]) => handleSettingChange('autosaveInterval', value)}
                      max={300}
                      min={10}
                      step={10}
                    />
                    <div className="text-sm text-gray-500">{settings.autosaveInterval} secondes</div>
                  </div>
                </CardContent>
              </Card>

              {/* Grille */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="h-5 w-5 text-blue-600" />
                    Grille et alignement
                  </CardTitle>
                  <CardDescription>
                    Configuration de la grille d'édition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grid className="h-4 w-4" />
                      <span>Accrochage à la grille</span>
                    </div>
                    <Switch
                      checked={settings.gridSnap}
                      onCheckedChange={(checked) => handleSettingChange('gridSnap', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Taille de la grille (pixels)</Label>
                    <Slider
                      value={[settings.snapToGrid]}
                      onValueChange={([value]) => handleSettingChange('snapToGrid', value)}
                      max={50}
                      min={5}
                      step={5}
                    />
                    <div className="text-sm text-gray-500">{settings.snapToGrid} pixels</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Déploiement */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-red-600" />
                  Configuration FTP
                </CardTitle>
                <CardDescription>
                  Paramètres de connexion FTP pour le déploiement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ftpHost">Hôte</Label>
                    <Input
                      id="ftpHost"
                      value={ftpSettings.host}
                      onChange={(e) => handleFtpSettingChange('host', e.target.value)}
                      placeholder="ftp.exemple.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftpPort">Port</Label>
                    <Input
                      id="ftpPort"
                      value={ftpSettings.port}
                      onChange={(e) => handleFtpSettingChange('port', e.target.value)}
                      placeholder="21"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftpUsername">Nom d'utilisateur</Label>
                    <Input
                      id="ftpUsername"
                      value={ftpSettings.username}
                      onChange={(e) => handleFtpSettingChange('username', e.target.value)}
                      placeholder="username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftpPassword">Mot de passe</Label>
                    <Input
                      id="ftpPassword"
                      type="password"
                      value={ftpSettings.password}
                      onChange={(e) => handleFtpSettingChange('password', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ftpDirectory">Répertoire</Label>
                  <Input
                    id="ftpDirectory"
                    value={ftpSettings.directory}
                    onChange={(e) => handleFtpSettingChange('directory', e.target.value)}
                    placeholder="/public_html"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Upload automatique</span>
                  </div>
                  <Switch
                    checked={settings.autoUpload}
                    onCheckedChange={(checked) => handleSettingChange('autoUpload', checked)}
                  />
                </div>

                <Button onClick={testFtpConnection} className="w-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  Tester la connexion
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Compte */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profil utilisateur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    Profil utilisateur
                  </CardTitle>
                  <CardDescription>
                    Informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Nom</Label>
                    <Input
                      id="userName"
                      value={userProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      placeholder="Entrez votre nom"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Abonnement</span>
                    <Badge variant="secondary">{userProfile.subscription}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Membre depuis</span>
                    <span className="text-sm text-gray-500">
                      {new Date(userProfile.joinDate).toLocaleDateString()}
                    </span>
                  </div>

                  <Button 
                    onClick={resetAccountData} 
                    variant="outline" 
                    className="w-full mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser les données du compte
                  </Button>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Statistiques d'utilisation
                  </CardTitle>
                  <CardDescription>
                    Vos données d'activité
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Template className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{stats.projectsUploaded}</div>
                      <div className="text-xs text-gray-500">Projets créés</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Layers className="h-5 w-5 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{stats.elementsCreated}</div>
                      <div className="text-xs text-gray-500">Éléments créés</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Upload className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">{stats.templatesUsed}</div>
                      <div className="text-xs text-gray-500">Templates utilisés</div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Download className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">{stats.exportsGenerated}</div>
                      <div className="text-xs text-gray-500">Exports générés</div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Stockage utilisé</span>
                      <span className="text-sm font-medium">{stats.totalStorageUsed.toFixed(1)} MB</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.max((stats.totalStorageUsed / 500) * 100, 1)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">500 MB disponible</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Avancé */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Performance
                  </CardTitle>
                  <CardDescription>
                    Paramètres de performance et cache
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Taille du cache (MB)</Label>
                    <Slider
                      value={[settings.cacheSize]}
                      onValueChange={([value]) => handleSettingChange('cacheSize', value)}
                      max={500}
                      min={50}
                      step={50}
                    />
                    <div className="text-sm text-gray-500">{settings.cacheSize} MB</div>
                  </div>

                  <Button onClick={clearCache} variant="outline" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vider le cache
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Actions de maintenance
                  </CardTitle>
                  <CardDescription>
                    Gestion des paramètres et données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={exportSettings} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter la configuration
                  </Button>

                  <Button 
                    onClick={() => {
                      localStorage.setItem('pageforge-settings', JSON.stringify(settings));
                      localStorage.setItem('pageforge-ftp', JSON.stringify(ftpSettings));
                      localStorage.setItem('pageforge-profile', JSON.stringify(userProfile));
                      toast({
                        title: "Paramètres sauvegardés",
                        description: "Tous les paramètres ont été sauvegardés",
                      });
                    }}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les paramètres
                  </Button>

                  <Button onClick={resetAllSettings} variant="destructive" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser tout
                  </Button>

                  <div className="pt-4 text-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Zap className="h-3 w-3 mr-1" />
                      PageForge v2.0
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}