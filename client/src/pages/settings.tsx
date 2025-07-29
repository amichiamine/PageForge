import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Save, Database, FileText, Palette, Code, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsConfig {
  general: {
    appName: string;
    language: string;
    description: string;
  };
  database: {
    url: string;
    host: string;
    port: string;
    name: string;
    user: string;
  };
  editor: {
    autoSave: boolean;
    snapToGrid: boolean;
    showGuides: boolean;
    defaultUnit: string;
  };
  export: {
    format: string;
    minifyCode: boolean;
    includeComments: boolean;
    cssFramework: string;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    compactMode: boolean;
  };
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsConfig>({
    general: {
      appName: "PageForge",
      language: "fr",
      description: "Créateur de sites web visuel et portable pour intégration VS Code"
    },
    database: {
      url: "",
      host: "localhost",
      port: "5432",
      name: "",
      user: ""
    },
    editor: {
      autoSave: true,
      snapToGrid: false,
      showGuides: true,
      defaultUnit: "px"
    },
    export: {
      format: "html",
      minifyCode: true,
      includeComments: true,
      cssFramework: "none"
    },
    appearance: {
      theme: "light",
      primaryColor: "#0ea5e9",
      compactMode: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pageforge-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSetting = (section: keyof SettingsConfig, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('pageforge-settings', JSON.stringify(settings));
      
      // In a real app, you would also save to your backend
      // await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) });
      
      setHasChanges(false);
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été enregistrés avec succès.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings: SettingsConfig = {
      general: {
        appName: "PageForge",
        language: "fr",
        description: "Créateur de sites web visuel et portable pour intégration VS Code"
      },
      database: {
        url: "",
        host: "localhost",
        port: "5432",
        name: "",
        user: ""
      },
      editor: {
        autoSave: true,
        snapToGrid: false,
        showGuides: true,
        defaultUnit: "px"
      },
      export: {
        format: "html",
        minifyCode: true,
        includeComments: true,
        cssFramework: "none"
      },
      appearance: {
        theme: "light",
        primaryColor: "#0ea5e9",
        compactMode: false
      }
    };
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const testDatabaseConnection = async () => {
    toast({
      title: "Test de connexion",
      description: "Fonctionnalité à implémenter avec le backend.",
    });
  };

  return (
    <>
      <Header 
        title="Configuration"
        subtitle="Paramètres généraux de l'application"
        actions={
          <div className="flex gap-2">
            {hasChanges && (
              <span className="text-sm text-amber-600 flex items-center">
                Modifications non sauvegardées
              </span>
            )}
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <>Sauvegarde...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        }
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Paramètres généraux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Paramètres généraux
                </CardTitle>
                <CardDescription>
                  Configuration de base de PageForge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appName">Nom de l'application</Label>
                    <Input 
                      id="appName" 
                      value={settings.general.appName}
                      onChange={(e) => updateSetting('general', 'appName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select 
                      value={settings.general.language}
                      onValueChange={(value) => updateSetting('general', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={settings.general.description}
                    onChange={(e) => updateSetting('general', 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Base de données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Base de données
                </CardTitle>
                <CardDescription>
                  Configuration de la base de données PostgreSQL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dbUrl">URL de connexion</Label>
                  <Input 
                    id="dbUrl" 
                    type="password"
                    value={settings.database.url}
                    onChange={(e) => updateSetting('database', 'url', e.target.value)}
                    placeholder="postgresql://user:password@localhost:5432/dbname"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dbHost">Hôte</Label>
                    <Input 
                      id="dbHost" 
                      value={settings.database.host}
                      onChange={(e) => updateSetting('database', 'host', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dbPort">Port</Label>
                    <Input 
                      id="dbPort" 
                      value={settings.database.port}
                      onChange={(e) => updateSetting('database', 'port', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dbName">Nom de la base</Label>
                    <Input 
                      id="dbName" 
                      value={settings.database.name}
                      onChange={(e) => updateSetting('database', 'name', e.target.value)}
                      placeholder="sitejet_clone" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="dbUser">Utilisateur</Label>
                    <Input 
                      id="dbUser" 
                      value={settings.database.user}
                      onChange={(e) => updateSetting('database', 'user', e.target.value)}
                      placeholder="postgres" 
                    />
                  </div>
                </div>
                
                <Button variant="outline" size="sm" onClick={testDatabaseConnection}>
                  Tester la connexion
                </Button>
              </CardContent>
            </Card>

            {/* Éditeur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Éditeur visuel
                </CardTitle>
                <CardDescription>
                  Paramètres de l'éditeur de composants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSave">Sauvegarde automatique</Label>
                    <p className="text-sm text-gray-600">Sauvegarder automatiquement les modifications</p>
                  </div>
                  <Switch 
                    id="autoSave" 
                    checked={settings.editor.autoSave}
                    onCheckedChange={(checked) => updateSetting('editor', 'autoSave', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="snapToGrid">Alignement sur grille</Label>
                    <p className="text-sm text-gray-600">Aligner automatiquement les composants</p>
                  </div>
                  <Switch 
                    id="snapToGrid" 
                    checked={settings.editor.snapToGrid}
                    onCheckedChange={(checked) => updateSetting('editor', 'snapToGrid', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showGuides">Guides d'alignement</Label>
                    <p className="text-sm text-gray-600">Afficher les guides lors du déplacement</p>
                  </div>
                  <Switch 
                    id="showGuides" 
                    checked={settings.editor.showGuides}
                    onCheckedChange={(checked) => updateSetting('editor', 'showGuides', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="defaultUnit">Unité par défaut</Label>
                  <Select 
                    value={settings.editor.defaultUnit}
                    onValueChange={(value) => updateSetting('editor', 'defaultUnit', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="px">px</SelectItem>
                      <SelectItem value="rem">rem</SelectItem>
                      <SelectItem value="em">em</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Export et génération
                </CardTitle>
                <CardDescription>
                  Paramètres d'export des projets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="exportFormat">Format d'export par défaut</Label>
                  <Select 
                    value={settings.export.format}
                    onValueChange={(value) => updateSetting('export', 'format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">HTML + CSS + JS</SelectItem>
                      <SelectItem value="react">Composants React</SelectItem>
                      <SelectItem value="vue">Composants Vue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="minifyCode">Minifier le code</Label>
                    <p className="text-sm text-gray-600">Optimiser la taille des fichiers exportés</p>
                  </div>
                  <Switch 
                    id="minifyCode" 
                    checked={settings.export.minifyCode}
                    onCheckedChange={(checked) => updateSetting('export', 'minifyCode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="includeComments">Inclure les commentaires</Label>
                    <p className="text-sm text-gray-600">Ajouter des commentaires dans le code généré</p>
                  </div>
                  <Switch 
                    id="includeComments" 
                    checked={settings.export.includeComments}
                    onCheckedChange={(checked) => updateSetting('export', 'includeComments', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cssFramework">Framework CSS</Label>
                  <Select 
                    value={settings.export.cssFramework}
                    onValueChange={(value) => updateSetting('export', 'cssFramework', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                      <SelectItem value="bootstrap">Bootstrap</SelectItem>
                      <SelectItem value="bulma">Bulma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Thème */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisation de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select 
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="primaryColor" 
                      type="color" 
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input 
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode">Mode compact</Label>
                    <p className="text-sm text-gray-600">Interface plus dense</p>
                  </div>
                  <Switch 
                    id="compactMode" 
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <>Sauvegarde en cours...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder les modifications
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}