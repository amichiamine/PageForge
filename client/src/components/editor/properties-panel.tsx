import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, Eye, EyeOff } from "lucide-react";
import type { ComponentDefinition } from "@shared/schema";

interface PropertiesPanelProps {
  component: ComponentDefinition | null;
  onComponentUpdate: (component: ComponentDefinition) => void;
  project?: { content?: { pages?: Array<{ content: { structure: ComponentDefinition[] } }> } };
  onComponentSelect?: (component: ComponentDefinition) => void;
  onComponentDelete?: (componentId: string) => void;
}

interface StyleProperty {
  name: string;
  label: string;
  type: "text" | "select" | "color" | "number";
  options?: string[];
  unit?: string;
}

const commonStyles: StyleProperty[] = [
  { name: "width", label: "Largeur", type: "text", unit: "px, %, auto" },
  { name: "height", label: "Hauteur", type: "text", unit: "px, %, auto" },
  { name: "margin", label: "Marge", type: "text", unit: "px, rem" },
  { name: "padding", label: "Espacement", type: "text", unit: "px, rem" },
  { name: "backgroundColor", label: "Couleur de fond", type: "color" },
  { name: "color", label: "Couleur du texte", type: "color" },
  { name: "fontSize", label: "Taille de police", type: "text", unit: "px, rem, em" },
  { name: "fontWeight", label: "Graisse", type: "select", options: ["normal", "bold", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "textAlign", label: "Alignement", type: "select", options: ["left", "center", "right", "justify"] },
  { name: "display", label: "Affichage", type: "select", options: ["block", "inline", "inline-block", "flex", "grid", "none"] },
  { name: "position", label: "Position", type: "select", options: ["static", "relative", "absolute", "fixed", "sticky"] },
  { name: "borderRadius", label: "Bordure arrondie", type: "text", unit: "px, rem, %" },
  { name: "border", label: "Bordure", type: "text" },
  { name: "boxShadow", label: "Ombre", type: "text" },
];

export default function PropertiesPanel({ 
  component, 
  onComponentUpdate, 
  project, 
  onComponentSelect, 
  onComponentDelete 
}: PropertiesPanelProps) {
  const [localComponent, setLocalComponent] = useState<ComponentDefinition | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  const updateProperty = (path: string, value: any) => {
    if (!localComponent) return;
    
    const updatedComponent = { ...localComponent };
    const pathParts = path.split('.');
    
    let current: any = updatedComponent;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    const lastPart = pathParts[pathParts.length - 1];
    current[lastPart] = value;
    
    setLocalComponent(updatedComponent);
    onComponentUpdate(updatedComponent);
  };

  const getPropertyValue = (path: string): any => {
    const pathParts = path.split('.');
    let current: any = localComponent;
    
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return '';
      }
    }
    
    return current || '';
  };

  const handleDuplicate = () => {
    if (!localComponent) return;
    
    const duplicatedComponent: ComponentDefinition = {
      ...localComponent,
      id: `component-${Date.now()}`,
      children: localComponent.children?.map(child => ({
        ...child,
        id: `component-${Date.now()}-${Math.random()}`
      })) || []
    };
    
    onComponentUpdate(duplicatedComponent);
  };

  const handleDelete = () => {
    if (!localComponent || !onComponentDelete) return;
    onComponentDelete(localComponent.id);
  };

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    updateProperty('styles.display', newVisibility ? 'block' : 'none');
  };

  // Get all components from project structure for the component list
  const getAllComponents = (components: ComponentDefinition[]): ComponentDefinition[] => {
    const allComponents: ComponentDefinition[] = [];
    
    const traverse = (comps: ComponentDefinition[]) => {
      comps.forEach(comp => {
        allComponents.push(comp);
        if (comp.children) {
          traverse(comp.children);
        }
      });
    };
    
    traverse(components);
    return allComponents;
  };

  const allComponents = project?.content?.pages?.[0]?.content?.structure ? 
    getAllComponents(project.content.pages[0].content.structure) : [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Propriétés</h2>
      </div>

      {/* Component List */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Composants ({allComponents.length})</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {allComponents.map((comp) => (
            <div
              key={comp.id}
              className={`p-2 rounded cursor-pointer text-xs flex items-center justify-between hover:bg-gray-100 ${
                comp.id === component?.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
              }`}
              onClick={() => onComponentSelect?.(comp)}
            >
              <span className="truncate">
                <Badge variant="outline" className="mr-2 text-xs">{comp.type}</Badge>
                {comp.content?.slice(0, 20) || `${comp.type} component`}
              </span>
              {comp.id === component?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              )}
            </div>
          ))}
          {allComponents.length === 0 && (
            <p className="text-gray-500 text-xs">Aucun composant ajouté</p>
          )}
        </div>
      </div>

      {!localComponent ? (
        <div className="p-4">
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Eye className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Sélectionnez un composant pour voir ses propriétés</p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{localComponent.type}</Badge>
              <Badge variant="outline">{localComponent.tag}</Badge>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={toggleVisibility}>
                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDuplicate}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contenu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {localComponent.type !== "image" && (
                    <div>
                      <Label htmlFor="content">Texte</Label>
                      <Textarea
                        id="content"
                        value={getPropertyValue('content')}
                        onChange={(e) => updateProperty('content', e.target.value)}
                        placeholder="Contenu du composant..."
                        rows={3}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="tag">Balise HTML</Label>
                    <Select
                      value={getPropertyValue('tag')}
                      onValueChange={(value) => updateProperty('tag', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="div">div</SelectItem>
                        <SelectItem value="section">section</SelectItem>
                        <SelectItem value="article">article</SelectItem>
                        <SelectItem value="header">header</SelectItem>
                        <SelectItem value="footer">footer</SelectItem>
                        <SelectItem value="main">main</SelectItem>
                        <SelectItem value="aside">aside</SelectItem>
                        <SelectItem value="nav">nav</SelectItem>
                        <SelectItem value="h1">h1</SelectItem>
                        <SelectItem value="h2">h2</SelectItem>
                        <SelectItem value="h3">h3</SelectItem>
                        <SelectItem value="h4">h4</SelectItem>
                        <SelectItem value="h5">h5</SelectItem>
                        <SelectItem value="h6">h6</SelectItem>
                        <SelectItem value="p">p</SelectItem>
                        <SelectItem value="span">span</SelectItem>
                        <SelectItem value="a">a</SelectItem>
                        <SelectItem value="button">button</SelectItem>
                        <SelectItem value="img">img</SelectItem>
                        <SelectItem value="ul">ul</SelectItem>
                        <SelectItem value="ol">ol</SelectItem>
                        <SelectItem value="li">li</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Image specific properties */}
                  {localComponent.type === "image" && (
                    <>
                      <div>
                        <Label htmlFor="src">URL de l'image</Label>
                        <Input
                          id="src"
                          value={getPropertyValue('attributes.src')}
                          onChange={(e) => updateProperty('attributes.src', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alt">Texte alternatif</Label>
                        <Input
                          id="alt"
                          value={getPropertyValue('attributes.alt')}
                          onChange={(e) => updateProperty('attributes.alt', e.target.value)}
                          placeholder="Description de l'image"
                        />
                      </div>
                      <div>
                        <Label htmlFor="width">Largeur</Label>
                        <Input
                          id="width"
                          value={getPropertyValue('attributes.width')}
                          onChange={(e) => updateProperty('attributes.width', e.target.value)}
                          placeholder="400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Hauteur</Label>
                        <Input
                          id="height"
                          value={getPropertyValue('attributes.height')}
                          onChange={(e) => updateProperty('attributes.height', e.target.value)}
                          placeholder="300"
                        />
                      </div>
                    </>
                  )}

                  {/* Link specific properties */}
                  {localComponent.type === "link" && (
                    <>
                      <div>
                        <Label htmlFor="href">URL du lien</Label>
                        <Input
                          id="href"
                          value={getPropertyValue('attributes.href')}
                          onChange={(e) => updateProperty('attributes.href', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="target">Cible</Label>
                        <Select
                          value={getPropertyValue('attributes.target')}
                          onValueChange={(value) => updateProperty('attributes.target', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_self">Même fenêtre</SelectItem>
                            <SelectItem value="_blank">Nouvelle fenêtre</SelectItem>
                            <SelectItem value="_parent">Fenêtre parent</SelectItem>
                            <SelectItem value="_top">Fenêtre principale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Button specific properties */}
                  {localComponent.type === "button" && (
                    <div>
                      <Label htmlFor="buttonType">Type de bouton</Label>
                      <Select
                        value={getPropertyValue('attributes.type')}
                        onValueChange={(value) => updateProperty('attributes.type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="button">Bouton</SelectItem>
                          <SelectItem value="submit">Envoyer</SelectItem>
                          <SelectItem value="reset">Réinitialiser</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Form input specific properties */}
                  {localComponent.type === "input" && (
                    <>
                      <div>
                        <Label htmlFor="inputType">Type d'input</Label>
                        <Select
                          value={getPropertyValue('attributes.type')}
                          onValueChange={(value) => updateProperty('attributes.type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texte</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="password">Mot de passe</SelectItem>
                            <SelectItem value="number">Nombre</SelectItem>
                            <SelectItem value="tel">Téléphone</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="placeholder">Placeholder</Label>
                        <Input
                          id="placeholder"
                          value={getPropertyValue('attributes.placeholder')}
                          onChange={(e) => updateProperty('attributes.placeholder', e.target.value)}
                          placeholder="Texte d'aide"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="required"
                          checked={getPropertyValue('attributes.required') || false}
                          onChange={(e) => updateProperty('attributes.required', e.target.checked)}
                        />
                        <Label htmlFor="required">Obligatoire</Label>
                      </div>
                    </>
                  )}

                  {/* Carousel specific properties */}
                  {localComponent.type === "carousel" && (
                    <>
                      <div>
                        <Label>Gestion des slides</Label>
                        <div className="space-y-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Add new slide functionality
                              const newSlide = {
                                id: `slide-${Date.now()}`,
                                type: "carousel-item",
                                tag: "div",
                                content: `Nouveau slide ${(localComponent.children?.length || 0) + 1}`,
                                styles: {
                                  display: "none",
                                  textAlign: "center",
                                  padding: "60px 20px"
                                },
                                attributes: { className: "carousel-item" },
                                children: []
                              };
                              
                              const updatedComponent = {
                                ...localComponent,
                                children: [...(localComponent.children || []), newSlide]
                              };
                              
                              setLocalComponent(updatedComponent);
                              onComponentUpdate(updatedComponent);
                            }}
                          >
                            Ajouter un slide
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="autoPlay">Lecture automatique</Label>
                        <Select
                          value={getPropertyValue('attributes.data-autoplay') || "false"}
                          onValueChange={(value) => updateProperty('attributes.data-autoplay', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Non</SelectItem>
                            <SelectItem value="true">Oui</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Styles CSS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonStyles.map((style) => (
                    <div key={style.name}>
                      <Label htmlFor={style.name}>
                        {style.label}
                        {style.unit && <span className="text-xs text-gray-500 ml-1">({style.unit})</span>}
                      </Label>
                      {style.type === "select" ? (
                        <Select
                          value={getPropertyValue(`styles.${style.name}`)}
                          onValueChange={(value) => updateProperty(`styles.${style.name}`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {style.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : style.type === "color" ? (
                        <Input
                          id={style.name}
                          type="color"
                          value={getPropertyValue(`styles.${style.name}`) || "#000000"}
                          onChange={(e) => updateProperty(`styles.${style.name}`, e.target.value)}
                          className="w-full h-10"
                        />
                      ) : (
                        <Input
                          id={style.name}
                          value={getPropertyValue(`styles.${style.name}`)}
                          onChange={(e) => updateProperty(`styles.${style.name}`, e.target.value)}
                          placeholder={`Ex: 20px, 1rem, auto`}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDuplicate}
                    className="w-full justify-start"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer le composant
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDelete}
                    className="w-full justify-start"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer le composant
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Classes CSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="className">Classes personnalisées</Label>
                    <Input
                      id="className"
                      value={getPropertyValue('attributes.className')}
                      onChange={(e) => updateProperty('attributes.className', e.target.value)}
                      placeholder="classe1 classe2 classe3"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Attributs HTML</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="id">ID</Label>
                    <Input
                      id="id"
                      value={getPropertyValue('attributes.id')}
                      onChange={(e) => updateProperty('attributes.id', e.target.value)}
                      placeholder="identifiant-unique"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}