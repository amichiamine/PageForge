import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Database, 
  FileText, 
  Palette, 
  Code, 
  CheckCircle,
  Smartphone,
  Monitor,
  User,
  Shield,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface SettingsConfig {
  general: {
    appName: string;
    language: string;
    description: string;
  };
  editor: {
    autoSave: boolean;
    snapToGrid: boolean;
    showGuides: boolean;
    defaultUnit: string;
    touchMode: boolean;
    doubleClickInsert: boolean;
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
    showTooltips: boolean;
  };
  responsive: {
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    defaultView: string;
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
    editor: {
      autoSave: true,
      snapToGrid: false,
      showGuides: true,
      defaultUnit: "px",
      touchMode: false,
      doubleClickInsert: true
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
      compactMode: false,
      showTooltips: true
    },
    responsive: {
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280
      },
      defaultView: "desktop"
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pageforge-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
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
      localStorage.setItem('pageforge-settings', JSON.stringify(settings));
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

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pageforge-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(imported);
          setHasChanges(true);
          toast({
            title: "Paramètres importés",
            description: "Configuration importée avec succès.",
          });
        } catch (error) {
          toast({
            title: "Erreur d'import",
            description: "Le fichier de configuration est invalide.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configurez PageForge selon vos préférences
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 flex items-center">
              Modifications non sauvegardées
            </span>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !hasChanges}
            className="w-full sm:w-auto"
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
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="appearance">Interface</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Paramètres généraux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Paramètres généraux</span>
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select 
                    value={settings.general.language}
                    onValueChange={(value) => updateSetting('general', 'language', value)}
                  >
                    <SelectTrigger className="mt-1">
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
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={settings.general.description}
                  onChange={(e) => updateSetting('general', 'description', e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Import/Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Sauvegarde & Restauration</span>
              </CardTitle>
              <CardDescription>
                Gérez vos configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={exportSettings} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les paramètres
                </Button>
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                    id="import-settings"
                  />
                  <Button
                    onClick={() => document.getElementById('import-settings')?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importer les paramètres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Éditeur visuel</span>
              </CardTitle>
              <CardDescription>
                Paramètres de l'éditeur de composants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="touchMode">Mode tactile</Label>
                  <p className="text-sm text-gray-600">Optimisations pour tablettes et smartphones</p>
                </div>
                <Switch 
                  id="touchMode" 
                  checked={settings.editor.touchMode}
                  onCheckedChange={(checked) => updateSetting('editor', 'touchMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="doubleClickInsert">Insertion par double-clic</Label>
                  <p className="text-sm text-gray-600">Alternative au glisser-déposer pour les appareils tactiles</p>
                </div>
                <Switch 
                  id="doubleClickInsert" 
                  checked={settings.editor.doubleClickInsert}
                  onCheckedChange={(checked) => updateSetting('editor', 'doubleClickInsert', checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultUnit">Unité par défaut</Label>
                  <Select 
                    value={settings.editor.defaultUnit}
                    onValueChange={(value) => updateSetting('editor', 'defaultUnit', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="px">px</SelectItem>
                      <SelectItem value="rem">rem</SelectItem>
                      <SelectItem value="em">em</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                      <SelectItem value="vw">vw</SelectItem>
                      <SelectItem value="vh">vh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responsive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Design Responsive</span>
              </CardTitle>
              <CardDescription>
                Configuration des points de rupture et affichage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Points de rupture (breakpoints)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="mobile" className="text-sm">Mobile (max-width)</Label>
                    <Input 
                      id="mobile"
                      type="number"
                      value={settings.responsive.breakpoints.mobile}
                      onChange={(e) => updateSetting('responsive', 'breakpoints', {
                        ...settings.responsive.breakpoints,
                        mobile: parseInt(e.target.value) || 768
                      })}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                  <div>
                    <Label htmlFor="tablet" className="text-sm">Tablette (max-width)</Label>
                    <Input 
                      id="tablet"
                      type="number"
                      value={settings.responsive.breakpoints.tablet}
                      onChange={(e) => updateSetting('responsive', 'breakpoints', {
                        ...settings.responsive.breakpoints,
                        tablet: parseInt(e.target.value) || 1024
                      })}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                  <div>
                    <Label htmlFor="desktop" className="text-sm">Desktop (min-width)</Label>
                    <Input 
                      id="desktop"
                      type="number"
                      value={settings.responsive.breakpoints.desktop}
                      onChange={(e) => updateSetting('responsive', 'breakpoints', {
                        ...settings.responsive.breakpoints,
                        desktop: parseInt(e.target.value) || 1280
                      })}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="defaultView">Vue par défaut</Label>
                <Select 
                  value={settings.responsive.defaultView}
                  onValueChange={(value) => updateSetting('responsive', 'defaultView', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="tablet">Tablette</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Export et génération</span>
              </CardTitle>
              <CardDescription>
                Paramètres d'export des projets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="exportFormat">Format d'export par défaut</Label>
                <Select 
                  value={settings.export.format}
                  onValueChange={(value) => updateSetting('export', 'format', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML + CSS + JS</SelectItem>
                    <SelectItem value="react">Composants React</SelectItem>
                    <SelectItem value="vue">Composants Vue</SelectItem>
                    <SelectItem value="angular">Composants Angular</SelectItem>
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
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun (CSS vanilla)</SelectItem>
                    <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                    <SelectItem value="bootstrap">Bootstrap</SelectItem>
                    <SelectItem value="bulma">Bulma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Apparence</span>
              </CardTitle>
              <CardDescription>
                Personnalisez l'interface de PageForge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select 
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                  >
                    <SelectTrigger className="mt-1">
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
                  <Input 
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compactMode">Mode compact</Label>
                  <p className="text-sm text-gray-600">Interface condensée pour plus d'espace</p>
                </div>
                <Switch 
                  id="compactMode" 
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showTooltips">Afficher les info-bulles</Label>
                  <p className="text-sm text-gray-600">Aide contextuelle sur les éléments</p>
                </div>
                <Switch 
                  id="showTooltips" 
                  checked={settings.appearance.showTooltips}
                  onCheckedChange={(checked) => updateSetting('appearance', 'showTooltips', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}