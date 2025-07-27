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

export default function PropertiesPanel({ component, onComponentUpdate }: PropertiesPanelProps) {
  const [localComponent, setLocalComponent] = useState<ComponentDefinition | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  if (!localComponent) {
    return (
      <div className="h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Propriétés</h2>
        </div>
        <div className="p-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Sélectionnez un composant pour voir ses propriétés</p>
          </div>
        </div>
      </div>
    );
  }

  const updateProperty = (path: string, value: any) => {
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
    const duplicatedComponent = {
      ...localComponent,
      id: `component-${Date.now()}`,
    };
    onComponentUpdate(duplicatedComponent);
  };

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    updateProperty('styles.display', newVisibility ? 'block' : 'none');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Propriétés</h2>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={toggleVisibility}>
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDuplicate}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="secondary">{localComponent.type}</Badge>
          <Badge variant="outline">{localComponent.tag}</Badge>
        </div>
      </div>

      <div className="p-4">
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
                      {localComponent.type === "heading" && (
                        <>
                          <SelectItem value="h1">H1</SelectItem>
                          <SelectItem value="h2">H2</SelectItem>
                          <SelectItem value="h3">H3</SelectItem>
                          <SelectItem value="h4">H4</SelectItem>
                          <SelectItem value="h5">H5</SelectItem>
                          <SelectItem value="h6">H6</SelectItem>
                        </>
                      )}
                      {localComponent.type === "text" && (
                        <>
                          <SelectItem value="p">Paragraphe (p)</SelectItem>
                          <SelectItem value="span">Span</SelectItem>
                          <SelectItem value="div">Div</SelectItem>
                        </>
                      )}
                      {localComponent.type === "container" && (
                        <>
                          <SelectItem value="div">Div</SelectItem>
                          <SelectItem value="section">Section</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="aside">Aside</SelectItem>
                        </>
                      )}
                      <SelectItem value={localComponent.tag || "div"}>{localComponent.tag || "div"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {localComponent.type === "image" && (
                  <>
                    <div>
                      <Label htmlFor="src">Source de l'image</Label>
                      <Input
                        id="src"
                        value={getPropertyValue('attributes.src')}
                        onChange={(e) => updateProperty('attributes.src', e.target.value)}
                        placeholder="https://exemple.com/image.jpg"
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
                  </>
                )}

                {localComponent.type === "button" && (
                  <div>
                    <Label htmlFor="onclick">Action au clic</Label>
                    <Input
                      id="onclick"
                      value={getPropertyValue('attributes.onclick')}
                      onChange={(e) => updateProperty('attributes.onclick', e.target.value)}
                      placeholder="alert('Clic!')"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Apparence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commonStyles.map((style) => (
                  <div key={style.name}>
                    <Label htmlFor={style.name}>
                      {style.label}
                      {style.unit && (
                        <span className="text-xs text-gray-500 ml-1">({style.unit})</span>
                      )}
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
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={getPropertyValue(`styles.${style.name}`) || "#000000"}
                          onChange={(e) => updateProperty(`styles.${style.name}`, e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={getPropertyValue(`styles.${style.name}`)}
                          onChange={(e) => updateProperty(`styles.${style.name}`, e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    ) : (
                      <Input
                        id={style.name}
                        value={getPropertyValue(`styles.${style.name}`)}
                        onChange={(e) => updateProperty(`styles.${style.name}`, e.target.value)}
                        placeholder={style.unit ? `Ex: 10px, 1rem` : ""}
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
                <CardTitle className="text-sm">Attributs HTML</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    value={getPropertyValue('attributes.id')}
                    onChange={(e) => updateProperty('attributes.id', e.target.value)}
                    placeholder="mon-composant"
                  />
                </div>

                <div>
                  <Label htmlFor="class">Classes CSS</Label>
                  <Input
                    id="class"
                    value={getPropertyValue('attributes.class')}
                    onChange={(e) => updateProperty('attributes.class', e.target.value)}
                    placeholder="ma-classe autre-classe"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Titre (tooltip)</Label>
                  <Input
                    id="title"
                    value={getPropertyValue('attributes.title')}
                    onChange={(e) => updateProperty('attributes.title', e.target.value)}
                    placeholder="Information au survol"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">CSS personnalisé</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="custom-css">Styles CSS</Label>
                  <Textarea
                    id="custom-css"
                    value={getPropertyValue('customCss')}
                    onChange={(e) => updateProperty('customCss', e.target.value)}
                    placeholder="/* CSS personnalisé */&#10;.mon-style {&#10;  /* propriétés */&#10;}"
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleDuplicate}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer le composant
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer le composant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
